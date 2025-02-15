import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem("highScores")) || [];
    setHighScores(savedScores.sort((a, b) => b - a)); // Sort descending
  }, []);

  return (
    <div className="end screen end-screen">
      <h1 className="end screen-title">Leaderboard</h1>
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
      <div className="button-group">
        <Link to="/">
          <button className="end screen-button">Home</button>
        </Link>
      </div>
    </div>
  );
};

export default Leaderboard;