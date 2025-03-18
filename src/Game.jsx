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
    // State to hold a list of customer images
    Array.from({ length: 5 }, (_, i) => `customer${i + 1}.png`)
  );

  const [nextCustomerId, setNextCustomerId] = useState(6);
  
  // Add state to track customer positions
  const [customerPositions, setCustomerPositions] = useState([0, 0, 0, 0, 0]);

  // STATISTICS
  const [time, setTime] = useState(30); // State to track the remaining time

  const [customerOrders, setCustomerOrders] = useState(() =>
    // State for managing customer orders
    generateCustomerOrders(
      cones,
      scoops,
      Array.from({ length: 5 }, (_, i) => `customer${i + 1}.png`)
    )
  );

  // Add a state for tracking a single line offset in Rush Hour mode
  const [lineOffset, setLineOffset] = useState(0);

  // Add state to track which positions are occupied in Rush Hour mode
  const [occupiedPositions, setOccupiedPositions] = useState([true, true, true, true, true]);

  // For Rush Hour mode, create a fixed array of cats that move together
  const [rushHourCats, setRushHourCats] = useState([]);
  const [rushHourPositions, setRushHourPositions] = useState([]);
  const [isRushHourInitialized, setIsRushHourInitialized] = useState(false);
  // Add a state to track the next cat ID to use in Rush Hour mode
  const [rushHourNextCatId, setRushHourNextCatId] = useState(1);

  // Reset customer positions when the game starts or mode changes
  useEffect(() => {
    // Position initial customers differently based on mode - only runs on initial mount
    if (!customerPositions.some(pos => pos !== 0)) {
      // Only initialize positions if not already set
      if (isRushHourMode) {
        // For Rush Hour mode, set initial offsets for animation
        setCustomerPositions([200, 100, 0, -100, -200]);
      } else {
        // For normal mode, use centered positions
        setCustomerPositions([0, 0, 0, 0, 0]);
      }
    }
  }, []); // No dependency on isRushHourMode to prevent repositioning on mode change

  // Handle mode transition
  useEffect(() => {
    // This effect handles transition between modes
    if (isRushHourMode) {
      // When switching TO Rush Hour mode, set positions based on current visual positions
      // For customers already displayed in normal mode, they're at x: 0 visually
      // So we need to update their positions to match what they're showing visually
      setCustomerPositions(prev => {
        // Copy their current positions to maintain existing Rush Hour customers if any
        const newPositions = [...prev];
        
        // Ensure the positions array matches the customers array length 
        // and update positions to match what's visually on screen
        while (newPositions.length < customerImages.length) {
          newPositions.push(0); // Add positions for any missing customers at center position
        }
        
        return newPositions;
      });
    }
  }, [isRushHourMode, customerImages.length]);
  
  // Completely simplified container styles for Rush Hour mode
  const getCustomerContainerStyles = () => {
    if (isRushHourMode) {
      return {
        position: "absolute",
        bottom: "30px",
        left: 0,
        width: "100%",
        height: "300px",
        overflow: "visible", // Allow cats to be visible outside container
        zIndex: 2
      };
    } else {
      // Normal mode uses flexbox
      return {
        position: "absolute",
        bottom: "30px",
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-evenly",
        transition: "transform 0.7s",
        zIndex: 2,
      };
    }
  };
  
  // Get styles for individual customers based on their index
  const getCustomerStyle = (index) => {
    if (isRushHourMode) {
      // Fixed positioning for Rush Hour mode, with specific left positions
      // Divide screen into 5 equal sections
      const screenWidth = window.innerWidth;
      const sectionWidth = screenWidth / 5;
      
      // Position cats in a line off to the right, based on their index
      return {
        position: "absolute",
        left: `${index * sectionWidth + (sectionWidth/2 - 110)}px`, // Center within section
        bottom: "0",
        width: "220px",
      };
    } else {
      // Normal mode uses relative positioning
      return {
        width: "220px",
        position: "relative",
      };
    }
  };

  // Reset occupied positions when the game starts or mode changes
  useEffect(() => {
    if (isRushHourMode) {
      setOccupiedPositions([true, true, true, true, true]);
    }
  }, [isRushHourMode]);

  // Initialize Rush Hour mode
  useEffect(() => {
    if (isRushHourMode && !isRushHourInitialized) {
      const screenWidth = window.innerWidth;
      const spacing = 300; // Fixed spacing between cats
      
      // Create initial arrays for Rush Hour mode
      let initialCats = [];
      let initialPositions = [];
      let nextCatId = 1; // Start from the first cat ID
      
      // If transitioning from normal mode, preserve existing cats
      if (customerImages.length > 0) {
        // Start with existing visible cats
        initialCats = [...customerImages];
        
        // Calculate their current positions - in normal mode they're evenly spaced
        const normalSpacing = screenWidth / customerImages.length;
        initialPositions = customerImages.map((_, index) => {
          // In normal mode, cats are evenly distributed with flexbox
          // We need to estimate their absolute positions for Rush Hour mode
          return (index * normalSpacing) + (normalSpacing/2 - 110);
        });
        
        // Update nextCatId to continue from where we left off
        // Extract numbers from customerImages filenames like "customer5.png" to get 5
        const existingIds = customerImages.map(img => {
          const match = img.match(/customer(\d+)\.png/);
          return match ? parseInt(match[1]) : 0;
        });
        nextCatId = Math.max(...existingIds, 0) + 1;
        if (nextCatId > 10) nextCatId = 1; // Cycle back to 1 if we exceed 10
      }
      
      // Add more cats off-screen to the right (for continuous movement)
      const catsToAdd = 10 - initialCats.length;
      const existingOrdersCount = customerOrders.length;
      let newOrders = [];
      
      if (catsToAdd > 0) {
        for (let i = 0; i < catsToAdd; i++) {
          const newCatImg = `customer${nextCatId}.png`;
          initialCats.push(newCatImg);
          
          // Position new cats off-screen to the right
          // Start from right edge of screen plus spacing between each additional cat
          const rightEdgePos = screenWidth;
          initialPositions.push(rightEdgePos + (i * spacing));
          
          // Generate order only for the new cat
          const newOrder = generateCustomerOrders(cones, scoops, [newCatImg])[0];
          newOrders.push(newOrder);
          
          // Move to next cat ID, cycling back to 1 after reaching 10
          nextCatId = nextCatId % 10 + 1;
        }
      }
      
      // Update state with our calculated values
      setRushHourCats(initialCats);
      setRushHourPositions(initialPositions);
      setRushHourNextCatId(nextCatId); // Remember where to start for the next cat
      setIsRushHourInitialized(true);
      
      // Update orders by preserving existing ones and adding new ones
      if (newOrders.length > 0 || initialCats.length !== existingOrdersCount) {
        setCustomerOrders(prevOrders => {
          // Keep all existing orders
          const preservedOrders = prevOrders.slice(0, Math.min(prevOrders.length, initialCats.length - newOrders.length));
          
          // Return combined orders: preserved existing orders + new orders for new cats
          return [...preservedOrders, ...newOrders];
        });
      }
    } else if (!isRushHourMode) {
      // Reset when exiting Rush Hour mode
      setIsRushHourInitialized(false);
    }
  }, [isRushHourMode, isRushHourInitialized, customerImages, customerOrders, cones, scoops]);

  // Handle switching back from Rush Hour to normal mode - preserve orders
  useEffect(() => {
    // If we're switching FROM Rush Hour TO normal mode
    if (!isRushHourMode && rushHourCats.length > 0 && customerImages.length === 0) {
      // Take the visible Rush Hour cats (ones that aren't empty strings from being served)
      // and use them to initialize the normal mode
      const visibleCats = rushHourCats.filter(cat => cat !== "");
      
      // Only take up to 5 cats for normal mode
      const catsForNormalMode = visibleCats.slice(0, 5);
      
      // If we don't have enough cats, add some
      const catsToAdd = 5 - catsForNormalMode.length;
      if (catsToAdd > 0) {
        for (let i = 0; i < catsToAdd; i++) {
          const catIndex = (catsForNormalMode.length % 10) + 1;
          catsForNormalMode.push(`customer${catIndex}.png`);
        }
      }
      
      // Update normal mode cats
      setCustomerImages(catsForNormalMode);
      
      // Preserve orders for existing cats and only generate for new ones
      setCustomerOrders(prevOrders => {
        // Calculate how many existing orders we can reuse
        const existingCats = rushHourCats.filter(cat => cat !== "");
        const reuseOrdersCount = Math.min(existingCats.length, 5); // At most 5 for normal mode
        
        // Determine if we need to generate any new orders
        const ordersToGenerate = 5 - reuseOrdersCount;
        
        if (ordersToGenerate > 0) {
          // Get orders for existing cats
          const existingOrders = prevOrders.slice(0, reuseOrdersCount);
          
          // Generate orders only for new cats
          const newCats = catsForNormalMode.slice(reuseOrdersCount);
          const newOrders = generateCustomerOrders(cones, scoops, newCats);
          
          return [...existingOrders, ...newOrders];
        } else {
          // Just use existing orders for the first 5 cats
          return prevOrders.slice(0, 5);
        }
      });
    }
  }, [isRushHourMode, rushHourCats, cones, scoops]);

  // Simple continuous movement for Rush Hour mode
  useEffect(() => {
    if (!isRushHourMode || !isRushHourInitialized) return;
    
    const moveInterval = setInterval(() => {
      setRushHourPositions(prev => {
        // Move all cats left by fixed amount
        const newPositions = prev.map(pos => pos - 2);
        
        // Check if leftmost cat is off-screen
        if (newPositions[0] < -250) {
          // Remove leftmost cat
          newPositions.shift();
          
          // Add new cat at right end (based on rightmost cat's position)
          const rightmostPos = newPositions[newPositions.length - 1];
          newPositions.push(rightmostPos + 300);
          
          // Update cats array too
          setRushHourCats(prevCats => {
            const newCats = [...prevCats];
            newCats.shift();
            
            // Add new cat using the next ID in sequence
            const newCatImg = `customer${rushHourNextCatId}.png`;
            newCats.push(newCatImg);
            
            // Update the next cat ID for future use, cycling through 1-10
            setRushHourNextCatId(prevId => prevId % 10 + 1);
            
            // Update orders
            setCustomerOrders(prevOrders => {
              const newOrders = [...prevOrders];
              newOrders.shift();
              
              // Generate new order for the new cat
              const newOrder = generateCustomerOrders(
                cones, 
                scoops, 
                [newCatImg]
              )[0];
              
              newOrders.push(newOrder);
              return newOrders;
            });
            
            return newCats;
          });
        }
        
        return newPositions;
      });
    }, 16); // 60 FPS for smoother movement
    
    return () => clearInterval(moveInterval);
  }, [isRushHourMode, isRushHourInitialized, rushHourNextCatId]);

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

  // Handle click for Rush Hour mode
  const handleOrderClick = (customerOrder, customerIndex) => {
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
        if (isRushHourMode) {
          // For Rush Hour mode, simply mark the cat as invisible by replacing its image
          // But keep its position in the array so other cats continue moving as normal
          setRushHourCats(prev => {
            const newCats = [...prev];
            // Replace with empty string to make it invisible, but keep its position
            newCats[customerIndex] = "";
            return newCats;
          });
        } else {
          // Normal mode behavior remains unchanged
          let currentId = nextCustomerId;
          let nextCustomer = `customer${currentId}.png`;
          
          // Update customer images
          setCustomerImages(prevImages => {
            let updatedImages = [...prevImages];
            updatedImages.splice(customerIndex, 1);
            
            while (updatedImages.includes(nextCustomer)) {
              currentId = currentId + 1 > 10 ? 1 : currentId + 1;
              nextCustomer = `customer${currentId}.png`;
            }
            
            updatedImages.push(nextCustomer);
            return updatedImages;
          });
          
          // Update customer orders
          setCustomerOrders(prevOrders => {
            let updatedOrders = [...prevOrders];
            updatedOrders.splice(customerIndex, 1);
            const newOrder = generateCustomerOrders(cones, scoops, [
              `customer${currentId}.png`,
            ])[0];
            updatedOrders.push(newOrder);
            return updatedOrders;
          });
          
          setNextCustomerId(currentId + 1 > 10 ? 1 : currentId + 1);
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
        {isRushHourMode ? (
          /* Rush Hour Mode - ultra simple implementation */
          rushHourCats.map((cat, index) => (
            cat && (
              <div
                key={`cat-${index}-${cat}`}
                className="customer"
                style={{
                  position: 'absolute',
                  left: `${rushHourPositions[index]}px`,
                  bottom: '0',
                  width: '220px'
                }}
              >
                {/* Ice Cream Order */}
                {customerOrders[index] && (
                  <div
                    className="order"
                    onClick={() => handleOrderClick(customerOrders[index], index)}
                  >
                    {/* Cone */}
                    {customerOrders[index]?.cone && (
                      <img
                        className="cone-order"
                        src={`/assets/${customerOrders[index].cone}`}
                        alt="Cone"
                      />
                    )}
                    {/* Scoops */}
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

                {/* Customer Image */}
                <img
                  className="customer-image"
                  src={`/assets/${cat}`}
                  alt={`Customer ${index + 1}`}
                  onClick={() => handleOrderClick(customerOrders[index], index)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )
          ))
        ) : (
          /* Normal Mode - with updated exit animation */
          <AnimatePresence mode="popLayout">
            {customerImages.map((customer, index) => (
              <motion.div
                key={customer}
                layout
                className="customer"
                initial={{ 
                  opacity: 1, 
                  x: 300, 
                  zIndex: getZIndexForNormalMode(index) 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1, 
                  zIndex: getZIndexForNormalMode(index)
                }}
                exit={{ 
                  opacity: 1, 
                  x: -window.innerWidth, // Move completely off screen to the left
                  zIndex: getZIndexForNormalMode(index, true) // Low z-index when exiting
                }}
                transition={{ 
                  duration: 1.2,
                  x: { 
                    type: "spring", 
                    stiffness: 70,
                    damping: 18,
                    mass: 1.5,
                  }
                }}
                style={{
                  width: "220px",
                  position: "relative"
                }}
              >
                {/* Ice Cream Order */}
                <div
                  className="order"
                  onClick={() => handleOrderClick(customerOrders[index], index)}
                >
                  {/* Cone */}
                  {customerOrders[index]?.cone && (
                    <img
                      className="cone-order"
                      src={`/assets/${customerOrders[index].cone}`}
                      alt="Cone"
                    />
                  )}
                  {/* Scoops */}
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

                {/* Customer Image */}
                <img
                  className="customer-image"
                  src={`/assets/${customer}`}
                  alt={`Customer ${index + 1}`}
                  onClick={() => handleOrderClick(customerOrders[index], index)}
                  style={{ cursor: 'pointer' }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
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