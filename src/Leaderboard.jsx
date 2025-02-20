import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const [highScores, setHighScores] = useState([]);
  const [globalScores, setGlobalScores] = useState([]); // Placeholder for global scores

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem("highScores")) || [];
    setHighScores(savedScores.sort((a, b) => b - a)); // Sort descending
    
    // Placeholder data for global scores
    setGlobalScores([5000, 4500, 4000, 3500, 3000]);
  }, []);

  return (
    <div className="end screen end-screen">
      <h1 className="end screen-title">Leaderboard</h1>
      <div className="leaderboard-container">
        <div className="leaderboard-column">
          <h2>Local Leaderboard</h2>
          <div className="high-scores">
            {highScores.length > 0 ? (
              highScores.map((score, index) => (
                <div key={index} className="high-score-item">
                  {index + 1}. {score}
                </div>
              ))
            ) : (
              <p className="end screen-text">No high scores yet!</p>
            )}
          </div>
        </div>
        <div className="leaderboard-column">
          <h2>Global Leaderboard</h2>
          <div className="high-scores">
            {globalScores.length > 0 ? (
              globalScores.map((score, index) => (
                <div key={index} className="high-score-item">
                  {index + 1}. {score}
                </div>
              ))
            ) : (
              <p className="end screen-text">No global scores yet!</p>
            )}
          </div>
        </div>
      </div>
      <div className="button-group">
        <Link to="/">
          <button className="end screen-button">Home</button>
        </Link>
      </div>
    </div>
  );
};

export default Leaderboard;