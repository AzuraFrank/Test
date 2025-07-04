import React from "react";

const HomeScreen = ({ onNavigate, onPlaySong }) => {
  const featuredSongs = [
    {
      id: 1,
      title: "Perfect",
      artist: "Ed Sheeran",
      duration: "4:23",
      difficulty: "Easy",
      genre: "Pop",
      image: "https://via.placeholder.com/200x200/ff6b6b/ffffff?text=🎵",
    },
    {
      id: 2,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      duration: "5:55",
      difficulty: "Hard",
      genre: "Rock",
      image: "https://via.placeholder.com/200x200/764ba2/ffffff?text=🎸",
    },
    {
      id: 3,
      title: "Someone Like You",
      artist: "Adele",
      duration: "4:47",
      difficulty: "Medium",
      genre: "Pop",
      image: "https://via.placeholder.com/200x200/feca57/ffffff?text=🎤",
    },
  ];

  return (
    <div style={styles.container} className="fade-in">
      <div className="container">
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle} className="pulse">
              🎤 Sing Your Heart Out
            </h1>
            <p style={styles.heroSubtitle}>
              Professional karaoke experience with real-time voice analysis,
              pitch correction, and amazing vocal effects
            </p>
            <div style={styles.heroActions}>
              <button
                className="btn btn-primary"
                onClick={() => onNavigate("library")}
                style={styles.heroButton}
              >
                <i className="fas fa-music"></i>
                Browse Songs
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onNavigate("record")}
                style={styles.heroButton}
              >
                <i className="fas fa-microphone"></i>
                Start Recording
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section style={styles.features}>
          <h2 style={styles.sectionTitle}>✨ Amazing Features</h2>
          <div style={styles.featuresGrid}>
            <FeatureCard
              icon="fas fa-headphones"
              title="High-Quality Audio"
              description="Crystal clear sound with professional mixing"
            />
            <FeatureCard
              icon="fas fa-chart-line"
              title="Pitch Analysis"
              description="Real-time pitch detection and scoring"
            />
            <FeatureCard
              icon="fas fa-magic"
              title="Voice Effects"
              description="Auto-tune, reverb, and vocal enhancements"
            />
            <FeatureCard
              icon="fas fa-share-alt"
              title="Social Sharing"
              description="Share your performances with friends"
            />
          </div>
        </section>

        {/* Featured Songs */}
        <section style={styles.featured}>
          <h2 style={styles.sectionTitle}>🔥 Trending Songs</h2>
          <div style={styles.songsGrid}>
            {featuredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={() => onPlaySong(song)}
              />
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section style={styles.stats}>
          <div style={styles.statsGrid}>
            <StatCard number="10,000+" label="Songs Available" />
            <StatCard number="50,000+" label="Happy Singers" />
            <StatCard number="1M+" label="Performances" />
            <StatCard number="4.9★" label="User Rating" />
          </div>
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="card" style={styles.featureCard}>
    <div style={styles.featureIcon}>
      <i className={icon}></i>
    </div>
    <h3 style={styles.featureTitle}>{title}</h3>
    <p style={styles.featureDesc}>{description}</p>
  </div>
);

const SongCard = ({ song, onPlay }) => (
  <div className="card" style={styles.songCard}>
    <div style={styles.songImage}>
      <img src={song.image} alt={song.title} style={styles.songImg} />
      <button
        className="btn btn-primary"
        onClick={onPlay}
        style={styles.playButton}
      >
        <i className="fas fa-play"></i>
      </button>
    </div>
    <div style={styles.songInfo}>
      <h4 style={styles.songTitle}>{song.title}</h4>
      <p style={styles.songArtist}>{song.artist}</p>
      <div style={styles.songMeta}>
        <span style={styles.songDuration}>{song.duration}</span>
        <span style={styles.songDifficulty}>{song.difficulty}</span>
      </div>
    </div>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="card" style={styles.statCard}>
    <div style={styles.statNumber}>{number}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const styles = {
  container: {
    paddingTop: "40px",
    paddingBottom: "40px",
  },
  hero: {
    textAlign: "center",
    padding: "60px 0",
  },
  heroContent: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: "700",
    marginBottom: "20px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    marginBottom: "40px",
    opacity: 0.9,
    lineHeight: 1.6,
  },
  heroActions: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  heroButton: {
    fontSize: "16px",
    padding: "15px 30px",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "40px",
    fontWeight: "600",
  },
  features: {
    margin: "80px 0",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
  },
  featureCard: {
    textAlign: "center",
    padding: "30px 20px",
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },
  featureIcon: {
    fontSize: "3rem",
    marginBottom: "20px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  featureTitle: {
    fontSize: "1.3rem",
    marginBottom: "15px",
    fontWeight: "600",
  },
  featureDesc: {
    opacity: 0.8,
    lineHeight: 1.5,
  },
  featured: {
    margin: "80px 0",
  },
  songsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
  },
  songCard: {
    overflow: "hidden",
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },
  songImage: {
    position: "relative",
    marginBottom: "15px",
  },
  songImg: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "15px",
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
  },
  songInfo: {
    padding: "0 5px",
  },
  songTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "5px",
  },
  songArtist: {
    opacity: 0.7,
    marginBottom: "10px",
  },
  songMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    opacity: 0.6,
  },
  stats: {
    margin: "80px 0",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  statCard: {
    textAlign: "center",
    padding: "30px 20px",
  },
  statNumber: {
    fontSize: "2.5rem",
    fontWeight: "700",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  },
  statLabel: {
    opacity: 0.8,
    fontWeight: "500",
  },
};

export default HomeScreen;
