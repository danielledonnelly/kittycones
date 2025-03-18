import { useEffect, useState, useContext, useRef } from "react";
import { Outlet } from "react-router-dom";
import { GameContext } from "./GameContext";

// Component for the animated kitties background
export const AnimatedKitties = () => {
  const [kitties, setKitties] = useState([]);
  const { isRushHourMode } = useContext(GameContext);
  const kittiesInitialized = useRef(false);
  
  // Initialize kitties only once, not when rush hour mode changes
  useEffect(() => {
    if (kittiesInitialized.current) return;
    kittiesInitialized.current = true;
    
    // Create initial kitties
    const newKitties = [];
    const kittyCount = 8; // More kitties for a fuller screen
    
    for (let i = 0; i < kittyCount; i++) {
      // Ensure direction and movement are consistent
      const direction = Math.random() > 0.5 ? 1 : -1; // 1 = facing right, -1 = facing left
      newKitties.push({
        id: i,
        image: `customer${(i % 10) + 1}.png`,
        x: Math.random() * window.innerWidth, // Random starting position
        y: Math.random() * (window.innerHeight - 200) + 100, // Random vertical position
        speed: Math.random() * 1 + 0.5, // Random speed
        bobPhase: Math.random() * Math.PI * 2, // Random starting phase for head bobbing
        scale: Math.random() * 0.2 + 0.3, // Random size between 0.3 and 0.5
        direction: direction, // Facing direction: 1 = right, -1 = left
      });
    }
    
    setKitties(newKitties);
  }, []); // Empty dependency array - only run once
  
  // Animation loop - separate effect to update positions
  useEffect(() => {
    if (kitties.length === 0) return;
    
    const animationInterval = setInterval(() => {
      setKitties(prevKitties => {
        return prevKitties.map(kitty => {
          // Apply speed multiplier when in Rush Hour mode
          const speedMultiplier = isRushHourMode ? 3.0 : 1.0;
          
          // Move kitty in the opposite direction of facing
          // If kitty.direction = 1 (facing right), move left (negative x change)
          // If kitty.direction = -1 (facing left), move right (positive x change)
          let newX = kitty.x + (kitty.speed * speedMultiplier * -kitty.direction);
          
          // Reset position when it moves off-screen (reversed conditions)
          if (newX > window.innerWidth + 150 && -kitty.direction > 0) {
            newX = -150;
          } else if (newX < -150 && -kitty.direction < 0) {
            newX = window.innerWidth + 150;
          }
          
          // Update bob phase for head movement (faster in Rush Hour mode)
          const bobIncrement = isRushHourMode ? 0.15 : 0.05;
          const newBobPhase = (kitty.bobPhase + bobIncrement) % (Math.PI * 2);
          
          // More pronounced vertical movement in Rush Hour mode
          const verticalMoveFactor = isRushHourMode ? 1.5 : 0.5;
          
          return {
            ...kitty,
            x: newX,
            bobPhase: newBobPhase,
            y: kitty.y + Math.sin(newBobPhase) * verticalMoveFactor, // Vertical movement adjusted by mode
          };
        });
      });
    }, 16); // ~60fps
    
    return () => clearInterval(animationInterval);
  }, [kitties.length, isRushHourMode]);
  
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