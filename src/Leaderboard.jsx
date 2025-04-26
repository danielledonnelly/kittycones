// This is the Kitty Cones leaderboard screen, which can be accessed by clicking the "Leaderboard" button on the home screen.
// The Local and Global Leaderboards are in their own component called Leaderboards.jsx, so that they can be easily re-used both here and on the game over screen.

import { Link } from "react-router-dom";
import Leaderboards from "./Leaderboards";

const Leaderboard = () => {
  return (
    <div className="starting screen">
      <div className="screen end-screen leaderboard-screen">
        <h1 className="screen-title">High Scores</h1>
        <Leaderboards />
      </div>
    </div>
  );
};

export default Leaderboard;