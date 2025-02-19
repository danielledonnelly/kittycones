import { createContext, useState } from "react";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [coins, setCoins] = useState(0);
  const [highScores, setHighScores] = useState(() => {
    try {
      const savedScores = localStorage.getItem("highScores");
      return savedScores ? JSON.parse(savedScores) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  });

    const updateHighScores = (currentScore) => {
      const updatedScores = [...highScores, currentScore]
        .filter((score) => score > 0) // Ignore invalid scores
        .sort((a, b) => b - a) // Sort descending
        .slice(0, 10); // Top 10 scores
  
      setHighScores(updatedScores);
      try {
        const scoresString = JSON.stringify(updatedScores);
        if (scoresString) {
          localStorage.setItem("highScores", scoresString);
          console.log("Updated High Scores:", updatedScores); // Debugging
        }
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    };


  return (
    <GameContext.Provider value={{ coins, setCoins, highScores, updateHighScores }}>
      {/* setHighScores is not being passed here, only updateHighScores is */}
      {children}
    </GameContext.Provider>
  );
}