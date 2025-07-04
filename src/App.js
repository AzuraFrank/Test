import React, { useState } from "react";
import Header from "./components/Header";
import HomeScreen from "./components/HomeScreen";
import KaraokePlayer from "./components/KaraokePlayer";
import SongLibrary from "./components/SongLibrary";
import RecordingStudio from "./components/RecordingStudio";
import Profile from "./components/Profile";

function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [selectedSong, setSelectedSong] = useState(null);

  const handlePlaySong = (song) => {
    setSelectedSong(song);
    setCurrentScreen("player");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            onNavigate={setCurrentScreen}
            onPlaySong={handlePlaySong}
          />
        );
      case "library":
        return (
          <SongLibrary
            onNavigate={setCurrentScreen}
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
      default:
        return (
          <HomeScreen
            onNavigate={setCurrentScreen}
            onPlaySong={handlePlaySong}
          />
        );
    }
  };

  return (
    <div className="app">
      <Header currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <main>{renderScreen()}</main>
    </div>
  );
}

export default App;
