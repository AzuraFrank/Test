import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import HomeScreen from "./components/HomeScreen";
import KaraokePlayer from "./components/KaraokePlayer";
import SongLibrary from "./components/SongLibrary";
import RecordingStudio from "./components/RecordingStudio";
import Profile from "./components/Profile";
import Login from "./components/Login";
import AdminDashboard from "./admin/AdminDashboard";
import TournamentPage from "./tournaments/TournamentPage";
import PaymentPage from "./payments/PaymentPage";
import UserDashboard from "./components/UserDashboard";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState("home");
  const [selectedSong, setSelectedSong] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handlePlaySong = (song) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setSelectedSong(song);
    setCurrentScreen("player");
  };

  const handleNavigateWithAuth = (screen) => {
    if (
      !user &&
      ["record", "profile", "dashboard", "tournaments"].includes(screen)
    ) {
      setShowLogin(true);
      return;
    }
    setCurrentScreen(screen);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingContent}>
          <i className="fas fa-microphone pulse" style={styles.loadingIcon}></i>
          <h2 style={styles.loadingTitle}>Nabila Portal Karaoke</h2>
          <p style={styles.loadingText}>Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            onNavigate={handleNavigateWithAuth}
            onPlaySong={handlePlaySong}
          />
        );
      case "library":
        return (
          <SongLibrary
            onNavigate={handleNavigateWithAuth}
            onPlaySong={handlePlaySong}
          />
        );
      case "player":
        return (
          <KaraokePlayer song={selectedSong} onNavigate={setCurrentScreen} />
        );
      case "record":
        return <RecordingStudio onNavigate={setCurrentScreen} />;
      case "profile":
        return <Profile onNavigate={setCurrentScreen} />;
      case "admin":
        return <AdminDashboard onNavigate={setCurrentScreen} />;
      case "tournaments":
        return <TournamentPage onNavigate={setCurrentScreen} />;
      case "payment":
        return <PaymentPage onNavigate={setCurrentScreen} />;
      case "dashboard":
        return <UserDashboard onNavigate={setCurrentScreen} />;
      default:
        return (
          <HomeScreen
            onNavigate={handleNavigateWithAuth}
            onPlaySong={handlePlaySong}
          />
        );
    }
  };

  return (
    <div className="app">
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigateWithAuth}
        onShowLogin={() => setShowLogin(true)}
      />
      <main>{renderScreen()}</main>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = {
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  loadingContent: {
    textAlign: "center",
    color: "white",
  },
  loadingIcon: {
    fontSize: "4rem",
    marginBottom: "20px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  loadingTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "10px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  loadingText: {
    fontSize: "1.1rem",
    opacity: 0.8,
  },
};

export default App;
