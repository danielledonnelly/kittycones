import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GameContext } from "./GameContext";

const Leaderboard = () => {
  const { 
    highScores, 
    setHighScores, 
    globalScores, 
    isLoadingGlobalScores, 
    globalScoreError, 
    fetchGlobalScores 
  } = useContext(GameContext);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // Log current state of high scores for debugging
    console.log("Current highScores in context:", highScores);
    console.log("Current highScores in localStorage:", localStorage.getItem("highScores"));
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

  // Ensure we have exactly 10 scores for the global leaderboard
  const displayGlobalScores = [...globalScores];
  
  // If we have fewer than 10 scores, pad the array to 10 elements with empty placeholders
  if (displayGlobalScores.length < 10) {
    for (let i = displayGlobalScores.length; i < 10; i++) {
      displayGlobalScores.push({ initials: "", score: "" });
    }
  }

  return (
    <div className="end screen end-screen">
      <h1 className="screen-title">Leaderboards</h1>
      
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
          {isLoadingGlobalScores ? (
            <p>Loading global scores...</p>
          ) : globalScoreError ? (
            <div>
              <p>Error loading global scores</p>
              <button 
                className="screen-button" 
                onClick={fetchGlobalScores}
                style={{ marginTop: '10px', width: 'auto' }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="high-scores">
              {displayGlobalScores.map((scoreData, index) => (
                <div key={index} className="high-score-item">
                  <span className={`rank-number ${index < 9 ? 'single-digit' : ''}`}>{index + 1}.</span>
                  {scoreData.score ? `   ${scoreData.initials || ""}      ${scoreData.score} pts` : ""}
                </div>
              ))}
            </div>
          )}
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
        <button 
          className="screen-button" 
          onClick={fetchGlobalScores}
          disabled={isLoadingGlobalScores}
        >
          {isLoadingGlobalScores ? "Refreshing..." : "Refresh Global Scores"}
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;