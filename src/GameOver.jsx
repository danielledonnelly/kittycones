import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { GameContext } from "./GameContext";

const GameOver = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { coins, highScores } = useContext(GameContext);
  const [globalScores, setGlobalScores] = useState([]); // Placeholder for global scores

  useEffect(() => {
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