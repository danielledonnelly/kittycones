import { Routes, Route, useLocation } from "react-router-dom";
import { GameProvider, GameContext } from "./GameContext";
import { useContext, useEffect, useRef } from "react";
import "./App.css";
import Home from "./Home";
import Game from "./Game";
import About from "./About";
import GameOver from "./GameOver";
import Leaderboard from "./Leaderboard";
import InitialsModal from "./InitialsModal";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import FastForwardIcon from "@mui/icons-material/FastForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import music from "/assets/music.mp3";

function AppContent() {
  const { 
    showInitialsModal, 
    pendingScore, 
    saveHighScoreWithInitials,
    cancelInitialsEntry,
    isMusicEnabled,
    isSoundEnabled,
    toggleAudio,
    isRushHourMode,
    toggleRushHourMode,
    isPaused,
    togglePause
  } = useContext(GameContext);
  
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const location = useLocation();
  const isGameRoute = location.pathname === "/game";
  
  // Control the global audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      if (isMusicEnabled) {
        audioRef.current.play().catch(error => {
          console.warn("Music playback failed", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicEnabled]);
  
  const handleSaveInitials = async (initials) => {
    await saveHighScoreWithInitials(initials);
    navigate("/game-over");
  };
  
  const handleCancelInitials = () => {
    cancelInitialsEntry();
    navigate("/game-over");
  };

  return (
    <div className="app-container">
      {/* Global Audio Element */}
      <audio ref={audioRef} loop>
        <source src={music} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Rush Hour Mode Toggle Button */}
      <IconButton
        className="rush-hour-button"
        sx={{
          position: "fixed",
          top: "15px",
          right: "170px",
          zIndex: 9999,
          color: "#5E558F",
        }}
        onClick={toggleRushHourMode}
        title={isRushHourMode ? "Switch to normal mode" : "Switch to Rush Hour mode"}
        disableRipple={true}
      >
        {isRushHourMode ? <FastForwardIcon /> : <PlayArrowIcon />}
      </IconButton>
      
      {/* Global Sound Toggle Button */}
      <IconButton
        className="sound-button"
        sx={{
          position: "fixed",
          top: "15px",
          right: "130px",
          zIndex: 9999,
          color: "#5E558F",
        }}
        onClick={toggleAudio}
        title={isMusicEnabled ? "Disable sound" : "Enable sound"}
        disableRipple={true}
      >
        {isMusicEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
      </IconButton>
      
      <img
        src="/assets/background.png"
        alt="Background"
        className={isGameRoute ? "game-background" : "home-background"}
      />
      <Routes>
        {/* Use our Layout component for Home, About, and Leaderboard to show animated kitties */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
        
        {/* Direct routes without animated kitties */}
        <Route path="/game" element={<Game />} />
        <Route path="/game-over" element={<GameOver />} />
      </Routes>
      
      {showInitialsModal && (
        <InitialsModal 
          score={pendingScore} 
          onSave={handleSaveInitials} 
          onCancel={handleCancelInitials} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;