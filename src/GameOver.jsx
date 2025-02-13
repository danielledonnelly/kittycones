import { Link } from "react-router-dom";

const GameOver = () => {
  const coins = 0;
  const highScores = [];
  return (
    <>
      <div className="end screen end-screen">
        <h1 className="end screen-title">Game Over</h1>
        <p className="end screen-text" style={{ marginBottom: "-30px" }}>
          Your Score: {coins}
        </p>
        <h2 className="end screen-title">High Scores</h2>
        <div className="high-scores">
          {highScores.map((score, index) => (
            <div key={index} className="high-score-item">
              {index + 1}. {score}
            </div>
          ))}
          <br />
        </div>
        <Link to="/game">
          <button className="end screen-button">Restart</button>
        </Link>
      </div>
    </>
  );
};

export default GameOver;
