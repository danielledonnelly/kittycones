import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { motion, AnimatePresence } from "motion/react";
import music from "/assets/music.mp3";
import { IconButton } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import Home from "./Home";
import Game from "./Game";

function App() {
  const [showStartScreen, setShowStartScreen] = useState(true); 

  const handleStart = () => {
    setShowStartScreen(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onStart={handleStart} showStartScreen={showStartScreen} />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;