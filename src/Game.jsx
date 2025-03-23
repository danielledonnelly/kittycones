import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { GameContext } from "./GameContext";

// Arrays of cone and scoop images
// NOTE TO SELF: May change the variables below from labeled to numbered so that they match the naming convention of customer images
const cones = [
  "light-cone.png",
  "dark-cone.png",
  "light-cake-cone.png",
  "dark-cake-cone.png",
];
const scoops = [
  "vanilla-scoop.png",
  "chocolate-scoop.png",
  "strawberry-scoop.png",
  "blueberry-scoop.png",
];

// Function to generate randomized customer orders
const generateCustomerOrders = (cones, scoops, customerImages) => {
  return customerImages.map(() => {
    const randomCone = cones[Math.floor(Math.random() * cones.length)]; // Randomly select a cone from the array
    const scoopCount = Math.floor(Math.random() * 3) + 1; // Randomly determine the number of scoops (1 to 3)
    const randomScoops = Array.from(
      { length: scoopCount },
      () => scoops[Math.floor(Math.random() * scoops.length)] // Create an array of randomly selected scoops (up to the scoop count)
    );
    return { cone: randomCone, scoops: randomScoops }; // Return an order object with the selected cone and scoops
  });
};

function Game() {
  const navigate = useNavigate(); // Declare the navigate hook
  const { 
    coins, 
    setCoins, 
    updateHighScores, 
    checkHighScore, 
    isRushHourMode 
  } = useContext(GameContext);
  
  // Create and preload audio
  const popSound = useRef(null);
  const plopSound = useRef(null);
  const thudSound = useRef(null);
  const wooshSound = useRef(null);
  
  useEffect(() => {
    // Initialize audio once when component mounts
    popSound.current = new Audio('/assets/pop.mp3');
    popSound.current.load(); // Preload the audio
    plopSound.current = new Audio('/assets/plop.mp3');
    plopSound.current.load(); // Preload the audio
    thudSound.current = new Audio('/assets/thud.mp3');
    thudSound.current.load(); // Preload the audio
    wooshSound.current = new Audio('/assets/woosh.mp3');
    wooshSound.current.volume = 0.3; // Set woosh sound to 30% volume
    wooshSound.current.load(); // Preload the audio
    return () => {
      if (popSound.current) {
        popSound.current.pause();
        popSound.current = null;
      }
      if (plopSound.current) {
        plopSound.current.pause();
        plopSound.current = null;
      }
      if (thudSound.current) {
        thudSound.current.pause();
        thudSound.current = null;
      }
      if (wooshSound.current) {
        wooshSound.current.pause();
        wooshSound.current = null;
      }
    };
  }, []);

  const [selectedCone, setSelectedCone] = useState(null); // State to track which cone the player selects.
  const [selectedScoops, setSelectedScoops] = useState([]); // State to track the scoops the player selects.
  const [orderSuccess, setOrderSuccess] = useState(false); // New state for order success animation

  const [customerImages, setCustomerImages] = useState(
    Array.from({ length: 4 }, (_, i) => `customer${i + 1}.png`)
  );

  const [nextCustomerId, setNextCustomerId] = useState(6);
  
  // Add state for continuous movement
  const [catPositions, setCatPositions] = useState([]);
  const [cats, setCats] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [bobPhases, setBobPhases] = useState([]);

  // STATISTICS
  const [time, setTime] = useState(30); // State to track the remaining time

  const [customerOrders, setCustomerOrders] = useState(() =>
    // State for managing customer orders
    generateCustomerOrders(
      cones,
      scoops,
      Array.from({ length: 4 }, (_, i) => `customer${i + 1}.png`)
    )
  );

  // Reset customer positions when the game starts or mode changes
  useEffect(() => {
    // Position initial customers differently based on mode - only runs on initial mount
    if (!catPositions.some(pos => pos !== 0)) {
      // Only initialize positions if not already set
      if (isRushHourMode) {
        // For Rush Hour mode, set initial offsets for animation
        setCatPositions([200, 100, 0, -100, -200]);
      } else {
        // For normal mode, use centered positions
        setCatPositions([0, 0, 0, 0]);
      }
    }
  }, []); // No dependency on isRushHourMode to prevent repositioning on mode change

  // Initialize the continuous movement system
  useEffect(() => {
    if (!isInitialized) {
      const screenWidth = window.innerWidth;
      const sectionWidth = screenWidth / 4;
      
      // Initialize cats with IDs and images
      const initialCats = customerImages.map((image, index) => ({
        image,
        id: `cat-${Date.now()}-${index}`
      }));

      // Initialize bob phases for each cat
      const initialBobPhases = Array(initialCats.length + 5).fill(0).map(() => 
        Math.random() * Math.PI * 2
      );

      // Initialize orders for the initial cats
      const initialOrders = generateCustomerOrders(cones, scoops, customerImages);

      // Add additional cats off-screen and their orders
      const additionalCats = [];
      const additionalOrders = [];
      for (let i = 0; i < 5; i++) {
        const catId = nextCustomerId + i;
        const catImage = `customer${catId > 10 ? 1 : catId}.png`;
        additionalCats.push({
            image: catImage, 
          id: `cat-${Date.now()}-${initialCats.length + i}`
        });
        additionalOrders.push(generateCustomerOrders(cones, scoops, [catImage])[0]);
      }

      // Calculate initial positions with equal spacing
      const initialPositions = Array.from({ length: 4 }, (_, i) => {
        return (i * sectionWidth) + (sectionWidth/2 - 110);
      });
      
      // Calculate the position where the last visible cat will be
      const lastVisibleCatPos = initialPositions[initialPositions.length - 1];
      
      // Add positions for additional cats off-screen with the same spacing
      const additionalPositions = Array.from({ length: 5 }, (_, i) => {
        return lastVisibleCatPos + ((i + 1) * sectionWidth);
      });

      setCats([...initialCats, ...additionalCats]);
      setCatPositions([...initialPositions, ...additionalPositions]);
      setCustomerOrders([...initialOrders, ...additionalOrders]);
      setBobPhases(initialBobPhases);
      setIsInitialized(true);
    }
  }, [isInitialized, customerImages, nextCustomerId]);

  // Continuous movement and bobbing effect
  useEffect(() => {
    if (!isInitialized) return;
    
    const moveInterval = setInterval(() => {
      setCatPositions(prev => {
        const screenWidth = window.innerWidth;
        const sectionWidth = screenWidth / 4;
        
        // Move all cats left by fixed amount
        const newPositions = prev.map(pos => pos - (isRushHourMode ? 4 : 2));
        
        // Check if leftmost cat is off-screen
        if (newPositions[0] < -250) {
          newPositions.shift();
          const rightmostPos = newPositions[newPositions.length - 1];
          newPositions.push(rightmostPos + sectionWidth);
          
          // Update bob phases when shifting cats
          setBobPhases(prev => {
            const newPhases = [...prev];
            newPhases.shift();
            newPhases.push(Math.random() * Math.PI * 2);
            return newPhases;
          });

          // Update cats array and orders simultaneously
          setCats(prevCats => {
            const newCats = [...prevCats];
            newCats.shift();
            
            // Add new cat using the next ID in sequence
            let nextId = parseInt(prevCats[prevCats.length - 1].image.match(/customer(\d+)\.png/)[1]);
            nextId = nextId % 10 + 1;
            const newCatImage = `customer${nextId}.png`;
            
            const newCat = {
              image: newCatImage,
              id: `cat-${Date.now()}-${newCats.length}`
            };
            
            newCats.push(newCat);
            
            // Generate and update order for the new cat
            setCustomerOrders(prevOrders => {
              const newOrders = [...prevOrders];
              newOrders.shift();
              const newOrder = generateCustomerOrders(cones, scoops, [newCatImage])[0];
              newOrders.push(newOrder);
              return newOrders;
            });
            
            return newCats;
          });
        }
        
        return newPositions;
      });

      // Update bob phases for animation - increased speed
      setBobPhases(prev => 
        prev.map(phase => (phase + (isRushHourMode ? 0.15 : 0.08)) % (Math.PI * 2))
      );
    }, 16);
    
    return () => clearInterval(moveInterval);
  }, [isInitialized, isRushHourMode]);

  // Simplified container styles
  const getCustomerContainerStyles = () => {
    return {
      position: "absolute",
      bottom: "30px",
      left: 0,
      width: "100%",
      height: "300px",
      overflow: "visible",
      zIndex: 2
    };
  };

  useEffect(() => {
    if (time <= 0) {
      // updateHighScores(coins); // Update high scores when time is up
      // Check if it's a high score first
      if (!checkHighScore(coins)) {
        navigate("/game-over"); // Only navigate if not a high score
      }
    } else {
      const timer = setTimeout(() => setTime(time - 1), 1000); // Shortened time for testing
      return () => clearTimeout(timer);
    }
  }, [time, navigate, coins]);

  useEffect(() => {
    setCoins(0); // Reset coins at the start of a new game
  }, []);


  // ASSEMBLING AND SERVING ICE CREAM CONE LOGIC
  const handleConeClick = (cone) => {
    // Only allow selecting a cone if no cone is currently selected
    if (!selectedCone) {
      // Play sound immediately
      if (popSound.current) {
        popSound.current.currentTime = 0;
        popSound.current.play().catch(error => {
          console.warn("Sound playback failed:", error);
        });
      }
      // Function for selecting a cone
      setSelectedCone(cone);
    }
  };

  const handleScoopClick = (scoop) => {
    // Play plop sound immediately
    if (plopSound.current) {
      plopSound.current.currentTime = 0;
      plopSound.current.play().catch(error => {
        console.warn("Sound playback failed:", error);
      });
    }
    // Function for selecting scoops
    setSelectedScoops((prevScoops) => [...prevScoops, scoop]);
  };

  // Handle click for Rush Hour mode - Modified to use cat objects
  const handleOrderClick = (customerOrder, customerIndex, catId = null) => {
    if (!selectedCone || selectedScoops.length === 0) return;

    const isConeMatch = customerOrder?.cone === selectedCone;
    const isScoopsMatch =
      customerOrder?.scoops?.length === selectedScoops.length &&
      customerOrder?.scoops?.every(
        (scoop, index) => scoop === selectedScoops[index]
      );

    if (isConeMatch && isScoopsMatch) {
      // Play woosh sound immediately
      if (wooshSound.current) {
        wooshSound.current.currentTime = 0;
        wooshSound.current.play().catch(error => {
          console.warn("Sound playback failed:", error);
        });
      }

      // Show success animation
      setOrderSuccess(true);
      
      // Calculate coins based on number of scoops
      const scoopCount = customerOrder.scoops.length;
      const coinReward = scoopCount === 1 ? 15 : scoopCount === 2 ? 20 : 25;
      setCoins((prevCoins) => prevCoins + coinReward);

      // Start cat exit animation
      if (catId) {
        setCats(prev => {
          return prev.map(cat => {
            if (cat && cat.id === catId) {
              return { ...cat, exitAnimation: true };
            }
            return cat;
          });
        });
      } else {
        setCats(prev => {
          const newCats = [...prev];
          if (newCats[customerIndex]) {
            newCats[customerIndex] = { 
              ...newCats[customerIndex], 
              exitAnimation: true 
            };
          }
          return newCats;
        });
      }

      // Reset ice cream assembly immediately
      setTimeout(() => {
        setSelectedCone(null);
        setSelectedScoops([]);
        setOrderSuccess(false);
      }, 300);

      // Remove cat after exit animation completes
      setTimeout(() => {
          if (catId) {
          setCats(prev => {
              return prev.map(cat => {
                if (cat && cat.id === catId) {
                  return { ...cat, image: null, served: true };
                }
                return cat;
              });
            });
          } else {
          setCats(prev => {
              const newCats = [...prev];
              if (newCats[customerIndex]) {
              newCats[customerIndex] = { 
                ...newCats[customerIndex], 
                image: null, 
                served: true 
              };
              }
              return newCats;
            });
          }
      }, 2500); // Adjusted to match new animation duration plus a small buffer
    } else {
      // Decrement coins for incorrect order
      setCoins((prevCoins) => Math.max(0, prevCoins - 5));
    }
  };



  // MOBILE WARNING
  const [showMobileWarning, setShowMobileWarning] = useState(
    window.innerWidth < 1200
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200 && !showMobileWarning) {
        setShowMobileWarning(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showMobileWarning]);

  // Modify the getZIndexForNormalMode function to handle cats at different exit stages
  const getZIndexForNormalMode = (index, isExiting = false) => {
    // If the cat is exiting, it should be behind all other cats
    if (isExiting) return 1;
    
    // Otherwise, cats further left (smaller index) have higher z-index (appear in front)
    // This creates the effect of cats being in a proper line
    return 100 - index; // 100 is an arbitrary high number, adjust as needed
  };

  return (
    <>
      {/* Mobile Warning */}
      {showMobileWarning && (
        <div className="mobile screen">
          <h1 className="mobile screen-title">WARNING</h1>
          <p className="mobile screen-text">
            Kitty Cones is not optimized for this screen size! Please play on a
            larger screen.
          </p>
          {/* <button    this will be enabled when the game is mobile responsive 
            className="mobile screen-button"
            onClick={() => setShowMobileWarning(false)}
          >
            OK
          </button> */}
        </div>
      )}

      {/* Starting Screen */}
      {/* {showStartScreen && (
        <div className="starting screen">
          <h1 className="starting screen-title">KITTY CONES</h1>
          <p className="starting screen-text">
            Serve ice cream to hungry kitties by clicking on the ingredients and
            then clicking the order bubble. Serve customers as fast as possible
            and keep the line moving to get more coins!
          </p>
          <button
            className="starting screen-button"
            onClick={() => {
              setShowStartScreen(false);
              if (backgroundMusic.paused) {
                backgroundMusic.play().catch((error) => {
                  console.warn("Music playback failed", error);
                });
              }
            }}
          >
            Start
          </button>
        </div>
      )} */}

      {/* Coin Counter */}
      <div className="coin-counter">Coins: {coins}</div>

      {/* Timer */}
      <div className="timer">Time: {time}</div>

      {/* Customers Layer */}
      <div style={getCustomerContainerStyles()}>
        {cats.map((cat, index) => (
          cat && cat.image && (
            <motion.div
              key={cat.id}
              className="customer"
              animate={{ 
                x: cat.exitAnimation ? -2500 : 0,
                y: cat.exitAnimation ? 0 : Math.sin(bobPhases[index]) * (isRushHourMode ? 15 : 8)
                }}
                transition={{ 
                duration: cat.exitAnimation ? 2.0 : 0.1,
                ease: cat.exitAnimation ? "easeIn" : "linear",
                type: "tween"
                }}
                style={{
                position: 'absolute',
                left: `${catPositions[index]}px`,
                bottom: '0',
                width: '220px',
                zIndex: cat.exitAnimation ? -10 : Math.floor(catPositions[index]),
                pointerEvents: cat.exitAnimation ? 'none' : 'auto'
              }}
            >
              {customerOrders[index] && !cat.exitAnimation && (
              <div
                className="order"
                  onClick={() => handleOrderClick(customerOrders[index], index, cat.id)}
                  style={{ 
                    cursor: 'pointer',
                    opacity: 1,
                    transition: 'opacity 0.3s ease-out'
                  }}
              >
                {customerOrders[index]?.cone && (
                  <img
                    className="cone-order"
                    src={`/assets/${customerOrders[index].cone}`}
                    alt="Cone"
                  />
                )}
                  {customerOrders[index]?.scoops?.map((scoop, scoopIndex) => (
                  <img
                    key={scoopIndex}
                    className="scoop-order"
                    src={`/assets/${scoop}`}
                    alt={`Scoop ${scoopIndex + 1}`}
                    style={{
                      "--scoop-index": scoopIndex,
                    }}
                  />
                ))}
              </div>
              )}

              <img
                className="customer-image"
                src={`/assets/${cat.image}`}
                alt={`Customer ${index + 1}`}
                onClick={() => handleOrderClick(customerOrders[index], index, cat.id)}
                style={{ 
                  cursor: cat.exitAnimation ? 'default' : 'pointer',
                  pointerEvents: cat.exitAnimation ? 'none' : 'auto'
                }}
              />
            </motion.div>
          )
          ))}
      </div>
      {/* Counter */}
      <div className="counter">
        {/* Assembled Ice Cream */}
        <div className="ice-cream">
          {selectedCone && (
            <motion.img
              src={`/assets/${selectedCone}`}
              alt="Selected Cone"
              className="ice-cream-cone"
              initial={{ scale: 0.5, y: 100 }}
              animate={orderSuccess 
                ? { scale: 1, y: -100, x: 150, opacity: 0 }
                : { scale: 1, y: 0, x: 0, opacity: 1 }
              }
              transition={{ 
                type: "spring", 
                duration: 0.2,
                stiffness: 500,
                damping: 15,
                mass: 0.7,
                ...(orderSuccess && { 
                  y: { duration: 0.2 },
                  x: { duration: 0.2 },
                  opacity: { duration: 0.15 }
                })
              }}
            />
          )}
          {selectedScoops.map((scoop, index) => (
            <motion.img
              key={index}
              src={`/assets/${scoop}`}
              alt={`Scoop ${index + 1}`}
              className="ice-cream-scoop"
              style={{ 
                bottom: `${220 + index * 40}px`,
                position: "absolute",
                left: "50%",
                marginLeft: "-125px"
              }}
              initial={{ scale: 1.5, y: -100, opacity: 1 }}
              animate={orderSuccess 
                ? { scale: 1, y: -100, opacity: 0, x: 150 }
                : { scale: 1, y: 0, opacity: 1, x: 0 }
              }
              transition={{
                type: "spring",
                stiffness: 600,
                damping: 16,
                mass: 0.6,
                delay: index * 0.03,
                ...(orderSuccess && { 
                  y: { duration: 0.2 },
                  x: { duration: 0.2 },
                  opacity: { duration: 0.15 }
                })
              }}
            />
          ))}
        </div>

        {/* Buttons for Cones */}
        <div className="buttons-group cone-buttons">
          {cones.map((cone, index) => (
            <button
              key={cone}
              onClick={() => handleConeClick(cone)}
              className="button cone-stand-button"
            >
              <img 
                src={`/assets/cone-stand${index + 1}.png`} 
                alt={`stand ${index + 1}`} 
                className="stand-image"
              />
            </button>
          ))}
        </div>

        {/* Buttons for Scoops */}
        <div className="buttons-group scoop-buttons">
          {scoops.map((scoop, index) => (
            <button
              key={scoop}
              onClick={() => handleScoopClick(scoop)}
              className="button scoop-tub-button"
            >
              <img 
                src={`/assets/tub${index + 1}.png`} 
                alt={`tub ${index + 1}`} 
                className="tub-image"
              />
            </button>
          ))}
        </div>

        {/* Order Reset Button */}
        <div className="restart-button">
          <button
            onClick={() => {
              // Play thud sound immediately
              if (thudSound.current) {
                thudSound.current.currentTime = 0;
                thudSound.current.play().catch(error => {
                  console.warn("Sound playback failed:", error);
                });
              }
              setSelectedCone(null); // Clear the selected cone
              setSelectedScoops([]); // Clear the selected scoops
            }}
            className="button"
          >
            <img src="/assets/restart.png" alt="Reset Order" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Game;