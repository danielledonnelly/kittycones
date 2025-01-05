import React, { useState, useEffect } from "react";
import "./App.css";
import { motion, AnimatePresence } from "motion/react"

const generateCustomerOrders = (cones, scoops, customerImages) => {
  return customerImages.map(() => {
    const randomCone = cones[Math.floor(Math.random() * cones.length)];
    const scoopCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 scoops
    const randomScoops = Array.from(
      { length: scoopCount },
      () => scoops[Math.floor(Math.random() * scoops.length)]
    );
    return { cone: randomCone, scoops: randomScoops };
  });
};

function App() {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [selectedCone, setSelectedCone] = useState(null);
  const [selectedScoops, setSelectedScoops] = useState([]);
  const [customerImages, setCustomerImages] = useState(
    Array.from({ length: 10 }, (_, i) => `customer${i + 1}.svg`)
  );
  const [coins, setCoins] = useState(0); // Coin counter
  const [time, setTime] = useState(60); // Timer countdown

  // High scores initialization
  const [highScores, setHighScores] = useState(() => {
    try {
      const savedScores = localStorage.getItem("highScores");
      return savedScores ? JSON.parse(savedScores) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  });  

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

  const [customerOrders, setCustomerOrders] = useState(() =>
    generateCustomerOrders(
      cones,
      scoops,
      Array.from({ length: 10 }, (_, i) => `customer${i + 1}.svg`)
    )
  );

  // Timer logic
  useEffect(() => {
    if (!showStartScreen && !showEndScreen) {
      const timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleGameEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showStartScreen, showEndScreen]);

  const handleConeClick = (cone) => {
    setSelectedCone(cone);
  };

  const handleScoopClick = (scoop) => {
    setSelectedScoops((prevScoops) => [...prevScoops, scoop]);
  };

  const handleRestart = () => {
    setSelectedCone(null);
    setSelectedScoops([]);
    setTime(60); // Reset the timer
    setCoins(0); // Reset coins
    setShowEndScreen(false); // Hide the end screen
    setCustomerOrders(
      generateCustomerOrders(
        cones,
        scoops,
        Array.from({ length: 10 }, (_, i) => `customer${i + 1}.svg`)
      )
    ); // Regenerate customer orders
    setCustomerImages(
      Array.from({ length: 10 }, (_, i) => `customer${i + 1}.svg`)
    ); // Reset customer images
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

      // Update customer queue
      const updatedCustomers = [...customerImages];
      const updatedOrders = [...customerOrders];

      // Remove the clicked customer and shift left
      updatedCustomers.splice(customerIndex, 1);
      updatedOrders.splice(customerIndex, 1);

      // Add a new customer and order at the end
      const newCustomer = `customer${Math.floor(Math.random() * 10) + 1}.svg`;
      const newOrder = generateCustomerOrders(cones, scoops, [newCustomer])[0];

      updatedCustomers.push(newCustomer);
      updatedOrders.push(newOrder);

      setCustomerImages(updatedCustomers);
      setCustomerOrders(updatedOrders);

      // Clear the assembled ice cream
      setSelectedCone(null);
      setSelectedScoops([]);
    } else {
      // Decrement coins
      setCoins((prevCoins) => Math.max(0, prevCoins - 5));
    }
  };

  const handleGameEnd = () => {
    console.log("Final Coins at Game End:", coins); // Debugging
    updateHighScores(coins); // Save the current score
    setShowEndScreen(true); // Show end screen
  };  

  const updateHighScores = (currentScore) => {
    const updatedScores = [...highScores, currentScore]
      .filter((score) => score > 0) // Ignore invalid scores
      .sort((a, b) => b - a) // Sort descending
      .slice(0, 10); // Top 10 scores
  
    setHighScores(updatedScores);
    try {
      localStorage.setItem("highScores", JSON.stringify(updatedScores)); // Save
      console.log("Updated High Scores:", updatedScores); // Debugging
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };
  
  
  
  return (
    <div
      className={`app-container ${
        showStartScreen || showEndScreen ? "disable-buttons" : ""
      }`}
    >
      {/* Starting Screen */}
      {showStartScreen && (
        <div className="starting screen">
          <h1 className="starting screen-title">KITTY CONES</h1>
          <p className="starting screen-text">
            Serve ice cream to hungry kitties by clicking on the appropriate
            ingredients and then clicking the order bubble. Serve kitties as
            fast as possible and keep the line moving to get more coins!
          </p>
          <button
            className="starting screen-button"
            onClick={() => {
              setShowStartScreen(false);
              const backgroundMusic = new Audio("/assets/music.mp3");
              backgroundMusic.loop = true; // Loop the music
              backgroundMusic.volume = 0.5; // Set volume to 50%
              backgroundMusic.play().catch((error) => {
                console.warn("Music playback failed", error);
              });
            }}
          >
            Start
          </button>
        </div>
      )}

      {/* Coin Counter */}
      <div className="coin-counter">Coins: {coins}</div>

      {/* Timer */}
      <div className="timer">Time: {time}</div>

      {/* Background Layer */}
      <img
        src="/assets/background.png"
        alt="Background"
        className="background"
      />

      {/* Customers Layer */}
      <AnimatePresence>
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
    {customerImages.slice(0, 3).map((customer, index) => (
      <motion.div
        key={customer} // Unique identifier
        layout
        className="customer"
        initial={{ opacity: 0, x: 50 }} // Start offscreen to the right
        animate={{ opacity: 1, x: 0 }} // Move to the correct position
        exit={{ opacity: 0, x: -50 }} // Exit to the left
        transition={{ duration: .6 }} // Animation speed
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
        <img src={`/assets/${customer}`} alt={`Customer ${index + 1}`} />
      </motion.div>
    ))}
  </div>
</AnimatePresence>



      {/* Counter */}
      <div className="counter">
        {/* Assembled Ice Cream */}
        <div className="ice-cream">
          {selectedCone && (
            <img
              src={`/assets/${selectedCone}`}
              alt="Selected Cone"
              className="ice-cream-cone"
            />
          )}
          {selectedScoops.map((scoop, index) => (
            <img
              key={index}
              src={`/assets/${scoop}`}
              alt={`Scoop ${index + 1}`}
              className="ice-cream-scoop"
              style={{ bottom: `${210 + index * 50}px` }}
            />
          ))}
        </div>

        {/* Buttons for Cones */}
        <div className="buttons-group cone-buttons">
          {cones.map((cone) => (
            <button
              key={cone}
              onClick={() => handleConeClick(cone)}
              className="button"
            >
              <img src={`/assets/${cone}`} alt={cone} />
            </button>
          ))}
        </div>

        {/* Buttons for Scoops */}
        <div className="buttons-group scoop-buttons">
          {scoops.map((scoop) => (
            <button
              key={scoop}
              onClick={() => handleScoopClick(scoop)}
              className="button"
            >
              <img src={`/assets/${scoop}`} alt={scoop} />
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
      {showEndScreen && (
  <div className="end screen">
    <h1 className="end screen-title">Game Over</h1>
    <p className="end screen-text">Your Score: {coins}</p>
    <h2 className="end screen-title">High Scores</h2>
    <div className="high-scores">
      {highScores.map((score, index) => (
        <div key={index} className="high-score-item">
          {index + 1}. {score}
        </div>
      ))}
    </div>
    <button className="end screen-button" onClick={handleRestart}>
      Restart
    </button>
  </div>
)}

    </div>
  );
}

export default App;