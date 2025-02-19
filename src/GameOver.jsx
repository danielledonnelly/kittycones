import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { GameContext } from "./GameContext";

const GameOver = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { coins, highScores } = useContext(GameContext);


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
      <br/><br/><br/>
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