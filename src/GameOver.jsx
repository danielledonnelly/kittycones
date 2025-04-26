// This is the game over screen, which is displayed when the player's time runs out. It uses the Leaderboards component to display the local and global leaderboards.

import { Link } from "react-router-dom";
import { useContext } from "react";
import { GameContext } from "./GameContext";
import { Button } from "@radix-ui/themes";
import Leaderboards from "./Leaderboards";

const GameOver = () => {
  const { coins } = useContext(GameContext);

  return (
    <>
      <div className="screen end-screen game-over-screen">
        <h1 className="screen-title">Game Over</h1>
        <p className="screen-text">Your Score: {coins || 0}</p>
        <Leaderboards />
      </div>
      
      <div className="counter">
        <div className="home-title-container">
          <h1 className="home-title">
            KITTY CONES
          </h1>
        </div>
        
        <div className="home-buttons-row">
          <Link to="/game">
            <Button size="3" variant="soft">Play Again</Button>
          </Link>
          
          <Link to="/">
            <Button size="3" variant="soft">Home</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default GameOver;