import { Routes, Route } from "react-router-dom";
import { GameProvider, GameContext } from "./GameContext";
import { useContext, useEffect, useRef } from "react";
import "./App.css";
import Home from "./Home";
import Game from "./Game";
import About from "./About";
import GameOver from "./GameOver";
import Leaderboard from "./Leaderboard";
import InitialsModal from "./InitialsModal";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import music from "/assets/music.mp3";

function AppContent() {
  const { 
    showInitialsModal, 
    pendingScore, 
    saveHighScoreWithInitials,
    cancelInitialsEntry,
    isMusicEnabled,
    toggleMusic
  } = useContext(GameContext);
  
  const navigate = useNavigate();
  const audioRef = useRef(null);
  
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
  
  const handleSaveInitials = (initials) => {
    saveHighScoreWithInitials(initials);
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
      
      {/* Global Music Toggle Button */}
      <IconButton
        className="mute-button"
        sx={{
          position: "fixed",
          top: "15px",
          right: "130px",
          zIndex: 9999,
          color: isMusicEnabled ? "#EFDAE6" : "medium-grey",
        }}
        onClick={toggleMusic}
      >
        {isMusicEnabled ? <MusicNoteIcon /> : <MusicOffIcon />}
      </IconButton>
      
      <img
        src="/assets/background.png"
        alt="Background"
        className="home-background"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/about" element={<About />} />
        <Route path="/game-over" element={<GameOver />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
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