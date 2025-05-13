import { useContext, useState } from "react";
import { GameContext } from "./GameContext";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

const Pause = () => {
  const { isPaused, togglePause } = useContext(GameContext);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const navigate = useNavigate();

  if (!isPaused) return null;

  if (showHowToPlay) {
    return (
      <div className="pause-overlay">
        <div className="screen end-screen pause-screen">
          <div className="how-to-play-content">
            <img 
              src="/assets/how-to-play.png" 
              alt="How to Play Instructions" 
              className="how-to-play-image"
            />
            <Button 
              size="3" 
              variant="soft" 
              onClick={() => setShowHowToPlay(false)}
              className="back-button"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pause-overlay">
      <div className="screen end-screen pause-screen">
        <h1 className="screen-title">Game Paused</h1>
        <div className="pause-buttons">
          <Button size="3" variant="soft" onClick={togglePause}>
            Resume
          </Button>
          <Button size="3" variant="soft" onClick={() => setShowHowToPlay(true)}>
            How to Play
          </Button>
          <Button 
            size="3" 
            variant="soft" 
            onClick={() => {
              togglePause();
              navigate("/");
            }}
          >
            Quit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pause; 