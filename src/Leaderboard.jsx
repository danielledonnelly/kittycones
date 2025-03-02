import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GameContext } from "./GameContext";

const Leaderboard = () => {
  const { highScores, setHighScores } = useContext(GameContext);
  const [globalScores, setGlobalScores] = useState([]); // Placeholder for global scores
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // Log current state of high scores for debugging
    console.log("Current highScores in context:", highScores);
    console.log("Current highScores in localStorage:", localStorage.getItem("highScores"));
    
    // Placeholder data for global scores - exactly 10 scores
    setGlobalScores([
      { initials: "AAA", score: 5000 },
      { initials: "BBB", score: 4500 },
      { initials: "CCC", score: 4000 },
      { initials: "DDD", score: 3500 },
      { initials: "EEE", score: 3000 },
      { initials: "FFF", score: 2800 },
      { initials: "GGG", score: 2600 },
      { initials: "HHH", score: 2400 },
      { initials: "III", score: 2200 },
      { initials: "JJJ", score: 2000 }
    ]);
  }, []);

  // Function to clear all high scores
  const clearAllScores = () => {
    setIsClearing(true);
    
    // Clear in context
    setHighScores([]);
    
    // Clear in localStorage
    try {
      localStorage.removeItem("highScores");
      // Also try setting it to an empty array as a fallback
      localStorage.setItem("highScores", JSON.stringify([]));
      console.log("Scores cleared successfully");
      alert("All scores have been cleared!");
    } catch (error) {
      console.error("Error clearing scores:", error);
      alert("There was an error clearing scores. Please check console.");
    } finally {
      setIsClearing(false);
    }
  };

  // Ensure we have exactly 10 scores for display in local leaderboard
  const displayHighScores = [...highScores];
  
  // If we have fewer than 10 scores, pad the array to 10 elements with empty placeholders
  if (displayHighScores.length < 10) {
    for (let i = displayHighScores.length; i < 10; i++) {
      displayHighScores.push({ initials: "", score: "" });
    }
  }

  return (
    <div className="end screen end-screen">
      <h1 className="screen-title">Leaderboard</h1>
      
      <div className="leaderboard-container">
        <div className="leaderboard-column">
          <h2>Local Leaderboard</h2>
          <div className="high-scores">
            {displayHighScores.map((scoreData, index) => (
              <div key={index} className="high-score-item">
                <span className={`rank-number ${index < 9 ? 'single-digit' : ''}`}>{index + 1}.</span>
                {scoreData.score ? `   ${scoreData.initials || ""}      ${scoreData.score} pts` : ""}
              </div>
            ))}
          </div>
        </div>
        <div className="leaderboard-column">
          <h2>Global Leaderboard</h2>
          <div className="high-scores">
            {globalScores.map((scoreData, index) => (
              <div key={index} className="high-score-item">
                <span className={`rank-number ${index < 9 ? 'single-digit' : ''}`}>{index + 1}.</span>
                {`   ${scoreData.initials}      ${scoreData.score} pts`}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="button-group">
        <Link to="/">
          <button className="screen-button">Home</button>
        </Link>
        <button 
          className="screen-button secondary" 
          onClick={clearAllScores}
          style={{ 
            backgroundColor: isClearing ? "#cccccc" : "#ff6b6b",
            cursor: isClearing ? "not-allowed" : "pointer" 
          }}
          disabled={isClearing}
        >
          {isClearing ? "Clearing..." : "Clear All Scores"}
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;