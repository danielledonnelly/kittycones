import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Component for the animated kitties background
const AnimatedKitties = () => {
  const [kitties, setKitties] = useState([]);
  
  useEffect(() => {
    // Create initial kitties
    const newKitties = [];
    const kittyCount = 5;
    
    for (let i = 0; i < kittyCount; i++) {
      newKitties.push({
        id: i,
        image: `customer${(i % 10) + 1}.png`,
        x: -100 - (i * 300), // Start off-screen with spacing
        y: Math.random() * 250 + 100, // Random vertical position
        speed: Math.random() * 1 + 0.5, // Random speed
        bobPhase: Math.random() * Math.PI * 2, // Random starting phase for head bobbing
        scale: Math.random() * 0.2 + 0.3, // Random size between 0.3 and 0.5
      });
    }
    
    setKitties(newKitties);
    
    // Animation loop
    const animationInterval = setInterval(() => {
      setKitties(prevKitties => {
        return prevKitties.map(kitty => {
          // Move kitty horizontally
          let newX = kitty.x + kitty.speed;
          
          // Reset position when it moves off-screen to the right
          if (newX > window.innerWidth + 100) {
            newX = -150;
          }
          
          // Update bob phase for head movement
          const newBobPhase = (kitty.bobPhase + 0.02) % (Math.PI * 2);
          
          // Calculate y-offset for bobbing movement
          const bobOffset = Math.sin(newBobPhase) * 10;
          
          return {
            ...kitty,
            x: newX,
            bobPhase: newBobPhase,
            y: kitty.y + bobOffset * 0.05, // Apply subtle vertical movement
          };
        });
      });
    }, 16); // ~60fps
    
    return () => clearInterval(animationInterval);
  }, []);
  
  return (
    <div className="animated-kitties-container">
      {kitties.map(kitty => (
        <div
          key={kitty.id}
          className="animated-kitty"
          style={{
            position: 'absolute',
            left: `${kitty.x}px`,
            top: `${kitty.y}px`,
            transform: `scale(${kitty.scale}) translateY(${Math.sin(kitty.bobPhase) * 10}px)`,
            transition: 'transform 0.3s ease-in-out',
            zIndex: 1,
          }}
        >
          <img
            src={`/assets/${kitty.image}`}
            alt="Animated Kitty"
            style={{ width: '220px', height: 'auto' }}
          />
        </div>
      ))}
    </div>
  );
};

const Home = () => {
  return (
    <>
      {/* Animated kitties in the background */}
      <AnimatedKitties />
      
      <div className="starting screen">
        <h1 className="starting screen-title">KITTY CONES</h1>
        <p className="starting screen-text">
          Make ice cream for hungry kitties by clicking on the ingredients and
          then clicking their order bubble. Serve customers as fast as you can
          and keep the line moving quickly to get more coins!
        </p>
        
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