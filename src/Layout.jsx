import { useEffect, useState, useContext, useRef } from "react";
import { Outlet } from "react-router-dom";
import { GameContext } from "./GameContext";

// Component for the animated kitties background
export const AnimatedKitties = () => {
  const [kitties, setKitties] = useState([]);
  const { isRushHourMode } = useContext(GameContext);
  const kittiesInitialized = useRef(false);
  // Add a ref to track spawn cooldown
  const spawnCooldown = useRef(false);
  
  // Initialize kitties only once, not when rush hour mode changes
  useEffect(() => {
    if (kittiesInitialized.current) return;
    kittiesInitialized.current = true;
    
    // Create initial kitties
    const newKitties = [];
    const kittyCount = 5; // Reduced number again for better spacing when bigger
    
    // Ensure unique cat types (no duplicates)
    const availableTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // Shuffle the array to randomize which cat types we use
    for (let i = availableTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableTypes[i], availableTypes[j]] = [availableTypes[j], availableTypes[i]];
    }
    
    // Space cats out more evenly across the screen with wider segments
    const screenSegmentWidth = window.innerWidth / kittyCount;
    
    // Use a fixed height for all cats - position them a bit higher on the screen
    // 55% from the top of the screen - just a little higher than before
    const fixedHeight = window.innerHeight * 0.55;
    
    for (let i = 0; i < kittyCount; i++) {
      // Ensure direction and movement are consistent
      const direction = Math.random() > 0.5 ? 1 : -1; // 1 = facing right, -1 = facing left
      
      // More structured positioning within each segment to prevent clumping
      // Add a margin to each segment to prevent cats from being too close to each other
      const segmentMargin = screenSegmentWidth * 0.2;
      const segmentStart = i * screenSegmentWidth + segmentMargin;
      const segmentEnd = (i + 1) * screenSegmentWidth - segmentMargin;
      const segmentWidth = segmentEnd - segmentStart;
      const xPos = segmentStart + Math.random() * segmentWidth;
      
      // Each cat should have a different speed to reduce synchronized movement
      const speedVariation = 0.5 + (i / kittyCount) * 0.8; // Different speeds based on index
      
      newKitties.push({
        id: i,
        image: `customer${availableTypes[i % availableTypes.length]}.png`, // Unique cat type for each cat
        x: xPos, // Distributed across screen width
        y: fixedHeight, // All cats at the same fixed height
        speed: Math.random() * 0.6 + speedVariation, // More varied speeds but slightly slower overall
        bobPhase: Math.random() * Math.PI * 2, // Random starting phase for head bobbing
        scale: 2.0, // Larger cats
        direction: direction, // Facing direction: 1 = right, -1 = left
        // Randomize entry/exit points for when cats reset
        entryOffset: -250, // Further off-screen entry point for larger cats
        exitOffset: window.innerWidth + 250, // Further off-screen exit point for larger cats
        spawning: false, // Track if this cat is currently spawning
      });
    }
    
    setKitties(newKitties);
  }, []); // Empty dependency array - only run once
  
  // Animation loop - separate effect to update positions
  useEffect(() => {
    if (kitties.length === 0) return;
    
    const animationInterval = setInterval(() => {
      setKitties(prevKitties => {
        // Check if any cat is currently spawning
        const isAnyKittySpawning = prevKitties.some(kitty => kitty.spawning);
        
        return prevKitties.map(kitty => {
          // Apply speed multiplier when in Rush Hour mode
          const speedMultiplier = isRushHourMode ? 3.0 : 1.0;
          
          // Move kitty in the opposite direction of facing
          // If kitty.direction = 1 (facing right), move left (negative x change)
          // If kitty.direction = -1 (facing left), move right (positive x change)
          let newX = kitty.x + (kitty.speed * speedMultiplier * -kitty.direction);
          let isSpawning = kitty.spawning;
          
          // Reset position when cat is completely off-screen (using custom entry/exit points)
          if (newX > kitty.exitOffset && -kitty.direction > 0) {
            // Only allow respawn if no other cat is currently spawning
            if (!spawnCooldown.current && !isAnyKittySpawning) {
              // When exiting to the right, reset to the left
              newX = kitty.entryOffset;
              isSpawning = true; // Mark this cat as spawning
              
              // Set spawn cooldown
              spawnCooldown.current = true;
              setTimeout(() => {
                spawnCooldown.current = false;
              }, 2000); // 2-second cooldown before another cat can spawn
              
              // Auto-clear spawning state after 3 seconds
              setTimeout(() => {
                setKitties(current => 
                  current.map(k => 
                    k.id === kitty.id ? { ...k, spawning: false } : k
                  )
                );
              }, 1500);
            } else {
              // If another cat is spawning, keep this one off-screen
              newX = kitty.exitOffset + 50;
            }
          } else if (newX < kitty.entryOffset && -kitty.direction < 0) {
            // Only allow respawn if no other cat is currently spawning
            if (!spawnCooldown.current && !isAnyKittySpawning) {
              // When exiting to the left, reset to the right
              newX = kitty.exitOffset;
              isSpawning = true; // Mark this cat as spawning
              
              // Set spawn cooldown
              spawnCooldown.current = true;
              setTimeout(() => {
                spawnCooldown.current = false;
              }, 2000); // 2-second cooldown before another cat can spawn
              
              // Auto-clear spawning state after 3 seconds
              setTimeout(() => {
                setKitties(current => 
                  current.map(k => 
                    k.id === kitty.id ? { ...k, spawning: false } : k
                  )
                );
              }, 1500);
            } else {
              // If another cat is spawning, keep this one off-screen
              newX = kitty.entryOffset - 50;
            }
          }
          
          // Update bob phase for head movement (slower in this version for more natural movement)
          const bobIncrement = isRushHourMode ? 0.10 : 0.03;
          const newBobPhase = (kitty.bobPhase + bobIncrement) % (Math.PI * 2);
          
          // More subtle vertical movement
          const verticalMoveFactor = isRushHourMode ? 1.0 : 0.3;
          
          return {
            ...kitty,
            x: newX,
            bobPhase: newBobPhase,
            // Use very subtle vertical movement around the fixed height
            y: kitty.y + Math.sin(newBobPhase) * verticalMoveFactor,
            spawning: isSpawning,
          };
        });
      });
    }, 16); // ~60fps
    
    return () => clearInterval(animationInterval);
  }, [kitties.length, isRushHourMode]);
  
  return (
    <div className="animated-kitties-container">
      {kitties.map(kitty => {
        // Fixed z-index since all cats are at the same height
        const zIndex = 5;
        
        return (
          <div
            key={kitty.id}
            className="animated-kitty"
            style={{
              position: 'absolute',
              left: `${kitty.x}px`,
              top: `${kitty.y}px`,
              transform: `scale(${kitty.scale}) translateY(${Math.sin(kitty.bobPhase) * 10}px) scaleX(${kitty.direction})`,
              transition: 'transform 0.3s ease-in-out',
              zIndex: zIndex,
            }}
          >
            <img
              src={`/assets/${kitty.image}`}
              alt="Animated Kitty"
              style={{ width: '220px', height: 'auto' }}
            />
          </div>
        );
      })}
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