import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="starting screen">
        <h1 className="starting screen-title">KITTY CONES</h1>
        {/* <p className="starting screen-text">
          Make ice cream for hungry kitties by clicking on the ingredients and
          then clicking their order bubble. Serve customers as fast as you can
          and keep the line moving quickly to get more coins!
        </p> */}
        
        <div className="home-buttons-row">
          <Link to="/game">
            <button className="starting screen-button">Start</button>
          </Link>

          <Link to="/about">
            <button className="starting screen-button">About</button>
          </Link>
          
          <Link to="/leaderboard">
            <button className="starting screen-button">Leaderboard</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;