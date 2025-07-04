import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { performanceService } from "../services/database";

const UserDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPerformances: 0,
    averageScore: 0,
    bestScore: 0,
    totalTime: "0h 0m",
    level: 1,
    xp: 0,
    nextLevelXp: 1000,
    streak: 0,
    favoriteGenre: "Pop",
  });

  const [recentPerformances, setRecentPerformances] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Mock data - in real app, fetch from Supabase
      setStats({
        totalPerformances: 47,
        averageScore: 87,
        bestScore: 98,
        totalTime: "12h 35m",
        level: 8,
        xp: 2340,
        nextLevelXp: 3000,
        streak: 5,
        favoriteGenre: "Pop",
      });

      setRecentPerformances([
        {
          id: 1,
          song: "Perfect",
          artist: "Ed Sheeran",
          score: 94,
          date: "2024-07-04",
          time: "14:30",
          duration: "4:23",
        },
        {
          id: 2,
          song: "Blinding Lights",
          artist: "The Weeknd",
          score: 89,
          date: "2024-07-03",
          time: "20:15",
          duration: "3:20",
        },
        {
          id: 3,
          song: "Someone Like You",
          artist: "Adele",
          score: 92,
          date: "2024-07-03",
          time: "19:45",
          duration: "4:47",
        },
      ]);

      setAchievements([
        {
          id: 1,
          name: "Perfect Score",
          icon: "🌟",
          date: "2024-07-01",
          rare: true,
        },
        {
          id: 2,
          name: "Week Warrior",
          icon: "🔥",
          date: "2024-06-30",
          rare: false,
        },
        {
          id: 3,
          name: "Genre Master",
          icon: "🎵",
          date: "2024-06-28",
          rare: false,
        },
      ]);

      setWeeklyProgress([
        { day: "Sen", score: 85, performances: 3 },
        { day: "Sel", score: 88, performances: 2 },
        { day: "Rab", score: 92, performances: 4 },
        { day: "Kam", score: 87, performances: 2 },
        { day: "Jum", score: 94, performances: 3 },
        { day: "Sab", score: 89, performances: 1 },
        { day: "Min", score: 91, performances: 2 },
      ]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  const xpProgress = (stats.xp / stats.nextLevelXp) * 100;

  const getScoreColor = (score) => {
    if (score >= 90) return "#4caf50";
    if (score >= 80) return "#ff9800";
    if (score >= 70) return "#2196f3";
    return "#f44336";
  };

  return (
    <div style={styles.container} className="fade-in">
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <img
              src={
                user?.user_metadata?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email)}&background=ff6b6b&color=fff`
              }
              alt="Avatar"
              style={styles.avatar}
            />
            <div>
              <h1 style={styles.userName}>
                Dashboard{" "}
                {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
              </h1>
              <p style={styles.userSubtitle}>
                Level {stats.level} Karaoke Star ⭐
              </p>
            </div>
          </div>

          <div style={styles.levelProgress}>
            <div style={styles.levelInfo}>
              <span>Level {stats.level}</span>
              <span>
                {stats.xp} / {stats.nextLevelXp} XP
              </span>
            </div>
            <div style={styles.xpBar}>
              <div
                style={{
                  ...styles.xpBarFill,
                  width: `${xpProgress}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={styles.quickStats}>
          <StatCard
            icon="fas fa-microphone"
            title="Total Performances"
            value={stats.totalPerformances}
            change="+3 minggu ini"
            color="#ff6b6b"
          />
          <StatCard
            icon="fas fa-chart-line"
            title="Rata-rata Score"
            value={`${stats.averageScore}%`}
            change="+2% dari bulan lalu"
            color="#feca57"
          />
          <StatCard
            icon="fas fa-trophy"
            title="Best Score"
            value={`${stats.bestScore}%`}
            change="Perfect!"
            color="#48dbfb"
          />
          <StatCard
            icon="fas fa-fire"
            title="Streak"
            value={`${stats.streak} hari`}
            change="Keep going!"
            color="#ff9ff3"
          />
        </div>

        {/* Charts & Progress */}
        <div style={styles.chartsSection}>
          {/* Weekly Progress */}
          <div className="card" style={styles.chartCard}>
            <h3 style={styles.chartTitle}>📊 Progress Mingguan</h3>
            <div style={styles.weeklyChart}>
              {weeklyProgress.map((day, index) => (
                <div key={index} style={styles.dayColumn}>
                  <div style={styles.dayLabel}>{day.day}</div>
                  <div style={styles.scoreBar}>
                    <div
                      style={{
                        ...styles.scoreBarFill,
                        height: `${day.score}%`,
                        backgroundColor: getScoreColor(day.score),
                      }}
                    />
                  </div>
                  <div style={styles.dayScore}>{day.score}%</div>
                  <div style={styles.dayPerformances}>
                    {day.performances} lagu
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="card" style={styles.achievementsCard}>
            <h3 style={styles.chartTitle}>🏆 Achievement Terbaru</h3>
            <div style={styles.achievementsList}>
              {achievements.map((achievement) => (
                <div key={achievement.id} style={styles.achievementItem}>
                  <div style={styles.achievementIcon}>{achievement.icon}</div>
                  <div style={styles.achievementContent}>
                    <div style={styles.achievementName}>
                      {achievement.name}
                      {achievement.rare && (
                        <span style={styles.rareBadge}>RARE</span>
                      )}
                    </div>
                    <div style={styles.achievementDate}>
                      {new Date(achievement.date).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn btn-secondary"
              style={styles.viewAllButton}
              onClick={() => onNavigate("profile")}
            >
              Lihat Semua Achievement
            </button>
          </div>
        </div>

        {/* Recent Performances */}
        <div className="card" style={styles.performancesSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>🎤 Performa Terbaru</h3>
            <button
              className="btn btn-primary"
              onClick={() => onNavigate("record")}
              style={styles.recordButton}
            >
              <i className="fas fa-microphone"></i>
              Rekam Sekarang
            </button>
          </div>

          <div style={styles.performancesList}>
            {recentPerformances.map((performance) => (
              <PerformanceItem
                key={performance.id}
                performance={performance}
                getScoreColor={getScoreColor}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.actionsSection}>
          <h3 style={styles.sectionTitle}>⚡ Quick Actions</h3>
          <div style={styles.actionsGrid}>
            <ActionCard
              icon="fas fa-music"
              title="Cari Lagu"
              description="Jelajahi koleksi lagu"
              onClick={() => onNavigate("library")}
              color="#ff6b6b"
            />
            <ActionCard
              icon="fas fa-trophy"
              title="Tournament"
              description="Ikuti kompetisi"
              onClick={() => onNavigate("tournaments")}
              color="#feca57"
            />
            <ActionCard
              icon="fas fa-crown"
              title="Upgrade Premium"
              description="Fitur eksklusif"
              onClick={() => onNavigate("payment")}
              color="#ff9ff3"
            />
            <ActionCard
              icon="fas fa-cog"
              title="Pengaturan"
              description="Edit profil"
              onClick={() => onNavigate("profile")}
              color="#48dbfb"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, color }) => (
  <div className="card" style={styles.statCard}>
    <div style={{ ...styles.statIcon, color }}>
      <i className={icon}></i>
    </div>
    <div style={styles.statContent}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statTitle}>{title}</div>
      <div style={styles.statChange}>{change}</div>
    </div>
  </div>
);

const PerformanceItem = ({ performance, getScoreColor }) => (
  <div style={styles.performanceItem}>
    <div style={styles.performanceInfo}>
      <div style={styles.performanceMain}>
        <h4 style={styles.performanceSong}>{performance.song}</h4>
        <p style={styles.performanceArtist}>{performance.artist}</p>
      </div>
      <div style={styles.performanceMeta}>
        <span style={styles.performanceDate}>
          {new Date(performance.date).toLocaleDateString("id-ID")} •{" "}
          {performance.time}
        </span>
        <span style={styles.performanceDuration}>
          <i className="fas fa-clock"></i>
          {performance.duration}
        </span>
      </div>
    </div>

    <div style={styles.performanceScore}>
      <div
        style={{
          ...styles.scoreCircle,
          borderColor: getScoreColor(performance.score),
        }}
      >
        <span style={{ color: getScoreColor(performance.score) }}>
          {performance.score}%
        </span>
      </div>
    </div>
  </div>
);

const ActionCard = ({ icon, title, description, onClick, color }) => (
  <div className="card" style={styles.actionCard} onClick={onClick}>
    <div style={{ ...styles.actionIcon, color }}>
      <i className={icon}></i>
    </div>
    <h4 style={styles.actionTitle}>{title}</h4>
    <p style={styles.actionDesc}>{description}</p>
  </div>
);

const styles = {
  container: {
    paddingTop: "30px",
    paddingBottom: "40px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "20px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid rgba(255,255,255,0.2)",
  },
  userName: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "5px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  userSubtitle: {
    fontSize: "1.1rem",
    opacity: 0.8,
  },
  levelProgress: {
    minWidth: "200px",
  },
  levelInfo: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    marginBottom: "8px",
    opacity: 0.8,
  },
  xpBar: {
    height: "8px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    transition: "width 0.3s ease",
  },
  quickStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
  },
  statIcon: {
    fontSize: "2.5rem",
    minWidth: "60px",
    textAlign: "center",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "5px",
  },
  statTitle: {
    fontSize: "0.9rem",
    opacity: 0.7,
    marginBottom: "3px",
  },
  statChange: {
    fontSize: "0.8rem",
    opacity: 0.6,
    fontStyle: "italic",
  },
  chartsSection: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "25px",
    marginBottom: "40px",
  },
  chartCard: {
    padding: "25px",
  },
  chartTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "20px",
  },
  weeklyChart: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "200px",
    gap: "10px",
  },
  dayColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  dayLabel: {
    fontSize: "0.8rem",
    marginBottom: "10px",
    opacity: 0.7,
  },
  scoreBar: {
    width: "100%",
    height: "120px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "4px",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    marginBottom: "10px",
  },
  scoreBarFill: {
    width: "100%",
    borderRadius: "4px",
    transition: "height 0.3s ease",
  },
  dayScore: {
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "3px",
  },
  dayPerformances: {
    fontSize: "0.7rem",
    opacity: 0.6,
  },
  achievementsCard: {
    padding: "25px",
  },
  achievementsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
  },
  achievementItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
  },
  achievementIcon: {
    fontSize: "1.5rem",
    minWidth: "40px",
    textAlign: "center",
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "3px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  rareBadge: {
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    padding: "2px 6px",
    borderRadius: "8px",
    fontSize: "0.7rem",
    fontWeight: "700",
  },
  achievementDate: {
    fontSize: "0.8rem",
    opacity: 0.6,
  },
  viewAllButton: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
  },
  performancesSection: {
    marginBottom: "40px",
    padding: "25px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    margin: 0,
  },
  recordButton: {
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  performancesList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  performanceItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
  },
  performanceInfo: {
    flex: 1,
  },
  performanceMain: {
    marginBottom: "8px",
  },
  performanceSong: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "3px",
  },
  performanceArtist: {
    opacity: 0.7,
    fontSize: "0.9rem",
  },
  performanceMeta: {
    display: "flex",
    gap: "15px",
    fontSize: "0.8rem",
    opacity: 0.6,
  },
  performanceDate: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  performanceDuration: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  performanceScore: {
    minWidth: "70px",
    textAlign: "center",
  },
  scoreCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "3px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  actionsSection: {
    textAlign: "center",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  actionCard: {
    padding: "25px",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  actionIcon: {
    fontSize: "2.5rem",
    marginBottom: "15px",
  },
  actionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "8px",
  },
  actionDesc: {
    opacity: 0.7,
    fontSize: "0.9rem",
  },
};

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .action-card:hover {
    transform: translateY(-5px) !important;
  }
`;
document.head.appendChild(styleSheet);

export default UserDashboard;
