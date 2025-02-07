import React from "react";
import "./App.css";

const Home = ({ onStart, showStartScreen }) => {
  return (
    <div className="home-screen">
      {/* Background Layer */}
      <img
        src="/assets/background.png"
        alt="Background"
        className="home-background"
      />

      {showStartScreen && (
        <div className="starting screen">
          <h1 className="starting screen-title">KITTY CONES</h1>
          <p className="starting screen-text">
            Serve ice cream to hungry kitties by clicking on the ingredients and
            then clicking the order bubble. Serve customers as fast as possible
            and keep the line moving to get more coins!
          </p>
          <button className="starting screen-button" onClick={onStart}>
            Start
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;