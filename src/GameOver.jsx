import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { GameContext } from "./GameContext";

const GameOver = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    coins, 
    highScores, 
    globalScores, 
    isLoadingGlobalScores, 
    globalScoreError, 
    fetchGlobalScores 
  } = useContext(GameContext);

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
      <h1 className="end screen-title">Game Over</h1>
      <p className="end screen-text">Your Score: {coins}</p>
      
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
        <Link to="/game">
          <button className="end screen-button">Restart</button>
        </Link>
        <Link to="/">
          <button className="end screen-button">Home</button>
        </Link>
      </div>
    </div>
  );
};

export default GameOver;