import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

// Component for the animated kitties background
export const AnimatedKitties = () => {
  const [kitties, setKitties] = useState([]);
  
  useEffect(() => {
    // Create initial kitties
    const newKitties = [];
    const kittyCount = 8; // More kitties for a fuller screen
    
    for (let i = 0; i < kittyCount; i++) {
      newKitties.push({
        id: i,
        image: `customer${(i % 10) + 1}.png`,
        x: Math.random() * window.innerWidth, // Random starting position
        y: Math.random() * (window.innerHeight - 200) + 100, // Random vertical position
        speed: Math.random() * 1 + 0.5, // Random speed
        bobPhase: Math.random() * Math.PI * 2, // Random starting phase for head bobbing
        scale: Math.random() * 0.2 + 0.3, // Random size between 0.3 and 0.5
        direction: Math.random() > 0.5 ? 1 : -1, // Random direction (left or right)
      });
    }
    
    setKitties(newKitties);
    
    // Animation loop
    const animationInterval = setInterval(() => {
      setKitties(prevKitties => {
        return prevKitties.map(kitty => {
          // Move kitty horizontally based on direction
          let newX = kitty.x + (kitty.speed * kitty.direction);
          
          // Reset position when it moves off-screen
          if (newX > window.innerWidth + 150 && kitty.direction > 0) {
            newX = -150;
          } else if (newX < -150 && kitty.direction < 0) {
            newX = window.innerWidth + 150;
          }
          
          // Update bob phase for head movement
          const newBobPhase = (kitty.bobPhase + 0.05) % (Math.PI * 2);
          
          return {
            ...kitty,
            x: newX,
            bobPhase: newBobPhase,
            y: kitty.y + Math.sin(newBobPhase) * 0.5, // Subtle vertical movement
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
            transform: `scale(${kitty.scale}) translateY(${Math.sin(kitty.bobPhase) * 10}px) scaleX(${kitty.direction})`,
            transition: 'transform 0.3s ease-in-out',
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

const Layout = () => {
  return (
    <div className="app-container">
      {/* Background with animated kitties that appears on all screens */}
      <AnimatedKitties />
      
      {/* The Outlet will render the current route */}
      <Outlet />
    </div>
  );
};

export default Layout; 