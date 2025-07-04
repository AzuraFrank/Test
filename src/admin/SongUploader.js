import React, { useState } from "react";
import { songService, fileService } from "../services/database";
import { v4 as uuidv4 } from "uuid";

const SongUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    genre: "Pop",
    difficulty: "Medium",
    duration: "",
    language: "Indonesia",
    description: "",
  });
  const [files, setFiles] = useState({
    audio: null,
    video: null,
    lyrics: null,
    thumbnail: null,
  });
  const [lyricsData, setLyricsData] = useState([]);
  const [currentLyric, setCurrentLyric] = useState({ time: "", text: "" });

  const genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Country",
    "Jazz",
    "Electronic",
    "Dangdut",
    "Keroncong",
  ];
  const difficulties = ["Easy", "Medium", "Hard"];
  const languages = ["Indonesia", "English", "Mandarin", "Japanese", "Korean"];

  const handleInputChange = (field, value) => {
    setSongData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (type, file) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const addLyric = () => {
    if (currentLyric.time && currentLyric.text) {
      const timeInSeconds = parseTimeToSeconds(currentLyric.time);
      setLyricsData((prev) =>
        [...prev, { time: timeInSeconds, text: currentLyric.text }].sort(
          (a, b) => a.time - b.time,
        ),
      );
      setCurrentLyric({ time: "", text: "" });
    }
  };

  const removeLyric = (index) => {
    setLyricsData((prev) => prev.filter((_, i) => i !== index));
  };

  const parseTimeToSeconds = (timeString) => {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  const formatSecondsToTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const uploadSong = async () => {
    if (!songData.title || !songData.artist || !files.audio) {
      alert("Harap isi semua field yang wajib dan upload file audio!");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const songId = uuidv4();
      const uploadedFiles = {};

      // Upload files to Supabase Storage
      const totalFiles = Object.keys(files).filter((key) => files[key]).length;
      let completedUploads = 0;

      for (const [type, file] of Object.entries(files)) {
        if (file) {
          const fileName = `${songId}/${type}.${file.name.split(".").pop()}`;
          const uploadResult = await fileService.uploadFile(
            "songs",
            file,
            fileName,
          );
          uploadedFiles[type] = fileService.getPublicUrl("songs", fileName);

          completedUploads++;
          setUploadProgress((completedUploads / totalFiles) * 80);
        }
      }

      // Save song data to database
      const newSong = {
        id: songId,
        title: songData.title,
        artist: songData.artist,
        genre: songData.genre,
        difficulty: songData.difficulty,
        duration: songData.duration,
        language: songData.language,
        description: songData.description,
        audio_url: uploadedFiles.audio,
        video_url: uploadedFiles.video || null,
        thumbnail_url:
          uploadedFiles.thumbnail ||
          `https://via.placeholder.com/300x300/${getGenreColor(songData.genre)}/ffffff?text=${encodeURIComponent(songData.title)}`,
        lyrics_data: lyricsData,
        plays: 0,
        rating: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await songService.addSong(newSong);
      setUploadProgress(100);

      // Reset form
      setSongData({
        title: "",
        artist: "",
        genre: "Pop",
        difficulty: "Medium",
        duration: "",
        language: "Indonesia",
        description: "",
      });
      setFiles({
        audio: null,
        video: null,
        lyrics: null,
        thumbnail: null,
      });
      setLyricsData([]);

      alert("Lagu berhasil diupload!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload gagal: " + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getGenreColor = (genre) => {
    const colors = {
      Pop: "ff6b6b",
      Rock: "764ba2",
      "Hip Hop": "feca57",
      "R&B": "ff9ff3",
      Country: "54a0ff",
      Jazz: "5f27cd",
      Electronic: "00d2d3",
      Dangdut: "fd79a8",
      Keroncong: "6c5ce7",
    };
    return colors[genre] || "ff6b6b";
  };

  return (
    <div>
      <div style={styles.header}>
        <h3 style={styles.title}>🎵 Upload Lagu Karaoke</h3>
        <p style={styles.subtitle}>
          Tambahkan lagu baru ke database Nabila Portal
        </p>
      </div>

      {/* Song Information */}
      <div className="card" style={styles.section}>
        <h4 style={styles.sectionTitle}>Informasi Lagu</h4>

        <div style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Judul Lagu *</label>
            <input
              type="text"
              value={songData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              style={styles.input}
              placeholder="Masukkan judul lagu"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Artis *</label>
            <input
              type="text"
              value={songData.artist}
              onChange={(e) => handleInputChange("artist", e.target.value)}
              style={styles.input}
              placeholder="Nama artis"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Genre</label>
            <select
              value={songData.genre}
              onChange={(e) => handleInputChange("genre", e.target.value)}
              style={styles.select}
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Tingkat Kesulitan</label>
            <select
              value={songData.difficulty}
              onChange={(e) => handleInputChange("difficulty", e.target.value)}
              style={styles.select}
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Durasi (mm:ss)</label>
            <input
              type="text"
              value={songData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              style={styles.input}
              placeholder="3:45"
              pattern="[0-9]+:[0-5][0-9]"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Bahasa</label>
            <select
              value={songData.language}
              onChange={(e) => handleInputChange("language", e.target.value)}
              style={styles.select}
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Deskripsi</label>
          <textarea
            value={songData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            style={styles.textarea}
            placeholder="Deskripsi lagu (opsional)"
            rows="3"
          />
        </div>
      </div>

      {/* File Uploads */}
      <div className="card" style={styles.section}>
        <h4 style={styles.sectionTitle}>Upload File</h4>

        <div style={styles.uploadGrid}>
          <FileUploadCard
            title="Audio File *"
            description="File audio karaoke (MP3, WAV)"
            acceptedTypes="audio/*"
            file={files.audio}
            onChange={(file) => handleFileChange("audio", file)}
            icon="fas fa-music"
            required
          />

          <FileUploadCard
            title="Video (Opsional)"
            description="Video background atau lirik (MP4)"
            acceptedTypes="video/*"
            file={files.video}
            onChange={(file) => handleFileChange("video", file)}
            icon="fas fa-video"
          />

          <FileUploadCard
            title="Thumbnail (Opsional)"
            description="Gambar cover lagu (JPG, PNG)"
            acceptedTypes="image/*"
            file={files.thumbnail}
            onChange={(file) => handleFileChange("thumbnail", file)}
            icon="fas fa-image"
          />
        </div>
      </div>

      {/* Lyrics Editor */}
      <div className="card" style={styles.section}>
        <h4 style={styles.sectionTitle}>Editor Lirik</h4>
        <p style={styles.lyricsHelp}>
          Masukkan lirik dengan timing untuk sinkronisasi real-time
        </p>

        <div style={styles.lyricsEditor}>
          <div style={styles.lyricInput}>
            <input
              type="text"
              value={currentLyric.time}
              onChange={(e) =>
                setCurrentLyric((prev) => ({ ...prev, time: e.target.value }))
              }
              style={styles.timeInput}
              placeholder="0:15"
              pattern="[0-9]+:[0-5][0-9]"
            />
            <input
              type="text"
              value={currentLyric.text}
              onChange={(e) =>
                setCurrentLyric((prev) => ({ ...prev, text: e.target.value }))
              }
              style={styles.textInput}
              placeholder="Teks lirik..."
            />
            <button
              onClick={addLyric}
              className="btn btn-primary"
              style={styles.addButton}
            >
              <i className="fas fa-plus"></i>
              Tambah
            </button>
          </div>

          <div style={styles.lyricsList}>
            {lyricsData.map((lyric, index) => (
              <div key={index} style={styles.lyricItem}>
                <span style={styles.lyricTime}>
                  {formatSecondsToTime(lyric.time)}
                </span>
                <span style={styles.lyricText}>{lyric.text}</span>
                <button
                  onClick={() => removeLyric(index)}
                  style={styles.removeButton}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <div style={styles.uploadSection}>
        {isUploading && (
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${uploadProgress}%`,
                }}
              />
            </div>
            <span style={styles.progressText}>{uploadProgress}% Complete</span>
          </div>
        )}

        <button
          onClick={uploadSong}
          disabled={isUploading}
          className="btn btn-primary"
          style={styles.uploadButton}
        >
          {isUploading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Mengupload...
            </>
          ) : (
            <>
              <i className="fas fa-upload"></i> Upload Lagu
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const FileUploadCard = ({
  title,
  description,
  acceptedTypes,
  file,
  onChange,
  icon,
  required = false,
}) => (
  <div style={styles.uploadCard}>
    <div style={styles.uploadIcon}>
      <i className={icon}></i>
    </div>
    <h5 style={styles.uploadTitle}>{title}</h5>
    <p style={styles.uploadDesc}>{description}</p>

    <input
      type="file"
      accept={acceptedTypes}
      onChange={(e) => onChange(e.target.files[0])}
      style={styles.fileInput}
      id={`file-${title}`}
    />

    <label
      htmlFor={`file-${title}`}
      className="btn btn-secondary"
      style={styles.fileButton}
    >
      <i className="fas fa-folder-open"></i>
      {file ? file.name : "Pilih File"}
    </label>

    {file && (
      <div style={styles.fileInfo}>
        <i className="fas fa-check-circle" style={styles.checkIcon}></i>
        <span>File siap diupload</span>
      </div>
    )}
  </div>
);

const styles = {
  header: {
    marginBottom: "30px",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
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
  section: {
    marginBottom: "30px",
    padding: "25px",
  },
  sectionTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "500",
    fontSize: "0.9rem",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  uploadGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  uploadCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "15px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  uploadIcon: {
    fontSize: "2rem",
    marginBottom: "15px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  uploadTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "8px",
  },
  uploadDesc: {
    fontSize: "0.9rem",
    opacity: 0.7,
    marginBottom: "15px",
  },
  fileInput: {
    display: "none",
  },
  fileButton: {
    width: "100%",
    padding: "10px 15px",
    marginBottom: "10px",
  },
  fileInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "0.9rem",
    color: "#4caf50",
  },
  checkIcon: {
    color: "#4caf50",
  },
  lyricsHelp: {
    fontSize: "0.9rem",
    opacity: 0.7,
    marginBottom: "20px",
  },
  lyricsEditor: {
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  lyricInput: {
    display: "flex",
    gap: "10px",
    padding: "15px",
    background: "rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  timeInput: {
    width: "80px",
    padding: "8px 12px",
    borderRadius: "5px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  textInput: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "5px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  addButton: {
    padding: "8px 15px",
    fontSize: "14px",
  },
  lyricsList: {
    maxHeight: "300px",
    overflowY: "auto",
  },
  lyricItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "10px 15px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  lyricTime: {
    minWidth: "60px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#feca57",
  },
  lyricText: {
    flex: 1,
    fontSize: "0.95rem",
  },
  removeButton: {
    background: "rgba(244, 67, 54, 0.2)",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    color: "#f44336",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadSection: {
    textAlign: "center",
    marginTop: "30px",
  },
  progressContainer: {
    marginBottom: "20px",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: "0.9rem",
    opacity: 0.8,
  },
  uploadButton: {
    padding: "15px 30px",
    fontSize: "16px",
    fontWeight: "600",
  },
};

export default SongUploader;
