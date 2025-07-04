import React, { useState, useRef, useEffect } from "react";
import AudioEngine from "../utils/AudioEngine";

const RecordingStudio = ({ onNavigate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [effects, setEffects] = useState({
    reverb: 0.3,
    pitch: 0,
    autoTune: false,
    echo: 0.2,
  });

  const audioEngineRef = useRef(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    audioEngineRef.current = new AudioEngine();

    // Setup visualization canvas
    if (canvasRef.current) {
      audioEngineRef.current.setupVisualization(canvasRef.current);
    }

    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.cleanup();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      await audioEngineRef.current.startRecording();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start visualization
      audioEngineRef.current.startVisualization();
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert(
        "Izin akses mikrofon diperlukan untuk merekam. Harap izinkan akses mikrofon dan coba lagi.\n\nFitur perekaman akan bekerja setelah Anda memberikan izin.",
      );
    }
  };

  const stopRecording = async () => {
    try {
      const recordingData = await audioEngineRef.current.stopRecording();
      setIsRecording(false);

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Add to recordings list
      const newRecording = {
        id: Date.now(),
        title: `Recording ${recordings.length + 1}`,
        duration: recordingTime,
        timestamp: new Date(),
        url: recordingData.url,
        blob: recordingData.blob,
      };

      setRecordings((prev) => [newRecording, ...prev]);
      setCurrentRecording(newRecording);
      setRecordingTime(0);

      audioEngineRef.current.stopVisualization();
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  const playRecording = (recording) => {
    const audio = new Audio(recording.url);
    audio.play();
  };

  const deleteRecording = (recordingId) => {
    setRecordings((prev) => prev.filter((r) => r.id !== recordingId));
    if (currentRecording?.id === recordingId) {
      setCurrentRecording(null);
    }
  };

  const downloadRecording = (recording) => {
    const link = document.createElement("a");
    link.href = recording.url;
    link.download = `${recording.title}.webm`;
    link.click();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (date) => {
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleEffectChange = (effect, value) => {
    setEffects((prev) => ({ ...prev, [effect]: value }));

    // Apply effect to audio engine
    if (audioEngineRef.current) {
      switch (effect) {
        case "reverb":
          audioEngineRef.current.setReverb(value);
          break;
        case "pitch":
          audioEngineRef.current.setPitch(value);
          break;
        case "autoTune":
          audioEngineRef.current.setAutoTune(value);
          break;
        default:
          break;
      }
    }
  };

  return (
    <div style={styles.container} className="fade-in">
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🎙️ Recording Studio</h1>
          <p style={styles.subtitle}>
            Record your voice with professional effects
          </p>
        </div>

        {/* Main Recording Interface */}
        <div style={styles.recordingInterface}>
          {/* Visualization */}
          <div style={styles.visualizationContainer}>
            <canvas
              ref={canvasRef}
              style={styles.canvas}
              width="600"
              height="150"
            />
            {!isRecording && (
              <div style={styles.visualizationOverlay}>
                <p style={styles.overlayText}>
                  Start recording to see waveform
                </p>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div style={styles.controlsContainer}>
            <div style={styles.mainControls}>
              <div style={styles.recordingTimer}>
                {formatTime(recordingTime)}
              </div>

              <button
                className={`btn ${isRecording ? "btn-danger" : "btn-primary"}`}
                onClick={isRecording ? stopRecording : startRecording}
                style={styles.recordButton}
              >
                <i
                  className={`fas ${isRecording ? "fa-stop" : "fa-microphone"}`}
                ></i>
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>

              {isRecording && (
                <div style={styles.recordingIndicator} className="pulse">
                  <i className="fas fa-circle" style={styles.recordingDot}></i>
                  Recording...
                </div>
              )}
            </div>
          </div>

          {/* Effects Panel */}
          <div style={styles.effectsPanel}>
            <h3 style={styles.effectsTitle}>🎛️ Voice Effects</h3>

            <div style={styles.effectsGrid}>
              <div style={styles.effectControl}>
                <label style={styles.effectLabel}>Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={styles.slider}
                />
                <span style={styles.effectValue}>
                  {Math.round(volume * 100)}%
                </span>
              </div>

              <div style={styles.effectControl}>
                <label style={styles.effectLabel}>Reverb</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={effects.reverb}
                  onChange={(e) =>
                    handleEffectChange("reverb", parseFloat(e.target.value))
                  }
                  style={styles.slider}
                />
                <span style={styles.effectValue}>
                  {Math.round(effects.reverb * 100)}%
                </span>
              </div>

              <div style={styles.effectControl}>
                <label style={styles.effectLabel}>Pitch</label>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={effects.pitch}
                  onChange={(e) =>
                    handleEffectChange("pitch", parseInt(e.target.value))
                  }
                  style={styles.slider}
                />
                <span style={styles.effectValue}>
                  {effects.pitch > 0 ? "+" : ""}
                  {effects.pitch}
                </span>
              </div>

              <div style={styles.effectControl}>
                <label style={styles.effectLabel}>Echo</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={effects.echo}
                  onChange={(e) =>
                    handleEffectChange("echo", parseFloat(e.target.value))
                  }
                  style={styles.slider}
                />
                <span style={styles.effectValue}>
                  {Math.round(effects.echo * 100)}%
                </span>
              </div>

              <div style={styles.effectControl}>
                <label style={styles.effectLabel}>Auto-Tune</label>
                <button
                  className={`btn ${effects.autoTune ? "btn-primary" : "btn-secondary"}`}
                  onClick={() =>
                    handleEffectChange("autoTune", !effects.autoTune)
                  }
                  style={styles.toggleButton}
                >
                  {effects.autoTune ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recordings Library */}
        <div style={styles.recordingsSection}>
          <h2 style={styles.sectionTitle}>📚 Your Recordings</h2>

          {recordings.length === 0 ? (
            <div style={styles.emptyState}>
              <i className="fas fa-microphone-alt" style={styles.emptyIcon}></i>
              <h3 style={styles.emptyTitle}>No recordings yet</h3>
              <p style={styles.emptyText}>
                Start recording to see your performances here
              </p>
            </div>
          ) : (
            <div style={styles.recordingsGrid}>
              {recordings.map((recording) => (
                <RecordingCard
                  key={recording.id}
                  recording={recording}
                  onPlay={() => playRecording(recording)}
                  onDelete={() => deleteRecording(recording.id)}
                  onDownload={() => downloadRecording(recording)}
                  formatTime={formatTime}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div style={styles.tipsSection}>
          <h3 style={styles.tipsTitle}>💡 Recording Tips</h3>
          <div style={styles.tipsGrid}>
            <TipCard
              icon="fas fa-microphone"
              title="Microphone Distance"
              tip="Keep 6-8 inches away from your microphone for best sound quality"
            />
            <TipCard
              icon="fas fa-volume-down"
              title="Room Acoustics"
              tip="Record in a quiet room with soft furnishings to reduce echo"
            />
            <TipCard
              icon="fas fa-headphones"
              title="Monitor Your Voice"
              tip="Use headphones to hear yourself clearly while recording"
            />
            <TipCard
              icon="fas fa-magic"
              title="Use Effects Wisely"
              tip="Start with subtle effects and adjust to enhance your natural voice"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const RecordingCard = ({
  recording,
  onPlay,
  onDelete,
  onDownload,
  formatTime,
  formatDate,
}) => (
  <div className="card" style={styles.recordingCard}>
    <div style={styles.recordingHeader}>
      <h4 style={styles.recordingTitle}>{recording.title}</h4>
      <div style={styles.recordingMeta}>
        <span style={styles.duration}>{formatTime(recording.duration)}</span>
        <span style={styles.timestamp}>{formatDate(recording.timestamp)}</span>
      </div>
    </div>

    <div style={styles.recordingControls}>
      <button
        className="btn btn-primary"
        onClick={onPlay}
        style={styles.recordingButton}
      >
        <i className="fas fa-play"></i>
        Play
      </button>

      <button
        className="btn btn-secondary"
        onClick={onDownload}
        style={styles.recordingButton}
      >
        <i className="fas fa-download"></i>
        Download
      </button>

      <button
        className="btn btn-danger"
        onClick={onDelete}
        style={styles.recordingButton}
      >
        <i className="fas fa-trash"></i>
        Delete
      </button>
    </div>
  </div>
);

const TipCard = ({ icon, title, tip }) => (
  <div className="card" style={styles.tipCard}>
    <div style={styles.tipIcon}>
      <i className={icon}></i>
    </div>
    <h4 style={styles.tipTitle}>{title}</h4>
    <p style={styles.tipText}>{tip}</p>
  </div>
);

const styles = {
  container: {
    paddingTop: "30px",
    paddingBottom: "40px",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "10px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1.1rem",
    opacity: 0.8,
  },
  recordingInterface: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "40px",
    backdropFilter: "blur(10px)",
  },
  visualizationContainer: {
    position: "relative",
    textAlign: "center",
    marginBottom: "30px",
  },
  canvas: {
    background: "rgba(0,0,0,0.3)",
    borderRadius: "15px",
    border: "1px solid rgba(255,255,255,0.2)",
    maxWidth: "100%",
    height: "auto",
  },
  visualizationOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },
  overlayText: {
    opacity: 0.6,
    fontSize: "1.1rem",
  },
  controlsContainer: {
    textAlign: "center",
    marginBottom: "30px",
  },
  mainControls: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  recordingTimer: {
    fontSize: "3rem",
    fontWeight: "700",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "monospace",
  },
  recordButton: {
    padding: "15px 30px",
    fontSize: "1.2rem",
    fontWeight: "600",
  },
  recordingIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  recordingDot: {
    color: "#ff4757",
    fontSize: "0.8rem",
  },
  effectsPanel: {
    background: "rgba(0,0,0,0.2)",
    borderRadius: "15px",
    padding: "25px",
  },
  effectsTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "20px",
    textAlign: "center",
  },
  effectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  effectControl: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  effectLabel: {
    fontWeight: "500",
    fontSize: "0.9rem",
    opacity: 0.9,
  },
  slider: {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    background: "rgba(255,255,255,0.2)",
    outline: "none",
    appearance: "none",
  },
  effectValue: {
    fontSize: "0.9rem",
    fontWeight: "600",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  toggleButton: {
    width: "80px",
    padding: "8px 16px",
  },
  recordingsSection: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "25px",
    textAlign: "center",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    opacity: 0.7,
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "20px",
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: "1rem",
    opacity: 0.8,
  },
  recordingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  recordingCard: {
    padding: "20px",
  },
  recordingHeader: {
    marginBottom: "15px",
  },
  recordingTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "8px",
  },
  recordingMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    opacity: 0.7,
  },
  recordingControls: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  recordingButton: {
    flex: 1,
    minWidth: "80px",
    padding: "8px 12px",
    fontSize: "0.9rem",
  },
  tipsSection: {
    marginTop: "40px",
  },
  tipsTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "25px",
    textAlign: "center",
  },
  tipsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  tipCard: {
    textAlign: "center",
    padding: "25px 20px",
  },
  tipIcon: {
    fontSize: "2.5rem",
    marginBottom: "15px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  tipTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  tipText: {
    opacity: 0.8,
    lineHeight: 1.5,
    fontSize: "0.95rem",
  },
};

export default RecordingStudio;
