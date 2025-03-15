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
  const { coins, setCoins, updateHighScores, checkHighScore } = useContext(GameContext);
  
  const [selectedCone, setSelectedCone] = useState(null); // State to track which cone the player selects.
  const [selectedScoops, setSelectedScoops] = useState([]); // State to track the scoops the player selects.

  const [customerImages, setCustomerImages] = useState(
    // State to hold a list of customer images
    Array.from({ length: 3 }, (_, i) => `customer${i + 1}.svg`)
  );

  const [nextCustomerId, setNextCustomerId] = useState(4);

  // STATISTICS
  // const [coins, setCoins] = useState(0); // State to track the player's coins

  const [time, setTime] = useState(30); // State to track the remaining time

  // const [highScores, setHighScores] = useState(() => {
  //   // State to hold high scores, initialized by reading from localStorage
  //   try {
  //     const savedScores = localStorage.getItem("highScores"); // Try to retrieve saved scores from localStorage
  //     return savedScores ? JSON.parse(savedScores) : []; // If scores exist, parse and use them; otherwise, initialize with an empty array
  //   } catch (error) {
  //     console.error("Error reading from localStorage:", error); // Log any errors that occur while accessing localStorage.
  //     return []; // Default to an empty array if an error occurs
  //   }
  // });

  const [customerOrders, setCustomerOrders] = useState(() =>
    // State for managing customer orders
    generateCustomerOrders(
      cones,
      scoops,
      Array.from({ length: 3 }, (_, i) => `customer${i + 1}.svg`)
    )
  );

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
      // Increment coins
      setCoins((prevCoins) => prevCoins + 15);

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

      // Clear the assembled ice cream
      setSelectedCone(null);
      setSelectedScoops([]);
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
          style={{
            position: "absolute",
            bottom: "30px",
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            zIndex: 2,
          }}
        >

      <AnimatePresence mode="popLayout">

          {customerImages.slice(0, 3).map((customer, index) => (
            <motion.div
              key={customer} // Unique identifier
              layout
              className="customer"
              initial={{ opacity: 0, x: 50 }} // Start offscreen to the right
              animate={{ opacity: 1, x: 0 }} // Move to the correct position
              exit={{ opacity: 0, x: -50 }} // Exit to the left
              transition={{ duration: 0.7 }} // Animation speed
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
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
          {selectedScoops.map((scoop, index) => (
            <img
              key={index}
              src={`/assets/${scoop}`}
              alt={`Scoop ${index + 1}`}
              className="ice-cream-scoop"
              style={{ bottom: `${220 + index * 40}px` }}
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