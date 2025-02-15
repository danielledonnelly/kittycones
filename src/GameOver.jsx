import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const GameOver = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [coins] = useState(location.state?.coins || 0);
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    // Retrieve and update high scores
    const savedScores = JSON.parse(localStorage.getItem("highScores")) || [];
    const newHighScores = [...savedScores, coins].sort((a, b) => b - a).slice(0, 5);
    
    localStorage.setItem("highScores", JSON.stringify(newHighScores));
    setHighScores(newHighScores);
  }, [coins]);

  return (
    <div className="end screen end-screen">
      <h1 className="end screen-title">Game Over</h1>
      <p className="end screen-text">Your Score: {coins}</p>
      <h2 className="end screen-title">High Scores</h2>
      <div className="high-scores">
        {highScores.map((score, index) => (
          <div key={index} className="high-score-item">
            {index + 1}. {score}
          </div>
        ))}
      </div>
      <Link to="/game">
        <button className="end screen-button">Restart</button>
      </Link>
    </div>
  );
};

export default GameOver;