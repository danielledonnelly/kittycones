import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="starting screen">
        <h1 className="starting screen-title">KITTY CONES</h1>
        <p className="starting screen-text">
          Make ice cream for hungry kitties by clicking on the ingredients and
          then clicking their order bubble. Serve customers as fast as you can
          and keep the line moving quickly to get more coins!
        </p>
        <Link to="/game">
          <button className="starting screen-button">Start</button>
        </Link>
        <button
          className="starting screen-button"
          onClick={() => (window.location.href = "/about")}
        >
          About
        </button>
        <button
          className="starting screen-button"
          onClick={() => (window.location.href = "/leaderboard")}
        >
          Leaderboard
        </button>
      </div>
    </>
  );
};

export default Home;