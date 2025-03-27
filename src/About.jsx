import { Link } from "react-router-dom";
import { Button } from "@radix-ui/themes";

const About = () => {
  return (
    <>
      <div className="counter">
        <div className="buttons-group" style={{ visibility: 'hidden' }}>
          <button className="button" disabled></button>
          <button className="button" disabled></button>
        </div>
        <div className="ice-cream" style={{ visibility: 'hidden' }}></div>
        <div className="restart-button" style={{ visibility: 'hidden' }}></div>
      </div>

      <div className="starting screen">
        <div className="home-title-container">
          <h1 className="home-title">KITTY CONES</h1>
        </div>

        <div className="home-buttons-row">
          <Link to="/game" style={{ textDecoration: 'none' }}>
            <Button size="3" variant="soft">Start</Button>
          </Link>

          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button size="3" variant="soft">Home</Button>
          </Link>
          
          <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
            <Button size="3" variant="soft">Leaderboard</Button>
          </Link>
        </div>

        <div className="end screen end-screen" style={{ top: '30%' }}>
          <h1 className="screen-title">About Kitty Cones</h1>
          
          <p className="screen-text">
            Kitty Cones is a fun and fast-paced game where you serve ice cream to 
            hungry kitties! Click on the ingredients and match their orders before 
            time runs out. The faster you serve, the more coins you earn!
          </p>
          <p className="screen-text">
            Challenge yourself to beat your high score and climb the leaderboard!
          </p>
        </div>
      </div>
    </>
  );
};

export default About;