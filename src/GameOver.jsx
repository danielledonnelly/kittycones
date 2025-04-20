import { Link } from "react-router-dom";
import { useContext } from "react";
import { GameContext } from "./GameContext";
import { Button } from "@radix-ui/themes";

const GameOver = () => {
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
      <h1 className="screen-title">Game Over</h1>
      <p className="screen-text">Your Score: {coins || 0}</p>
      
      <div className="leaderboard-container">
        <div className="leaderboard-column">
          <h2>Local Leaderboard</h2>
          <div className="high-scores">
            {displayHighScores.map((scoreData, index) => (
              <div key={index} className="high-score-item">
                <span className={`rank-number ${index < 9 ? 'single-digit' : ''}`}>{index + 1}.</span>
                {scoreData.score ? `   ${scoreData.initials || ""}      ${scoreData.score} Coins` : ""}
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
              <Button 
                size="3" 
                variant="soft" 
                onClick={fetchGlobalScores}
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="high-scores">
              {displayGlobalScores.map((scoreData, index) => (
                <div key={index} className="high-score-item">
                  <span className={`rank-number ${index < 9 ? 'single-digit' : ''}`}>{index + 1}.</span>
                  {scoreData.score ? `   ${scoreData.initials || ""}      ${scoreData.score} Coins` : ""}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="home-buttons-row">
        <Link to="/game">
          <Button size="3" variant="soft">Play Again</Button>
        </Link>
        
        <Link to="/" >
          <Button size="3" variant="soft">Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default GameOver;