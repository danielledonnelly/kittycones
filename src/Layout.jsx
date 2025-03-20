import { useEffect, useState, useContext, useRef } from "react";
import { Outlet } from "react-router-dom";
import { GameContext } from "./GameContext";
import meow1 from "/assets/meow1.mp3?v=2";
import meow2 from "/assets/meow2.mp3?v=2";
import meow3 from "/assets/meow3.mp3?v=2";
import meow4 from "/assets/meow4.mp3?v=2";
import meow5 from "/assets/meow5.mp3?v=2";

// Component for the animated kitties background
export const AnimatedKitties = () => {
  const [kitties, setKitties] = useState([]);
  const { isRushHourMode } = useContext(GameContext);
  const kittiesInitialized = useRef(false);
  const spawnCooldown = useRef(false);
  const meowAudio = useRef(new Audio());
  const meowSounds = [meow1, meow2, meow3, meow4, meow5];
  
  // Initialize kitties only once, not when rush hour mode changes
  useEffect(() => {
    if (kittiesInitialized.current) return;
    kittiesInitialized.current = true;
    
    // Create initial kitties
    const newKitties = [];
    const kittyCount = 5;
    
    // Ensure unique cat types (no duplicates)
    const availableTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // Shuffle the array to randomize which cat types we use
    for (let i = availableTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableTypes[i], availableTypes[j]] = [availableTypes[j], availableTypes[i]];
    }
    
    // Space cats out more evenly across the screen with wider segments
    const screenSegmentWidth = window.innerWidth / kittyCount;
    const fixedHeight = window.innerHeight * 0.55;
    
    for (let i = 0; i < kittyCount; i++) {
      const direction = Math.random() > 0.5 ? 1 : -1;
      
      const segmentMargin = screenSegmentWidth * 0.2;
      const segmentStart = i * screenSegmentWidth + segmentMargin;
      const segmentEnd = (i + 1) * screenSegmentWidth - segmentMargin;
      const segmentWidth = segmentEnd - segmentStart;
      const xPos = segmentStart + Math.random() * segmentWidth;
      
      const speedVariation = 0.5 + (i / kittyCount) * 0.8;
      
      newKitties.push({
        id: i,
        image: `customer${availableTypes[i % availableTypes.length]}.png`,
        x: xPos,
        y: fixedHeight,
        speed: Math.random() * 0.6 + speedVariation,
        bobPhase: Math.random() * Math.PI * 2,
        scale: 2.0,
        direction: direction,
        entryOffset: -250,
        exitOffset: window.innerWidth + 250,
        spawning: false,
      });
    }
    
    setKitties(newKitties);
  }, []);

  // Handle kitty click
  const handleKittyClick = (e) => {
    console.log("Kitty clicked!"); // Add debug log
    // Randomly select a meow sound
    const randomIndex = Math.floor(Math.random() * meowSounds.length);
    const selectedMeow = meowSounds[randomIndex];
    
    // Stop any currently playing meow
    meowAudio.current.pause();
    meowAudio.current.currentTime = 0;
    
    // Update the audio source and play
    meowAudio.current.src = selectedMeow;
    meowAudio.current.play().catch(error => {
      console.log("Audio play failed:", error);
    });
  };
  
  // Animation loop - separate effect to update positions
  useEffect(() => {
    if (kitties.length === 0) return;
    
    const animationInterval = setInterval(() => {
      setKitties(prevKitties => {
        const isAnyKittySpawning = prevKitties.some(kitty => kitty.spawning);
        
        return prevKitties.map(kitty => {
          const speedMultiplier = isRushHourMode ? 3.0 : 1.0;
          
          let newX = kitty.x + (kitty.speed * speedMultiplier * -kitty.direction);
          let isSpawning = kitty.spawning;
          
          if (newX > kitty.exitOffset && -kitty.direction > 0) {
            if (!spawnCooldown.current && !isAnyKittySpawning) {
              newX = kitty.entryOffset;
              isSpawning = true;
              
              spawnCooldown.current = true;
              setTimeout(() => {
                spawnCooldown.current = false;
              }, 2000);
              
              setTimeout(() => {
                setKitties(current => 
                  current.map(k => 
                    k.id === kitty.id ? { ...k, spawning: false } : k
                  )
                );
              }, 1500);
            } else {
              newX = kitty.exitOffset + 50;
            }
          } else if (newX < kitty.entryOffset && -kitty.direction < 0) {
            if (!spawnCooldown.current && !isAnyKittySpawning) {
              newX = kitty.exitOffset;
              isSpawning = true;
              
              spawnCooldown.current = true;
              setTimeout(() => {
                spawnCooldown.current = false;
              }, 2000);
              
              setTimeout(() => {
                setKitties(current => 
                  current.map(k => 
                    k.id === kitty.id ? { ...k, spawning: false } : k
                  )
                );
              }, 1500);
            } else {
              newX = kitty.entryOffset - 50;
            }
          }
          
          const bobIncrement = isRushHourMode ? 0.10 : 0.03;
          const newBobPhase = (kitty.bobPhase + bobIncrement) % (Math.PI * 2);
          const verticalMoveFactor = isRushHourMode ? 1.0 : 0.3;
          
          return {
            ...kitty,
            x: newX,
            bobPhase: newBobPhase,
            y: kitty.y + Math.sin(newBobPhase) * verticalMoveFactor,
            spawning: isSpawning,
          };
        });
      });
    }, 16);
    
    return () => clearInterval(animationInterval);
  }, [kitties.length, isRushHourMode]);
  
  return (
    <div className="animated-kitties-container">
      {kitties.map(kitty => {
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
              zIndex: 1000,
              cursor: 'pointer',
              pointerEvents: 'auto',
              width: '220px',
              height: 'auto',
            }}
            onClick={(e) => {
              console.log("Click event fired");
              handleKittyClick(e);
            }}
          >
            <img
              src={`/assets/${kitty.image}`}
              alt="Animated Kitty"
              style={{ 
                width: '100%', 
                height: '100%',
                pointerEvents: 'none',
                display: 'block'
              }}
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