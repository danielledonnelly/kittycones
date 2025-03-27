import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@radix-ui/themes";

const Home = () => {
  return (
    <>
      {/* Add the counter at the bottom of the page, same as game page */}
      <div className="counter">
        {/* Simple decorative elements to match game counter */}
        <div className="buttons-group" style={{ visibility: 'hidden' }}>
          {/* These are invisible but maintain the counter's layout */}
          <button className="button" disabled></button>
          <button className="button" disabled></button>
        </div>
        <div className="ice-cream" style={{ visibility: 'hidden' }}></div>
        <div className="restart-button" style={{ visibility: 'hidden' }}></div>
      </div>
      
      <div className="starting screen">
        <div className="home-title-container">
          <h1 className="home-title">
            KITTY CONES
          </h1>
        </div>
        
        <div className="home-buttons-row">
          <Link to="/game" style={{ textDecoration: 'none' }}>
            <Button size="3" variant="soft">Start</Button>
          </Link>

          <Link to="/about" style={{ textDecoration: 'none' }}>
            <Button size="3" variant="soft">About</Button>
          </Link>
          
          <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
            <Button size="3" variant="soft">Leaderboard</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;