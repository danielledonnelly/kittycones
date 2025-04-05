import { Link } from "react-router-dom";
import { Button } from "@radix-ui/themes";

const About = () => {
  return (
    <div className="starting screen">
      <div className="end screen end-screen" style={{ top: '30%', position: 'relative', zIndex: 5 }}>
        <h1 className="screen-title">About</h1>
        
        <p className="screen-text">
          Kitty Cones is a fun and fast-paced game where you serve ice cream to 
          hungry kitties! Click on the ingredients and match their orders before 
          time runs out. The faster you serve, the more coins you earn!
        </p>
        <p className="screen-text">
          Challenge yourself to beat your high score and climb the leaderboard! This game was made by Dani Donnelly.
        </p>
      </div>
    </div>
  );
};

export default About;