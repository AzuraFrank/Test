import React, { useState, useEffect, useRef } from "react";
import AudioEngine from "../utils/AudioEngine";

const KaraokePlayer = ({ song, onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [pitch, setPitch] = useState(0);
  const [reverb, setReverb] = useState(0.3);
  const [autoTune, setAutoTune] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  const audioEngineRef = useRef(null);
  const canvasRef = useRef(null);

  // Sample lyrics with timestamps
  const lyrics = [
    { time: 0, text: "♪ Music starts..." },
    { time: 5, text: "I found a love for me" },
    { time: 9, text: "Darling, just dive right in" },
    { time: 12, text: "And follow my lead" },
    { time: 15, text: "Well, I found a girl" },
    { time: 19, text: "Beautiful and sweet" },
    { time: 23, text: "Oh, I never knew you" },
    { time: 26, text: "Were the someone waiting for me" },
    { time: 30, text: "'Cause we were just kids" },
    { time: 33, text: "When we fell in love" },
    { time: 37, text: "Not knowing what it was" },
    { time: 41, text: "I will not give you up this time" },
  ];

  useEffect(() => {
    // Initialize audio engine
    audioEngineRef.current = new AudioEngine();

    // Set up canvas for visualization
    const canvas = canvasRef.current;
    if (canvas) {
      audioEngineRef.current.setupVisualization(canvas);
    }

    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.cleanup();
      }
    };
  }, []);

  useEffect(() => {
    // Update current lyric based on time
    const currentLyric = lyrics.find((lyric, index) => {
      const nextLyric = lyrics[index + 1];
      return (
        currentTime >= lyric.time &&
        (!nextLyric || currentTime < nextLyric.time)
      );
    });

    if (currentLyric) {
      const index = lyrics.indexOf(currentLyric);
      setCurrentLyricIndex(index);
    }
  }, [currentTime]);

  const handlePlayPause = async () => {
    if (!audioEngineRef.current) return;

    if (isPlaying) {
      audioEngineRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        // Try to play with audio URL if available, otherwise use demo
        const audioUrl = song?.audio_url || null;
        await audioEngineRef.current.play(audioUrl);
        setIsPlaying(true);

        // Set duration if available
        if (song?.duration) {
          const [minutes, seconds] = song.duration.split(":").map(Number);
          setDuration(minutes * 60 + seconds);
        } else {
          setDuration(240); // Default 4 minutes
        }

        // Start time tracking
        const interval = setInterval(() => {
          const time = audioEngineRef.current.getCurrentTime();
          setCurrentTime(time);

          // Update score based on performance (demo)
          const newScore = Math.min(100, Math.max(0, 70 + Math.random() * 30));
          setScore(Math.round(newScore));

          if (time >= duration) {
            setIsPlaying(false);
            clearInterval(interval);
          }
        }, 100);
      } catch (error) {
        console.error("Playback failed:", error);
        alert("Gagal memutar audio. Menggunakan mode demo.");
      }
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioEngineRef.current) {
      audioEngineRef.current.setVolume(newVolume);
    }
  };

  const handlePitchChange = (newPitch) => {
    setPitch(newPitch);
    if (audioEngineRef.current) {
      audioEngineRef.current.setPitch(newPitch);
    }
  };

  const handleReverbChange = (newReverb) => {
    setReverb(newReverb);
    if (audioEngineRef.current) {
      audioEngineRef.current.setReverb(newReverb);
    }
  };

  const toggleAutoTune = () => {
    setAutoTune(!autoTune);
    if (audioEngineRef.current) {
      audioEngineRef.current.setAutoTune(!autoTune);
    }
  };

  const toggleRecording = async () => {
    if (!audioEngineRef.current) return;

    if (isRecording) {
      const recording = await audioEngineRef.current.stopRecording();
      setIsRecording(false);
      // Handle recording save/upload
      console.log("Recording completed:", recording);
    } else {
      try {
        await audioEngineRef.current.startRecording();
        setIsRecording(true);
      } catch (error) {
        console.error("Recording failed:", error);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div style={styles.container} className="fade-in">
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigate("home")}
            style={styles.backButton}
          >
            <i className="fas fa-arrow-left"></i>
            Kembali
          </button>
          <div style={styles.songInfo}>
            <h1 style={styles.songTitle}>{song?.title || "Perfect"}</h1>
            <p style={styles.songArtist}>{song?.artist || "Ed Sheeran"}</p>
          </div>
        </div>

        {/* Demo Notice */}
        <div style={styles.demoNotice}>
          <div className="card" style={styles.demoCard}>
            <i className="fas fa-info-circle" style={styles.demoIcon}></i>
            <div style={styles.demoText}>
              <strong>Mode Demo:</strong> Anda sedang menggunakan karaoke dalam
              mode demo. Daftar akun untuk mengakses fitur lengkap, lagu HD, dan
              recording berkualitas tinggi!
            </div>
          </div>
        </div>

        {/* Main Player */}
        <div style={styles.playerContainer}>
          {/* Visualization */}
          <div style={styles.visualizationContainer}>
            <canvas
              ref={canvasRef}
              style={styles.canvas}
              width="800"
              height="200"
            />
          </div>

          {/* Lyrics Display */}
          <div style={styles.lyricsContainer}>
            <div style={styles.lyricsScroll}>
              {lyrics.map((lyric, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.lyricLine,
                    ...(index === currentLyricIndex ? styles.currentLyric : {}),
                    ...(index < currentLyricIndex ? styles.passedLyric : {}),
                  }}
                >
                  {lyric.text}
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <span style={styles.timeLabel}>{formatTime(currentTime)}</span>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${(currentTime / 240) * 100}%`,
                }}
              />
            </div>
            <span style={styles.timeLabel}>{formatTime(240)}</span>
          </div>

          {/* Controls */}
          <div style={styles.controls}>
            <div style={styles.mainControls}>
              <button
                className="btn btn-secondary"
                style={styles.controlButton}
              >
                <i className="fas fa-step-backward"></i>
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePlayPause}
                style={styles.playButton}
              >
                <i className={isPlaying ? "fas fa-pause" : "fas fa-play"}></i>
              </button>
              <button
                className="btn btn-secondary"
                style={styles.controlButton}
              >
                <i className="fas fa-step-forward"></i>
              </button>
            </div>

            <div style={styles.recordingControls}>
              <button
                className={`btn ${isRecording ? "btn-danger" : "btn-secondary"}`}
                onClick={toggleRecording}
                style={styles.recordButton}
              >
                <i className="fas fa-microphone"></i>
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
            </div>
          </div>

          {/* Audio Effects */}
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
                  onChange={(e) =>
                    handleVolumeChange(parseFloat(e.target.value))
                  }
                  style={styles.slider}
                />
                <span style={styles.effectValue}>
                  {Math.round(volume * 100)}%
                </span>
              </div>

              <div style={styles.effectControl}>
                <label style={styles.effectLabel}>Pitch</label>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={pitch}
                  onChange={(e) => handlePitchChange(parseInt(e.target.value))}
                  style={styles.slider}
                />
                <span style={styles.effectValue}>
                  {pitch > 0 ? "+" : ""}
                  {pitch}
                </span>
              </div>

              <div style={styles.effectControl}>
                <label style={styles.effectLabel}>Reverb</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={reverb}
                  onChange={(e) =>
                    handleReverbChange(parseFloat(e.target.value))
                  }
                  style={styles.slider}
                />
                <span style={styles.effectValue}>
                  {Math.round(reverb * 100)}%
                </span>
              </div>

              <div style={styles.effectControl}>
                <label style={styles.effectLabel}>Auto-Tune</label>
                <button
                  className={`btn ${autoTune ? "btn-primary" : "btn-secondary"}`}
                  onClick={toggleAutoTune}
                  style={styles.toggleButton}
                >
                  {autoTune ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div style={styles.scoreContainer}>
            <div style={styles.scoreCard}>
              <h4 style={styles.scoreTitle}>Current Score</h4>
              <div style={styles.scoreValue}>{score}%</div>
              <div style={styles.scoreBar}>
                <div
                  style={{
                    ...styles.scoreBarFill,
                    width: `${score}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: "20px",
    paddingBottom: "40px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
    gap: "20px",
  },
  backButton: {
    padding: "10px 20px",
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "5px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  songArtist: {
    fontSize: "1.2rem",
    opacity: 0.8,
  },
  demoNotice: {
    marginBottom: "20px",
  },
  demoCard: {
    padding: "15px 20px",
    background: "rgba(255, 193, 7, 0.2)",
    border: "1px solid rgba(255, 193, 7, 0.4)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  demoIcon: {
    color: "#ffc107",
    fontSize: "1.2rem",
  },
  demoText: {
    flex: 1,
    fontSize: "0.9rem",
    lineHeight: 1.4,
  },
  playerContainer: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  visualizationContainer: {
    marginBottom: "30px",
    textAlign: "center",
  },
  canvas: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "15px",
    border: "1px solid rgba(255,255,255,0.2)",
    maxWidth: "100%",
    height: "auto",
  },
  lyricsContainer: {
    background: "rgba(0,0,0,0.3)",
    borderRadius: "15px",
    padding: "20px",
    marginBottom: "30px",
    height: "200px",
    overflow: "hidden",
  },
  lyricsScroll: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  lyricLine: {
    fontSize: "1.5rem",
    textAlign: "center",
    padding: "10px 0",
    transition: "all 0.3s ease",
    opacity: 0.5,
  },
  currentLyric: {
    fontSize: "2rem",
    fontWeight: "600",
    opacity: 1,
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    transform: "scale(1.1)",
  },
  passedLyric: {
    opacity: 0.3,
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px",
  },
  timeLabel: {
    fontSize: "0.9rem",
    opacity: 0.8,
    minWidth: "40px",
  },
  progressBar: {
    flex: 1,
    height: "6px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    transition: "width 0.1s ease",
  },
  controls: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },
  mainControls: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  controlButton: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    fontSize: "18px",
  },
  playButton: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    fontSize: "24px",
  },
  recordingControls: {
    display: "flex",
    gap: "10px",
  },
  recordButton: {
    padding: "12px 24px",
    fontSize: "16px",
  },
  effectsPanel: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "30px",
  },
  effectsTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "20px",
    textAlign: "center",
  },
  effectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
  scoreContainer: {
    display: "flex",
    justifyContent: "center",
  },
  scoreCard: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "15px",
    padding: "20px",
    textAlign: "center",
    minWidth: "200px",
  },
  scoreTitle: {
    fontSize: "1rem",
    marginBottom: "10px",
    opacity: 0.9,
  },
  scoreValue: {
    fontSize: "3rem",
    fontWeight: "700",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  },
  scoreBar: {
    height: "8px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    transition: "width 0.3s ease",
  },
};

export default KaraokePlayer;
