import React from "react";
import { useAuth } from "../contexts/AuthContext";

const HomeScreen = ({ onNavigate, onPlaySong }) => {
  const { user } = useAuth();

  const featuredSongs = [
    {
      id: 1,
      title: "Perfect",
      artist: "Ed Sheeran",
      duration: "4:23",
      difficulty: "Easy",
      genre: "Pop",
      image: "https://via.placeholder.com/200x200/ff6b6b/ffffff?text=🎵",
      plays: 15420,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      duration: "5:55",
      difficulty: "Hard",
      genre: "Rock",
      image: "https://via.placeholder.com/200x200/764ba2/ffffff?text=🎸",
      plays: 8930,
      rating: 4.9,
    },
    {
      id: 3,
      title: "Someone Like You",
      artist: "Adele",
      duration: "4:47",
      difficulty: "Medium",
      genre: "Pop",
      image: "https://via.placeholder.com/200x200/feca57/ffffff?text=🎤",
      plays: 12670,
      rating: 4.7,
    },
    {
      id: 4,
      title: "Ddu-du Ddu-du",
      artist: "BLACKPINK",
      duration: "3:29",
      difficulty: "Medium",
      genre: "K-Pop",
      image: "https://via.placeholder.com/200x200/ff9ff3/ffffff?text=💫",
      plays: 21340,
      rating: 4.6,
    },
  ];

  return (
    <div style={styles.container} className="fade-in">
      <div className="container">
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle} className="pulse">
              🎤 Nabila Portal Karaoke
            </h1>
            <p style={styles.heroSubtitle}>
              Platform karaoke terlengkap dengan fitur profesional, voice
              effects canggih, dan kompetisi seru setiap hari!
            </p>
            <div style={styles.heroFeatures}>
              <span style={styles.feature}>🎵 10,000+ Lagu</span>
              <span style={styles.feature}>🎙️ Voice Effects Premium</span>
              <span style={styles.feature}>🏆 Tournament Harian</span>
              <span style={styles.feature}>📱 Mobile Friendly</span>
            </div>
            <div style={styles.heroActions}>
              {user ? (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => onNavigate("library")}
                    style={styles.heroButton}
                  >
                    <i className="fas fa-music"></i>
                    Jelajahi Lagu
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => onNavigate("dashboard")}
                    style={styles.heroButton}
                  >
                    <i className="fas fa-chart-line"></i>
                    Dashboard Saya
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => onNavigate("library")}
                    style={styles.heroButton}
                  >
                    <i className="fas fa-music"></i>
                    Mulai Karaoke
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      window.open("https://wa.me/6285810526151", "_blank")
                    }
                    style={styles.heroButton}
                  >
                    <i className="fab fa-whatsapp"></i>
                    Hubungi Admin
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section style={styles.stats}>
          <div style={styles.statsGrid}>
            <StatCard
              number="10,000+"
              label="Lagu Tersedia"
              icon="fas fa-music"
            />
            <StatCard
              number="50,000+"
              label="Pengguna Aktif"
              icon="fas fa-users"
            />
            <StatCard
              number="1M+"
              label="Performa Tersimpan"
              icon="fas fa-microphone"
            />
            <StatCard
              number="4.9★"
              label="Rating Pengguna"
              icon="fas fa-star"
            />
          </div>
        </section>

        {/* Featured Songs */}
        <section style={styles.featured}>
          <h2 style={styles.sectionTitle}>🔥 Lagu Trending Hari Ini</h2>
          <div style={styles.songsGrid}>
            {featuredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={() => onPlaySong(song)}
              />
            ))}
          </div>
          <div style={styles.viewMore}>
            <button
              className="btn btn-primary"
              onClick={() => onNavigate("library")}
              style={styles.viewMoreButton}
            >
              Lihat Semua Lagu
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section style={styles.features}>
          <h2 style={styles.sectionTitle}>✨ Kenapa Pilih Nabila Portal?</h2>
          <div style={styles.featuresGrid}>
            <FeatureCard
              icon="fas fa-waveform-lines"
              title="Voice Effects Premium"
              description="Auto-tune, reverb, echo, dan 20+ effects profesional"
              color="#ff6b6b"
            />
            <FeatureCard
              icon="fas fa-trophy"
              title="Tournament Harian"
              description="Kompetisi karaoke dengan hadiah hingga jutaan rupiah"
              color="#feca57"
            />
            <FeatureCard
              icon="fas fa-chart-line"
              title="Analisis Pitch Real-time"
              description="Scoring akurat dengan feedback untuk improve vocal"
              color="#48dbfb"
            />
            <FeatureCard
              icon="fas fa-cloud-upload"
              title="Upload Lagu Custom"
              description="Upload lagu favorit Anda untuk karaoke bersama"
              color="#ff9ff3"
            />
            <FeatureCard
              icon="fas fa-mobile-alt"
              title="Mobile Optimized"
              description="Pengalaman karaoke sempurna di semua device"
              color="#54a0ff"
            />
            <FeatureCard
              icon="fas fa-users"
              title="Social Features"
              description="Share performance, follow friends, dan komunitas aktif"
              color="#5f27cd"
            />
          </div>
        </section>

        {/* Pricing Preview */}
        <section style={styles.pricing}>
          <h2 style={styles.sectionTitle}>💎 Paket Berlangganan</h2>
          <div style={styles.pricingGrid}>
            <PricingCard
              title="Basic"
              price="Rp 1.000"
              duration="1 hari"
              features={[
                "50 lagu populer",
                "Rekam 3 lagu/hari",
                "Kualitas standar",
              ]}
              color="#4caf50"
            />
            <PricingCard
              title="Premium"
              price="Rp 15.000"
              duration="30 hari"
              features={[
                "Unlimited lagu",
                "Voice effects premium",
                "HD quality",
                "Tournament access",
              ]}
              color="#ff9800"
              popular={true}
            />
            <PricingCard
              title="VIP"
              price="Rp 50.000"
              duration="30 hari"
              features={[
                "Semua fitur Premium",
                "Upload lagu custom",
                "Personal coach",
                "Priority support",
              ]}
              color="#e91e63"
            />
          </div>
          <div style={styles.pricingAction}>
            <button
              className="btn btn-primary"
              onClick={() => onNavigate("payment")}
              style={styles.upgradeButton}
            >
              <i className="fas fa-crown"></i>
              Upgrade Sekarang
            </button>
          </div>
        </section>

        {/* Tournament Preview */}
        <section style={styles.tournament}>
          <div className="card" style={styles.tournamentCard}>
            <div style={styles.tournamentContent}>
              <h3 style={styles.tournamentTitle}>🏆 Weekly Challenge #8</h3>
              <p style={styles.tournamentDesc}>
                Kompetisi karaoke mingguan dengan tema lagu pop Indonesia. Total
                hadiah Rp 500.000 untuk para pemenang!
              </p>
              <div style={styles.tournamentStats}>
                <span style={styles.tournamentStat}>
                  <i className="fas fa-users"></i>
                  23/50 peserta
                </span>
                <span style={styles.tournamentStat}>
                  <i className="fas fa-clock"></i>5 hari tersisa
                </span>
                <span style={styles.tournamentStat}>
                  <i className="fas fa-money-bill-wave"></i>
                  Entry fee: Rp 5.000
                </span>
              </div>
            </div>
            <div style={styles.tournamentAction}>
              <button
                className="btn btn-primary"
                onClick={() => onNavigate("tournaments")}
                style={styles.joinButton}
              >
                <i className="fas fa-trophy"></i>
                Ikuti Tournament
              </button>
            </div>
          </div>
        </section>

        {/* Contact & Support */}
        <section style={styles.contact}>
          <div style={styles.contactGrid}>
            <div className="card" style={styles.contactCard}>
              <h3 style={styles.contactTitle}>💬 Butuh Bantuan?</h3>
              <p style={styles.contactText}>
                Tim support kami siap membantu 24/7 melalui WhatsApp
              </p>
              <button
                className="btn btn-primary"
                onClick={() =>
                  window.open("https://wa.me/6285810526151", "_blank")
                }
                style={styles.contactButton}
              >
                <i className="fab fa-whatsapp"></i>
                Chat Admin
              </button>
            </div>

            <div className="card" style={styles.contactCard}>
              <h3 style={styles.contactTitle}>📢 Info & Update</h3>
              <p style={styles.contactText}>
                Dapatkan info terbaru tentang lagu baru, tournament, dan promo
                menarik
              </p>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  window.open(
                    "https://wa.me/6285810526151?text=Saya ingin bergabung dengan broadcast info Nabila Portal",
                    "_blank",
                  )
                }
                style={styles.contactButton}
              >
                <i className="fas fa-bell"></i>
                Subscribe Update
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ number, label, icon }) => (
  <div className="card" style={styles.statCard}>
    <div style={styles.statIcon}>
      <i className={icon}></i>
    </div>
    <div style={styles.statNumber}>{number}</div>
    <div style={styles.statLabel}>{label}</div>
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
        <span style={styles.songDuration}>
          <i className="fas fa-clock"></i>
          {song.duration}
        </span>
        <span style={styles.songPlays}>
          <i className="fas fa-play-circle"></i>
          {song.plays.toLocaleString()}
        </span>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description, color }) => (
  <div className="card" style={styles.featureCard}>
    <div style={{ ...styles.featureIcon, color }}>
      <i className={icon}></i>
    </div>
    <h3 style={styles.featureTitle}>{title}</h3>
    <p style={styles.featureDesc}>{description}</p>
  </div>
);

const PricingCard = ({
  title,
  price,
  duration,
  features,
  color,
  popular = false,
}) => (
  <div
    className="card"
    style={{
      ...styles.pricingCard,
      ...(popular ? styles.popularPricing : {}),
    }}
  >
    {popular && (
      <div style={styles.popularBadge}>
        <i className="fas fa-star"></i>
        Paling Populer
      </div>
    )}
    <h4 style={styles.pricingTitle}>{title}</h4>
    <div style={styles.pricingPrice}>
      <span style={styles.price}>{price}</span>
      <span style={styles.pricingDuration}>/{duration}</span>
    </div>
    <ul style={styles.pricingFeatures}>
      {features.map((feature, index) => (
        <li key={index} style={styles.pricingFeature}>
          <i className="fas fa-check" style={{ color }}></i>
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

const styles = {
  container: {
    paddingTop: "20px",
    paddingBottom: "40px",
  },
  hero: {
    textAlign: "center",
    padding: "60px 0",
    marginBottom: "40px",
  },
  heroContent: {
    maxWidth: "800px",
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
    fontSize: "1.3rem",
    marginBottom: "30px",
    opacity: 0.9,
    lineHeight: 1.6,
  },
  heroFeatures: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "40px",
  },
  feature: {
    background: "rgba(255,255,255,0.1)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "500",
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
  stats: {
    margin: "60px 0",
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
  statIcon: {
    fontSize: "2.5rem",
    marginBottom: "15px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  statNumber: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "10px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  statLabel: {
    opacity: 0.8,
    fontWeight: "500",
  },
  featured: {
    margin: "80px 0",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "40px",
    fontWeight: "600",
  },
  songsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    marginBottom: "40px",
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
    opacity: 0,
    transition: "opacity 0.3s ease",
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
  songDuration: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  songPlays: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  viewMore: {
    textAlign: "center",
  },
  viewMoreButton: {
    padding: "12px 30px",
    fontSize: "16px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "0 auto",
  },
  features: {
    margin: "80px 0",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  featureCard: {
    textAlign: "center",
    padding: "40px 30px",
    transition: "transform 0.3s ease",
  },
  featureIcon: {
    fontSize: "3.5rem",
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "1.4rem",
    marginBottom: "15px",
    fontWeight: "600",
  },
  featureDesc: {
    opacity: 0.8,
    lineHeight: 1.6,
  },
  pricing: {
    margin: "80px 0",
    textAlign: "center",
  },
  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginBottom: "40px",
  },
  pricingCard: {
    padding: "30px 25px",
    textAlign: "center",
    position: "relative",
    transition: "transform 0.3s ease",
  },
  popularPricing: {
    border: "2px solid #ff9800",
    transform: "scale(1.05)",
  },
  popularBadge: {
    position: "absolute",
    top: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(45deg, #ff9800, #ff5722)",
    color: "white",
    padding: "8px 20px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  pricingTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "15px",
  },
  pricingPrice: {
    marginBottom: "25px",
  },
  price: {
    fontSize: "2rem",
    fontWeight: "700",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  pricingDuration: {
    fontSize: "1rem",
    opacity: 0.7,
  },
  pricingFeatures: {
    listStyle: "none",
    padding: 0,
    textAlign: "left",
  },
  pricingFeature: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 0",
    fontSize: "0.9rem",
  },
  pricingAction: {
    marginTop: "30px",
  },
  upgradeButton: {
    padding: "15px 40px",
    fontSize: "16px",
    fontWeight: "600",
  },
  tournament: {
    margin: "60px 0",
  },
  tournamentCard: {
    padding: "30px",
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },
  tournamentContent: {
    flex: 1,
  },
  tournamentTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "15px",
  },
  tournamentDesc: {
    fontSize: "1.1rem",
    opacity: 0.8,
    marginBottom: "20px",
    lineHeight: 1.5,
  },
  tournamentStats: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  tournamentStat: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
    opacity: 0.9,
  },
  tournamentAction: {
    textAlign: "center",
  },
  joinButton: {
    padding: "15px 30px",
    fontSize: "16px",
    fontWeight: "600",
  },
  contact: {
    margin: "60px 0",
  },
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },
  contactCard: {
    textAlign: "center",
    padding: "30px",
  },
  contactTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "15px",
  },
  contactText: {
    marginBottom: "20px",
    opacity: 0.8,
    lineHeight: 1.5,
  },
  contactButton: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "500",
  },
};

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .song-card:hover .play-button {
    opacity: 1 !important;
  }
  .song-card:hover {
    transform: translateY(-5px) !important;
  }
  .feature-card:hover {
    transform: translateY(-10px) !important;
  }
  .pricing-card:hover {
    transform: translateY(-5px) scale(1.02) !important;
  }
`;
document.head.appendChild(styleSheet);

export default HomeScreen;
