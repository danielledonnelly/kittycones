import { createContext, useState, useEffect } from "react";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [coins, setCoins] = useState(0);
  const [showInitialsModal, setShowInitialsModal] = useState(false);
  const [pendingScore, setPendingScore] = useState(null);
  
  // Add music state with localStorage persistence
  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    try {
      const savedMusicSetting = localStorage.getItem("isMusicEnabled");
      return savedMusicSetting ? JSON.parse(savedMusicSetting) : false;
    } catch (error) {
      console.error("Error reading music setting from localStorage:", error);
      return false;
    }
  });

  // Save music setting to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("isMusicEnabled", JSON.stringify(isMusicEnabled));
    } catch (error) {
      console.error("Error saving music setting to localStorage:", error);
    }
  }, [isMusicEnabled]);

  // Function to toggle music state
  const toggleMusic = () => {
    setIsMusicEnabled(prev => !prev);
  };

  const [highScores, setHighScores] = useState(() => {
    try {
      const savedScores = localStorage.getItem("highScores");
      
      // Check if saved scores are in the old format (just numbers)
      if (savedScores) {
        const parsedScores = JSON.parse(savedScores);
        
        // If the first item is a number, convert all scores to the new format
        if (parsedScores.length > 0 && typeof parsedScores[0] === 'number') {
          return parsedScores.map(score => ({ initials: "???", score }));
        }
        
        return parsedScores;
      }
      
      return [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  });

  const checkHighScore = (currentScore) => {
    // If there are fewer than 10 scores, it's a high score
    if (highScores.length < 10) {
      setPendingScore(currentScore);
      setShowInitialsModal(true);
      return true;
    }
    
    // Check if currentScore is higher than the lowest high score
    const lowestHighScore = [...highScores].sort((a, b) => a.score - b.score)[0];
    if (currentScore > lowestHighScore.score) {
      setPendingScore(currentScore);
      setShowInitialsModal(true);
      return true;
    }
    
    // Not a high score, just save it normally
    updateHighScores(currentScore);
    return false;
  };

  const saveHighScoreWithInitials = (initials) => {
    if (!pendingScore) return;
    
    const newScore = { initials, score: pendingScore };
    const updatedScores = [...highScores, newScore]
      .filter((score) => score.score > 0) // Ignore invalid scores
      .sort((a, b) => b.score - a.score) // Sort descending
      .slice(0, 10); // Top 10 scores
    
    setHighScores(updatedScores);
    setPendingScore(null);
    setShowInitialsModal(false);
    
    try {
      localStorage.setItem("highScores", JSON.stringify(updatedScores));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const updateHighScores = (currentScore) => {
    // For backward compatibility or scores that don't qualify for initials entry
    const newScore = { initials: "???", score: currentScore };
    const updatedScores = [...highScores, newScore]
      .filter((score) => score.score > 0) // Ignore invalid scores
      .sort((a, b) => b.score - a.score) // Sort descending
      .slice(0, 10); // Top 10 scores
  
    setHighScores(updatedScores);
    try {
      localStorage.setItem("highScores", JSON.stringify(updatedScores));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const cancelInitialsEntry = () => {
    updateHighScores(pendingScore);
    setPendingScore(null);
    setShowInitialsModal(false);
  };

  return (
    <GameContext.Provider 
      value={{ 
        coins, 
        setCoins, 
        highScores, 
        setHighScores,
        updateHighScores,
        checkHighScore,
        saveHighScoreWithInitials,
        showInitialsModal,
        setShowInitialsModal,
        pendingScore,
        cancelInitialsEntry,
        isMusicEnabled,
        toggleMusic
      }}
    >
      {children}
    </GameContext.Provider>
  );
}