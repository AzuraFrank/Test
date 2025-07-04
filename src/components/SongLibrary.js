import React, { useState } from "react";

const SongLibrary = ({ onNavigate, onPlaySong }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const genres = [
    "All",
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Country",
    "Jazz",
    "Electronic",
  ];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const allSongs = [
    {
      id: 1,
      title: "Perfect",
      artist: "Ed Sheeran",
      duration: "4:23",
      difficulty: "Easy",
      genre: "Pop",
      image: "https://via.placeholder.com/150x150/ff6b6b/ffffff?text=🎵",
      plays: 1250,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      duration: "5:55",
      difficulty: "Hard",
      genre: "Rock",
      image: "https://via.placeholder.com/150x150/764ba2/ffffff?text=🎸",
      plays: 2100,
      rating: 4.9,
    },
    {
      id: 3,
      title: "Someone Like You",
      artist: "Adele",
      duration: "4:47",
      difficulty: "Medium",
      genre: "Pop",
      image: "https://via.placeholder.com/150x150/feca57/ffffff?text=🎤",
      plays: 1800,
      rating: 4.7,
    },
    {
      id: 4,
      title: "Blinding Lights",
      artist: "The Weeknd",
      duration: "3:20",
      difficulty: "Medium",
      genre: "Pop",
      image: "https://via.placeholder.com/150x150/ff9ff3/ffffff?text=✨",
      plays: 3200,
      rating: 4.9,
    },
    {
      id: 5,
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      duration: "5:03",
      difficulty: "Hard",
      genre: "Rock",
      image: "https://via.placeholder.com/150x150/f368e0/ffffff?text=🔥",
      plays: 1900,
      rating: 4.8,
    },
    {
      id: 6,
      title: "Bad Guy",
      artist: "Billie Eilish",
      duration: "3:14",
      difficulty: "Easy",
      genre: "Pop",
      image: "https://via.placeholder.com/150x150/54a0ff/ffffff?text=👁️",
      plays: 2800,
      rating: 4.6,
    },
    {
      id: 7,
      title: "Shape of You",
      artist: "Ed Sheeran",
      duration: "3:53",
      difficulty: "Easy",
      genre: "Pop",
      image: "https://via.placeholder.com/150x150/5f27cd/ffffff?text=💃",
      plays: 4100,
      rating: 4.8,
    },
    {
      id: 8,
      title: "Don't Stop Believin'",
      artist: "Journey",
      duration: "4:11",
      difficulty: "Medium",
      genre: "Rock",
      image: "https://via.placeholder.com/150x150/00d2d3/ffffff?text=🌟",
      plays: 1600,
      rating: 4.9,
    },
  ];

  const filteredSongs = allSongs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || song.genre === selectedGenre;
    const matchesDifficulty =
      selectedDifficulty === "All" || song.difficulty === selectedDifficulty;

    return matchesSearch && matchesGenre && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "#4caf50";
      case "Medium":
        return "#ff9800";
      case "Hard":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <div style={styles.container} className="fade-in">
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🎵 Song Library</h1>
          <p style={styles.subtitle}>
            Choose your favorite song and start singing!
          </p>
        </div>

        {/* Search and Filters */}
        <div style={styles.filtersContainer}>
          <div style={styles.searchContainer}>
            <i className="fas fa-search" style={styles.searchIcon}></i>
            <input
              type="text"
              placeholder="Search songs or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Genre:</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                style={styles.select}
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Difficulty:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                style={styles.select}
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div style={styles.resultsInfo}>
          <span>{filteredSongs.length} songs found</span>
        </div>

        {/* Songs Grid */}
        <div style={styles.songsGrid}>
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onPlay={() => onPlaySong(song)}
              getDifficultyColor={getDifficultyColor}
            />
          ))}
        </div>

        {filteredSongs.length === 0 && (
          <div style={styles.noResults}>
            <i className="fas fa-search" style={styles.noResultsIcon}></i>
            <h3 style={styles.noResultsTitle}>No songs found</h3>
            <p style={styles.noResultsText}>
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SongCard = ({ song, onPlay, getDifficultyColor }) => (
  <div className="card" style={styles.songCard}>
    <div style={styles.songImageContainer}>
      <img src={song.image} alt={song.title} style={styles.songImage} />
      <button
        className="btn btn-primary"
        onClick={onPlay}
        style={styles.playButton}
      >
        <i className="fas fa-play"></i>
      </button>
      <div style={styles.overlay}>
        <div style={styles.songStats}>
          <span style={styles.plays}>
            <i className="fas fa-play-circle"></i>
            {song.plays.toLocaleString()}
          </span>
          <span style={styles.rating}>
            <i className="fas fa-star"></i>
            {song.rating}
          </span>
        </div>
      </div>
    </div>

    <div style={styles.songInfo}>
      <h4 style={styles.songTitle}>{song.title}</h4>
      <p style={styles.songArtist}>{song.artist}</p>

      <div style={styles.songMeta}>
        <span style={styles.duration}>
          <i className="fas fa-clock"></i>
          {song.duration}
        </span>
        <span
          style={{
            ...styles.difficulty,
            color: getDifficultyColor(song.difficulty),
          }}
        >
          <i className="fas fa-signal"></i>
          {song.difficulty}
        </span>
      </div>

      <div style={styles.songGenre}>{song.genre}</div>
    </div>
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
  filtersContainer: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "30px",
    backdropFilter: "blur(10px)",
  },
  searchContainer: {
    position: "relative",
    marginBottom: "20px",
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255,255,255,0.6)",
    zIndex: 1,
  },
  searchInput: {
    width: "100%",
    padding: "15px 15px 15px 45px",
    borderRadius: "25px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  filterRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
    minWidth: "200px",
  },
  filterLabel: {
    fontWeight: "500",
    fontSize: "14px",
    opacity: 0.9,
  },
  select: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "15px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  resultsInfo: {
    marginBottom: "25px",
    fontSize: "1rem",
    opacity: 0.8,
    textAlign: "center",
  },
  songsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "25px",
  },
  songCard: {
    overflow: "hidden",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
  },
  songImageContainer: {
    position: "relative",
    marginBottom: "15px",
    overflow: "hidden",
    borderRadius: "15px",
  },
  songImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    fontSize: "20px",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    display: "flex",
    alignItems: "flex-end",
    padding: "15px",
  },
  songStats: {
    display: "flex",
    gap: "15px",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  plays: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#feca57",
  },
  songInfo: {
    padding: "0 5px",
  },
  songTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "5px",
    lineHeight: 1.3,
  },
  songArtist: {
    opacity: 0.7,
    marginBottom: "10px",
    fontSize: "0.95rem",
  },
  songMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "0.85rem",
  },
  duration: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    opacity: 0.7,
  },
  difficulty: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontWeight: "500",
  },
  songGenre: {
    display: "inline-block",
    background: "rgba(255,255,255,0.1)",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "500",
    opacity: 0.8,
  },
  noResults: {
    textAlign: "center",
    padding: "60px 20px",
    opacity: 0.7,
  },
  noResultsIcon: {
    fontSize: "4rem",
    marginBottom: "20px",
    opacity: 0.5,
  },
  noResultsTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    fontWeight: "600",
  },
  noResultsText: {
    fontSize: "1rem",
    opacity: 0.8,
  },
};

// Add hover effects with CSS-in-JS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .song-card:hover .play-button {
    opacity: 1 !important;
  }
  .song-card:hover .overlay {
    opacity: 1 !important;
  }
  .song-card:hover img {
    transform: scale(1.05) !important;
  }
`;
document.head.appendChild(styleSheet);

export default SongLibrary;
