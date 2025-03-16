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
    Array.from({ length: 3 }, (_, i) => `customer${i + 1}.svg`)
  );

  const [nextCustomerId, setNextCustomerId] = useState(4);
  
  // Add state to track customer positions
  const [customerPositions, setCustomerPositions] = useState([0, 0, 0]);

  // STATISTICS
  const [time, setTime] = useState(30); // State to track the remaining time

  const [customerOrders, setCustomerOrders] = useState(() =>
    // State for managing customer orders
    generateCustomerOrders(
      cones,
      scoops,
      Array.from({ length: 3 }, (_, i) => `customer${i + 1}.svg`)
    )
  );

  // Reset customer positions when the game starts or mode changes
  useEffect(() => {
    // Position initial customers differently based on mode
    if (isRushHourMode) {
      // For Rush Hour mode, stagger positions from right
      setCustomerPositions([300, 200, 100]);
    } else {
      // For normal mode, use centered positions
      setCustomerPositions([0, 0, 0]);
    }
  }, [isRushHourMode]);
  
  // Customer container styles with consistent spacing
  const getCustomerContainerStyles = () => {
    return {
      position: "absolute",
      bottom: "30px",
      left: 0,
      width: "100%",
      display: "flex",
      justifyContent: "space-evenly", // This ensures consistent spacing
      zIndex: 2,
    };
  };
  
  // Continuous movement effect for Rush Hour mode
  useEffect(() => {
    // Only create the interval for Rush Hour mode
    if (!isRushHourMode) return;
    
    const moveInterval = setInterval(() => {
      // Continuous leftward movement without stopping
      setCustomerPositions(prev => {
        const newPositions = prev.map(pos => pos - 0.7); // Slightly slower movement
        
        // Check if any customers have moved too far left and need to be removed
        const customersToRemove = [];
        newPositions.forEach((pos, index) => {
          if (pos < -300) { // Customer has moved off-screen to the left
            customersToRemove.push(index);
            // Apply penalty for missing a customer
            setCoins(prevCoins => Math.max(0, prevCoins - 10)); // Lose 10 coins when a customer leaves unserved
          }
        });
        
        // Remove customers that have left the screen (in reverse order to avoid index issues)
        if (customersToRemove.length > 0) {
          // Sort in reverse order to avoid index shifting problems when removing
          customersToRemove.sort((a, b) => b - a).forEach(index => {
            // Update customer arrays in a single batch after the interval
            setCustomerImages(prev => {
              const updatedImages = [...prev];
              updatedImages.splice(index, 1);
              
              // Add a new customer
              let nextCustomer = `customer${nextCustomerId}.svg`;
              let currentId = nextCustomerId;
              
              while (updatedImages.includes(nextCustomer)) {
                currentId = currentId + 1 > 10 ? 1 : currentId + 1;
                nextCustomer = `customer${currentId}.svg`;
              }
              
              updatedImages.push(nextCustomer);
              return updatedImages;
            });
            
            setCustomerOrders(prev => {
              const updatedOrders = [...prev];
              updatedOrders.splice(index, 1);
              const newOrder = generateCustomerOrders(cones, scoops, [`customer${nextCustomerId}.svg`])[0];
              updatedOrders.push(newOrder);
              return updatedOrders;
            });
            
            setNextCustomerId(prev => prev + 1 > 10 ? 1 : prev + 1);
            
            // Also update positions
            newPositions.splice(index, 1);
            newPositions.push(300); // Add new customer far to the right
          });
        }
        
        return newPositions;
      });
    }, 50); // Faster interval for smoother movement
    
    return () => clearInterval(moveInterval);
  }, [nextCustomerId, isRushHourMode]);

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

  const handleOrderClick = (customerOrder, customerIndex) => {
    if (!selectedCone || selectedScoops.length === 0) {
      return;
    }

    const isConeMatch = customerOrder.cone === selectedCone;
    const isScoopsMatch =
      customerOrder.scoops.length === selectedScoops.length &&
      customerOrder.scoops.every(
        (scoop, index) => scoop === selectedScoops[index]
      );

    if (isConeMatch && isScoopsMatch) {
      // Show success animation
      setOrderSuccess(true);
      
      // Increment coins
      setCoins((prevCoins) => prevCoins + 15);

      // Set a timeout to reset the ice cream after the animation
      setTimeout(() => {
        // Update customer images
        setCustomerImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages.splice(customerIndex, 1); // Remove served customer

          // Find the next customer that is not already on screen
          let nextCustomer = `customer${nextCustomerId}.svg`;
          let currentId = nextCustomerId;

          while (updatedImages.includes(nextCustomer)) {
            currentId = currentId + 1 > 10 ? 1 : currentId + 1; // Cycle back to 1 after reaching 10
            nextCustomer = `customer${currentId}.svg`;
          }

          updatedImages.push(nextCustomer); // Add the next customer
          setNextCustomerId(currentId + 1 > 10 ? 1 : currentId + 1); // Update nextCustomerId

          return updatedImages;
        });

        // Update customer positions when a customer is served
        setCustomerPositions(prev => {
          const newPositions = [...prev];
          newPositions.splice(customerIndex, 1); // Remove position of served customer
          
          // In both modes, new customers should start from the right
          // But they're handled differently in the animation
          if (isRushHourMode) {
            newPositions.push(300); // Rush Hour mode - start far to the right and continuously move
          } else {
            newPositions.push(0); // Normal mode - this value doesn't matter for animation
                                  // since normal mode ignores customerPositions for x value
                                  // and just animates from 300 to 0
          }
          
          return newPositions;
        });

        // Update customer orders
        setCustomerOrders((prevOrders) => {
          const updatedOrders = [...prevOrders];
          updatedOrders.splice(customerIndex, 1); // Remove served order
          const newOrder = generateCustomerOrders(cones, scoops, [
            `customer${nextCustomerId}.svg`,
          ])[0];
          updatedOrders.push(newOrder); // Add new order
          return updatedOrders;
        });

        // Clear the assembled ice cream and reset animation state
        setSelectedCone(null);
        setSelectedScoops([]);
        setOrderSuccess(false);
      }, 300); // Timing should match our animation duration
      
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
      <div
          style={getCustomerContainerStyles()}
        >

      <AnimatePresence mode="popLayout">

          {customerImages.slice(0, 3).map((customer, index) => (
            <motion.div
              key={customer} // Unique identifier
              layout
              className="customer"
              initial={{ opacity: 0, x: 300 }} // Start with opacity 0 from the right for a fade-in effect
              animate={{ 
                opacity: isRushHourMode && customerPositions[index] < -200 ? 0.7 : 1, 
                x: isRushHourMode ? customerPositions[index] : 0,  // In Rush Hour: use dynamic positions, In normal: animate to center (0)
                scale: isRushHourMode && customerPositions[index] < -200 ? 0.9 : 1 
              }}
              exit={{ opacity: 0, x: -300 }} // Exit to the left
              transition={{ 
                duration: 0.7,
                x: { type: isRushHourMode ? "tween" : "spring", stiffness: 100, damping: 15 }
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
                {customerOrders[index]?.scoops.map((scoop, scoopIndex) => (
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
              />
            </motion.div>
          ))}
      </AnimatePresence>
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
                duration: 0.3, // Faster duration
                stiffness: 400, // Higher stiffness for snappier animation
                damping: 17, // Balanced damping
                ...(orderSuccess && { 
                  y: { duration: 0.3 }, // Faster success animation
                  x: { duration: 0.3 },
                  opacity: { duration: 0.2, delay: 0.1 } // Faster fade with less delay
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
                stiffness: 500, // Higher stiffness for snappier animation
                damping: 18, // Slightly increased damping
                mass: 0.8, // Lower mass for faster movement
                delay: index * 0.05, // Reduced delay between scoops
                ...(orderSuccess && { 
                  y: { duration: 0.3 }, // Faster success animation
                  x: { duration: 0.3 },
                  opacity: { duration: 0.2, delay: 0.1 + (index * 0.03) } // Faster fade with less staggered delay
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