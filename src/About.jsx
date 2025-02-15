import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="end screen end-screen">
      <h1 className="end screen-title">About Kitty Cones</h1>
      <p className="end screen-text">
        Kitty Cones is a fun and fast-paced game where you serve ice cream to 
        hungry kitties! Click on the ingredients and match their orders before 
        time runs out. The faster you serve, the more coins you earn!
      </p>
      <p className="end screen-text">
        Challenge yourself to beat your high score and climb the leaderboard!
      </p>
      <div className="button-group">
        <Link to="/">
          <button className="end screen-button">Home</button>
        </Link>
      </div>
    </div>
  );
};

export default About;