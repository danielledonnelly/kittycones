import { createContext, useState, useEffect } from "react";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [coins, setCoins] = useState(0);
  const [showInitialsModal, setShowInitialsModal] = useState(false);
  const [pendingScore, setPendingScore] = useState(null);
  const [globalScores, setGlobalScores] = useState([]);
  const [isLoadingGlobalScores, setIsLoadingGlobalScores] = useState(false);
  const [globalScoreError, setGlobalScoreError] = useState(null);
  
  // Add music state with localStorage persistence
  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    try {
      // Always start with music disabled by default
      const savedMusicSetting = localStorage.getItem("isMusicEnabled");
      // Only enable if explicitly set to true in localStorage
      return savedMusicSetting === "true" ? true : false;
    } catch (error) {
      console.error("Error reading music setting from localStorage:", error);
      return false; // Default to disabled
    }
  });
  
  // Add sound effects state with localStorage persistence
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    try {
      const savedSoundSetting = localStorage.getItem("isSoundEnabled");
      return savedSoundSetting === "true" ? true : false;
    } catch (error) {
      console.error("Error reading sound setting from localStorage:", error);
      return false; // Default to disabled
    }
  });
  
  // Add Rush Hour mode state with localStorage persistence
  const [isRushHourMode, setIsRushHourMode] = useState(() => {
    try {
      const savedModeSetting = localStorage.getItem("isRushHourMode");
      // Default to normal mode (false)
      return savedModeSetting === "true" ? true : false;
    } catch (error) {
      console.error("Error reading Rush Hour mode from localStorage:", error);
      return false; // Default to normal mode
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
  
  // Save sound effects setting to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("isSoundEnabled", JSON.stringify(isSoundEnabled));
    } catch (error) {
      console.error("Error saving sound setting to localStorage:", error);
    }
  }, [isSoundEnabled]);
  
  // Save Rush Hour mode to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("isRushHourMode", JSON.stringify(isRushHourMode));
    } catch (error) {
      console.error("Error saving Rush Hour mode to localStorage:", error);
    }
  }, [isRushHourMode]);

  // Function to toggle music state
  const toggleAudio = () => {
    setIsMusicEnabled(prev => !prev);
    setIsSoundEnabled(prev => !prev);
  };
  
  // Function to toggle Rush Hour mode
  const toggleRushHourMode = () => {
    setIsRushHourMode(prev => !prev);
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

  // Fetch global scores from Val.town
  const fetchGlobalScores = async () => {
    setIsLoadingGlobalScores(true);
    setGlobalScoreError(null);
    
    try {
      // Using the user's actual Val.town URL
      const valTownUrl = 'https://danielledonnelly-leaderboardkvstore.web.val.run/scores';
      console.log("Fetching global scores from:", valTownUrl);
      
      const response = await fetch(valTownUrl);
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        console.error("Error response from Val.town:", await response.text());
        throw new Error(`Failed to fetch global scores: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Received global scores:", data);
      setGlobalScores(data);
    } catch (error) {
      console.error("Error fetching global scores:", error);
      setGlobalScoreError(error.message);
    } finally {
      setIsLoadingGlobalScores(false);
    }
  };

  // Submit score to Val.town global leaderboard
  const submitGlobalScore = async (initials, score) => {
    try {
      // Using the user's actual Val.town URL
      const valTownUrl = 'https://danielledonnelly-leaderboardkvstore.web.val.run/submit';
      console.log("Submitting score to:", valTownUrl, { initials, score });
      
      const response = await fetch(valTownUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initials, score }),
      });
      
      console.log("Submit response status:", response.status);
      
      if (!response.ok) {
        console.error("Error response from Val.town:", await response.text());
        throw new Error(`Failed to submit score: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Submit response data:", data);
      
      // Update global scores with the new data
      if (data.success && data.topScores) {
        setGlobalScores(data.topScores);
      }
      
      return true;
    } catch (error) {
      console.error("Error submitting global score:", error);
      return false;
    }
  };

  // Fetch global scores when component mounts
  useEffect(() => {
    fetchGlobalScores();
  }, []);

  const checkHighScore = (currentScore) => {
    console.log("Checking high score:", currentScore);
    console.log("Current high scores:", highScores);
    
    // Don't show the initials modal if score is 0
    if (currentScore === 0) {
      console.log("Score is 0, not saving as high score");
      return false;
    }
    
    // If there are fewer than 10 scores, it's a high score
    if (highScores.length < 10) {
      console.log("High score: Fewer than 10 scores");
      setPendingScore(currentScore);
      setShowInitialsModal(true);
      return true;
    }
    
    // Check if currentScore is higher than the lowest high score
    const lowestHighScore = [...highScores].sort((a, b) => a.score - b.score)[0];
    console.log("Lowest high score:", lowestHighScore);
    
    if (currentScore > lowestHighScore.score) {
      console.log("High score: Beat lowest score");
      setPendingScore(currentScore);
      setShowInitialsModal(true);
      return true;
    }
    
    // Not a high score, just save it normally
    console.log("Not a high score");
    updateHighScores(currentScore);
    return false;
  };

  const saveHighScoreWithInitials = async (initials) => {
    console.log("saveHighScoreWithInitials called with initials:", initials);
    if (!pendingScore) {
      console.log("No pending score, returning");
      return;
    }
    
    const newScore = { initials, score: pendingScore };
    const updatedScores = [...highScores, newScore]
      .filter((score) => score.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    console.log("Updating high scores:", updatedScores);
    setHighScores(updatedScores);
    setPendingScore(null);
    setShowInitialsModal(false);
    
    try {
      localStorage.setItem("highScores", JSON.stringify(updatedScores));
      console.log("Saved to localStorage");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
    
    // Also submit to global leaderboard
    console.log("Submitting to global leaderboard");
    await submitGlobalScore(initials, pendingScore);
    console.log("Global leaderboard submission complete");
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

  // Add pause state
  const [isPaused, setIsPaused] = useState(false);

  // Function to toggle pause state
  const togglePause = () => {
    setIsPaused(prev => !prev);
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
        isSoundEnabled,
        toggleAudio,
        globalScores,
        isLoadingGlobalScores,
        globalScoreError,
        fetchGlobalScores,
        submitGlobalScore,
        isRushHourMode,
        toggleRushHourMode,
        isPaused,
        togglePause
      }}
    >
      {children}
    </GameContext.Provider>
  );
}