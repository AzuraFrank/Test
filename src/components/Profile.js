import React, { useState } from "react";

const Profile = ({ onNavigate }) => {
  const [user] = useState({
    name: "Karaoke Star",
    username: "@karaokestar",
    avatar: "https://via.placeholder.com/120x120/ff6b6b/ffffff?text=🎤",
    level: 15,
    xp: 2450,
    nextLevelXp: 3000,
    joinDate: "January 2024",
    bio: "Music lover and karaoke enthusiast! 🎵",
  });

  const [stats] = useState({
    songsPerformed: 147,
    totalTime: "24h 35m",
    averageScore: 87,
    highestScore: 98,
    favoriteGenre: "Pop",
    streak: 12,
  });

  const [achievements] = useState([
    {
      id: 1,
      name: "First Song",
      icon: "🎵",
      earned: true,
      description: "Performed your first song",
    },
    {
      id: 2,
      name: "Perfect Score",
      icon: "🌟",
      earned: true,
      description: "Achieved a perfect 100% score",
    },
    {
      id: 3,
      name: "Night Owl",
      icon: "🦉",
      earned: true,
      description: "Sang after midnight",
    },
    {
      id: 4,
      name: "Early Bird",
      icon: "🐦",
      earned: false,
      description: "Sang before 6 AM",
    },
    {
      id: 5,
      name: "Rockstar",
      icon: "🤘",
      earned: true,
      description: "Performed 10 rock songs",
    },
    {
      id: 6,
      name: "Pop Icon",
      icon: "💫",
      earned: true,
      description: "Performed 25 pop songs",
    },
    {
      id: 7,
      name: "Marathon Singer",
      icon: "🏃",
      earned: false,
      description: "Sing for 2 hours straight",
    },
    {
      id: 8,
      name: "Social Butterfly",
      icon: "🦋",
      earned: false,
      description: "Share 10 performances",
    },
  ]);

  const [recentPerformances] = useState([
    {
      id: 1,
      song: "Perfect",
      artist: "Ed Sheeran",
      score: 94,
      date: "2 hours ago",
      duration: "4:23",
    },
    {
      id: 2,
      song: "Blinding Lights",
      artist: "The Weeknd",
      score: 89,
      date: "1 day ago",
      duration: "3:20",
    },
    {
      id: 3,
      song: "Someone Like You",
      artist: "Adele",
      score: 92,
      date: "2 days ago",
      duration: "4:47",
    },
  ]);

  const getScoreColor = (score) => {
    if (score >= 90) return "#4caf50";
    if (score >= 75) return "#ff9800";
    return "#f44336";
  };

  const xpProgress = (user.xp / user.nextLevelXp) * 100;

  return (
    <div style={styles.container} className="fade-in">
      <div className="container">
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.avatarContainer}>
            <img src={user.avatar} alt={user.name} style={styles.avatar} />
            <div style={styles.levelBadge}>Lv. {user.level}</div>
          </div>

          <div style={styles.userInfo}>
            <h1 style={styles.userName}>{user.name}</h1>
            <p style={styles.username}>{user.username}</p>
            <p style={styles.bio}>{user.bio}</p>
            <p style={styles.joinDate}>Member since {user.joinDate}</p>

            {/* XP Progress */}
            <div style={styles.xpContainer}>
              <div style={styles.xpInfo}>
                <span>Level {user.level}</span>
                <span>
                  {user.xp} / {user.nextLevelXp} XP
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

          <div style={styles.profileActions}>
            <button className="btn btn-primary" style={styles.actionButton}>
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
            <button className="btn btn-secondary" style={styles.actionButton}>
              <i className="fas fa-share"></i>
              Share
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsSection}>
          <h2 style={styles.sectionTitle}>📊 Your Stats</h2>
          <div style={styles.statsGrid}>
            <StatCard
              icon="fas fa-music"
              title="Songs Performed"
              value={stats.songsPerformed}
              color="#ff6b6b"
            />
            <StatCard
              icon="fas fa-clock"
              title="Total Time"
              value={stats.totalTime}
              color="#feca57"
            />
            <StatCard
              icon="fas fa-chart-line"
              title="Average Score"
              value={`${stats.averageScore}%`}
              color="#48dbfb"
            />
            <StatCard
              icon="fas fa-trophy"
              title="Highest Score"
              value={`${stats.highestScore}%`}
              color="#ff9ff3"
            />
            <StatCard
              icon="fas fa-heart"
              title="Favorite Genre"
              value={stats.favoriteGenre}
              color="#54a0ff"
            />
            <StatCard
              icon="fas fa-fire"
              title="Current Streak"
              value={`${stats.streak} days`}
              color="#5f27cd"
            />
          </div>
        </div>

        {/* Achievements */}
        <div style={styles.achievementsSection}>
          <h2 style={styles.sectionTitle}>🏆 Achievements</h2>
          <div style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>

        {/* Recent Performances */}
        <div style={styles.performancesSection}>
          <h2 style={styles.sectionTitle}>🎤 Recent Performances</h2>
          <div style={styles.performancesList}>
            {recentPerformances.map((performance) => (
              <PerformanceCard
                key={performance.id}
                performance={performance}
                getScoreColor={getScoreColor}
              />
            ))}
          </div>

          <div style={styles.viewAllContainer}>
            <button
              className="btn btn-secondary"
              onClick={() => onNavigate("history")}
              style={styles.viewAllButton}
            >
              View All Performances
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Settings Section */}
        <div style={styles.settingsSection}>
          <h2 style={styles.sectionTitle}>⚙️ Settings</h2>
          <div style={styles.settingsGrid}>
            <SettingCard
              icon="fas fa-bell"
              title="Notifications"
              description="Manage your notification preferences"
            />
            <SettingCard
              icon="fas fa-shield-alt"
              title="Privacy"
              description="Control who can see your profile"
            />
            <SettingCard
              icon="fas fa-palette"
              title="Theme"
              description="Customize your app appearance"
            />
            <SettingCard
              icon="fas fa-download"
              title="Downloads"
              description="Manage your downloaded content"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="card" style={styles.statCard}>
    <div style={{ ...styles.statIcon, color }}>
      <i className={icon}></i>
    </div>
    <div style={styles.statContent}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statTitle}>{title}</div>
    </div>
  </div>
);

const AchievementCard = ({ achievement }) => (
  <div
    className="card"
    style={{
      ...styles.achievementCard,
      ...(achievement.earned
        ? styles.achievementEarned
        : styles.achievementLocked),
    }}
  >
    <div style={styles.achievementIcon}>
      {achievement.earned ? achievement.icon : "🔒"}
    </div>
    <h4 style={styles.achievementName}>{achievement.name}</h4>
    <p style={styles.achievementDesc}>{achievement.description}</p>
    {achievement.earned && <div style={styles.achievementBadge}>Earned!</div>}
  </div>
);

const PerformanceCard = ({ performance, getScoreColor }) => (
  <div className="card" style={styles.performanceCard}>
    <div style={styles.performanceInfo}>
      <h4 style={styles.performanceSong}>{performance.song}</h4>
      <p style={styles.performanceArtist}>{performance.artist}</p>
      <div style={styles.performanceMeta}>
        <span style={styles.performanceDuration}>
          <i className="fas fa-clock"></i>
          {performance.duration}
        </span>
        <span style={styles.performanceDate}>
          <i className="fas fa-calendar"></i>
          {performance.date}
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

const SettingCard = ({ icon, title, description }) => (
  <div className="card" style={styles.settingCard}>
    <div style={styles.settingIcon}>
      <i className={icon}></i>
    </div>
    <div style={styles.settingContent}>
      <h4 style={styles.settingTitle}>{title}</h4>
      <p style={styles.settingDesc}>{description}</p>
    </div>
    <div style={styles.settingArrow}>
      <i className="fas fa-chevron-right"></i>
    </div>
  </div>
);

const styles = {
  container: {
    paddingTop: "30px",
    paddingBottom: "40px",
    minHeight: "100vh",
  },
  profileHeader: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: "30px",
    alignItems: "center",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "40px",
    backdropFilter: "blur(10px)",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "4px solid rgba(255,255,255,0.2)",
    objectFit: "cover",
  },
  levelBadge: {
    position: "absolute",
    bottom: "-5px",
    right: "-5px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "5px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  username: {
    fontSize: "1.2rem",
    opacity: 0.7,
    marginBottom: "10px",
  },
  bio: {
    fontSize: "1.1rem",
    marginBottom: "10px",
    opacity: 0.9,
  },
  joinDate: {
    fontSize: "0.9rem",
    opacity: 0.6,
    marginBottom: "20px",
  },
  xpContainer: {
    width: "100%",
    maxWidth: "400px",
  },
  xpInfo: {
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
  profileActions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  actionButton: {
    padding: "10px 20px",
    whiteSpace: "nowrap",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "25px",
    textAlign: "center",
  },
  statsSection: {
    marginBottom: "40px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
    transition: "transform 0.3s ease",
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
  },
  achievementsSection: {
    marginBottom: "40px",
  },
  achievementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  achievementCard: {
    textAlign: "center",
    padding: "25px 20px",
    transition: "all 0.3s ease",
  },
  achievementEarned: {
    background: "rgba(76, 175, 80, 0.2)",
    border: "2px solid rgba(76, 175, 80, 0.5)",
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: "3rem",
    marginBottom: "15px",
  },
  achievementName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "8px",
  },
  achievementDesc: {
    fontSize: "0.9rem",
    opacity: 0.8,
    lineHeight: 1.4,
    marginBottom: "10px",
  },
  achievementBadge: {
    background: "linear-gradient(45deg, #4caf50, #8bc34a)",
    color: "white",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
    display: "inline-block",
  },
  performancesSection: {
    marginBottom: "40px",
  },
  performancesList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "25px",
  },
  performanceCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
  },
  performanceInfo: {
    flex: 1,
  },
  performanceSong: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "5px",
  },
  performanceArtist: {
    opacity: 0.7,
    marginBottom: "10px",
  },
  performanceMeta: {
    display: "flex",
    gap: "20px",
    fontSize: "0.9rem",
    opacity: 0.6,
  },
  performanceDuration: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  performanceDate: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  performanceScore: {
    minWidth: "80px",
    textAlign: "center",
  },
  scoreCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "3px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "600",
    margin: "0 auto",
  },
  viewAllContainer: {
    textAlign: "center",
  },
  viewAllButton: {
    padding: "12px 24px",
    gap: "10px",
  },
  settingsSection: {
    marginBottom: "40px",
  },
  settingsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  settingCard: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  settingIcon: {
    fontSize: "1.5rem",
    minWidth: "40px",
    textAlign: "center",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "5px",
  },
  settingDesc: {
    fontSize: "0.9rem",
    opacity: 0.7,
  },
  settingArrow: {
    fontSize: "1.2rem",
    opacity: 0.5,
  },
};

export default Profile;
