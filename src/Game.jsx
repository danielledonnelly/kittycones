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
    // Function for selecting a cone
    setSelectedCone(cone);
  };

  const handleScoopClick = (scoop) => {
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
      // Show success animation
      setOrderSuccess(true);
      
      // Increment coins
      setCoins((prevCoins) => prevCoins + 15);

      // Set a timeout to reset the ice cream after the animation
      setTimeout(() => {
        // Find the cat by ID and mark it as served (set image to null)
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
          // Fallback to using the index (keep old behavior as backup)
          setCats(prev => {
            const newCats = [...prev];
            // Instead of replacing with empty string, set image to null
            if (newCats[customerIndex]) {
              newCats[customerIndex] = { ...newCats[customerIndex], image: null, served: true };
            }
            return newCats;
          });
        }
        
        // Clear the assembled ice cream and reset animation state
        setSelectedCone(null);
        setSelectedScoops([]);
        setOrderSuccess(false);
      }, 300);
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
                left: `${catPositions[index]}px`,
                y: bobPhases[index] ? Math.sin(bobPhases[index]) * (isRushHourMode ? 15 : 8) : 0,
                opacity: 1
              }}
              transition={{ 
                type: "tween",
                duration: 0.1,
                ease: "linear"
              }}
              style={{
                position: 'absolute',
                left: `${catPositions[index]}px`,
                bottom: '0',
                width: '220px',
                zIndex: Math.floor(catPositions[index])
              }}
            >
              {customerOrders[index] && (
                <div
                  className="order"
                  onClick={() => handleOrderClick(customerOrders[index], index, cat.id)}
                  style={{ cursor: 'pointer' }}
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
                style={{ cursor: 'pointer' }}
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
              initial={{ scale: 0.5, y: 100, opacity: 0 }}
              animate={orderSuccess 
                ? { scale: 1, y: -100, opacity: 0, x: 150 }
                : { scale: 1, y: 0, opacity: 1, x: 0 }
              }
              transition={{ 
                type: "spring", 
                duration: 0.2, // Faster duration (was 0.3)
                stiffness: 500, // Higher stiffness for snappier animation (was 400)
                damping: 15, // Lower damping for quicker settling (was 17)
                mass: 0.7, // Lower mass for faster movement (was not specified)
                ...(orderSuccess && { 
                  y: { duration: 0.2 }, // Faster success animation (was 0.3)
                  x: { duration: 0.2 }, // Faster success animation (was 0.3)
                  opacity: { duration: 0.15, delay: 0.05 } // Faster fade with less delay (was 0.2, 0.1)
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
                marginLeft: "-125px" /* Offset to properly position over cone */
              }}
              initial={{ scale: 1.5, y: -100, opacity: 1 }} /* Full opacity from the start */
              animate={orderSuccess 
                ? { scale: 1, y: -100, opacity: 0, x: 150 }
                : { scale: 1, y: 0, opacity: 1, x: 0 }
              }
              transition={{
                type: "spring",
                stiffness: 600, // Higher stiffness for faster, snappier animation (was 500)
                damping: 16, // Lower damping for quicker settling (was 18)
                mass: 0.6, // Lower mass for faster movement (was 0.8)
                delay: index * 0.03, // Reduced delay between scoops (was 0.05)
                ...(orderSuccess && { 
                  y: { duration: 0.2 }, // Faster success animation (was 0.3)
                  x: { duration: 0.2 }, // Faster success animation (was 0.3)
                  opacity: { duration: 0.15, delay: 0.05 + (index * 0.02) } // Faster fade with less staggered delay (was 0.2, 0.1 + index * 0.03)
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