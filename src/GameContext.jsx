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

  return (
    <GameContext.Provider value={{ coins, setCoins, highScores, setHighScores }}>
      {children}
    </GameContext.Provider>
  );
}