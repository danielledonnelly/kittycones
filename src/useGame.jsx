import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "./GameContext";

// Arrays of cone and scoop images
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

export function useGame() {
  const navigate = useNavigate(); // Declare the navigate hook
  const { 
    coins, 
    setCoins, 
    updateHighScores, 
    checkHighScore, 
    isRushHourMode,
    isSoundEnabled 
  } = useContext(GameContext);
  
  // Create and preload audio
  const popSound = useRef(null);
  const plopSound = useRef(null);
  const thudSound = useRef(null);
  const wooshSound = useRef(null);
  const angrySound = useRef(null);
  
  // Add state for floating coin amounts
  const [floatingCoins, setFloatingCoins] = useState([]);

  useEffect(() => {
    // Initialize audio once when component mounts
    popSound.current = new Audio('/assets/pop.mp3');
    popSound.current.load(); // Preload the audio
    plopSound.current = new Audio('/assets/plop.mp3');
    plopSound.current.load(); // Preload the audio
    thudSound.current = new Audio('/assets/thud.mp3');
    thudSound.current.load(); // Preload the audio
    wooshSound.current = new Audio('/assets/woosh.mp3');
    wooshSound.current.volume = 0.3; // Quiet woosh
    wooshSound.current.load(); // Preload the audio
    angrySound.current = new Audio('/assets/angry.mp3');
    angrySound.current.volume = 0.2; // Quiet meow
    angrySound.current.load(); // Preload the audio
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
      if (angrySound.current) {
        angrySound.current.pause();
        angrySound.current = null;
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  // STATISTICS
  const [time, setTime] = useState(30); // State to track the remaining time
  // Use a ref to track if the game is over to prevent infinite loops
  const gameOverRef = useRef(false);

  // Add resize handler for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [customerOrders, setCustomerOrders] = useState(() =>
    // State for managing customer orders
    generateCustomerOrders(
      cones,
      scoops,
      Array.from({ length: isMobile ? 2 : 4 }, (_, i) => `customer${i + 1}.png`)
    )
  );

  // MOBILE WARNING
  const [showMobileWarning, setShowMobileWarning] = useState(
    window.innerWidth < 1200
  );

  // Reset customer positions when the game starts or mode changes
  useEffect(() => {
    // Position initial customers differently based on mode - only runs on initial mount
    if (!catPositions.some(pos => pos !== 0)) {
      // Only initialize positions if not already set
      if (isRushHourMode) {
        // For Rush Hour mode, set initial offsets for animation
        setCatPositions(isMobile ? [100, -100] : [200, 100, 0, -100, -200]);
      } else {
        // For normal mode, use centered positions
        setCatPositions(isMobile ? [0, 0] : [0, 0, 0, 0]);
      }
    }
  }, []); // No dependency on isRushHourMode to prevent repositioning on mode change

  // Initialize the continuous movement system
  useEffect(() => {
    if (!isInitialized) {
      const screenWidth = window.innerWidth;
      const sectionWidth = screenWidth / (isMobile ? 2 : 4);
      
      // Initialize cats with IDs and images
      const initialCats = customerImages.slice(0, isMobile ? 2 : 4).map((image, index) => ({
        image,
        id: `cat-${Date.now()}-${index}`
      }));

      // Initialize bob phases for each cat
      const initialBobPhases = Array(initialCats.length + (isMobile ? 2 : 5)).fill(0).map(() => 
        Math.random() * Math.PI * 2
      );

      // Initialize orders for the initial cats
      const initialOrders = generateCustomerOrders(cones, scoops, customerImages.slice(0, isMobile ? 2 : 4));

      // Add additional cats off-screen and their orders
      const additionalCats = [];
      const additionalOrders = [];
      const additionalCount = isMobile ? 2 : 5;
      for (let i = 0; i < additionalCount; i++) {
        const catId = nextCustomerId + i;
        const catImage = `customer${catId > 10 ? 1 : catId}.png`;
        additionalCats.push({
          image: catImage, 
          id: `cat-${Date.now()}-${initialCats.length + i}`
        });
        additionalOrders.push(generateCustomerOrders(cones, scoops, [catImage])[0]);
      }

      // Calculate initial positions with equal spacing
      const initialPositions = Array.from({ length: isMobile ? 2 : 4 }, (_, i) => {
        return (i * sectionWidth) + (sectionWidth/2 - (isMobile ? 60 : 110));
      });
      
      // Calculate the position where the last visible cat will be
      const lastVisibleCatPos = initialPositions[initialPositions.length - 1];
      
      // Add positions for additional cats off-screen with the same spacing
      const additionalPositions = Array.from({ length: additionalCount }, (_, i) => {
        return lastVisibleCatPos + ((i + 1) * (isMobile ? sectionWidth * 0.8 : sectionWidth));
      });

      setCats([...initialCats, ...additionalCats]);
      setCatPositions([...initialPositions, ...additionalPositions]);
      setCustomerOrders([...initialOrders, ...additionalOrders]);
      setBobPhases(initialBobPhases);
      setIsInitialized(true);
    }
  }, [isInitialized, customerImages, nextCustomerId, isMobile]);

  // Continuous movement and bobbing effect
  useEffect(() => {
    if (!isInitialized || time <= 0 || gameOverRef.current) return;
    
    const moveInterval = setInterval(() => {
      setCatPositions(prev => {
        const screenWidth = window.innerWidth;
        const sectionWidth = screenWidth / (isMobile ? 2 : 4);
        
        // Move all cats left by fixed amount - slower on mobile
        const newPositions = prev.map(pos => pos - (isRushHourMode ? (isMobile ? 2 : 4) : (isMobile ? 1 : 2)));
        
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

      // Update bob phases for animation - slower on mobile
      setBobPhases(prev => 
        prev.map(phase => (phase + (isRushHourMode ? (isMobile ? 0.08 : 0.15) : (isMobile ? 0.04 : 0.08))) % (Math.PI * 2))
      );
    }, 16);
    
    return () => clearInterval(moveInterval);
  }, [isInitialized, isRushHourMode, time, isMobile]);

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
    // Skip this effect if game is already over
    if (gameOverRef.current) return;
    
    if (time <= 0) {
      // Mark game as over
      gameOverRef.current = true;
      
      // Check if it's a high score
      if (checkHighScore(coins)) {
        // Let the initials modal from GameContext handle this
      } else {
        // Navigate to game over on next tick to avoid state updates during render
        setTimeout(() => {
          navigate("/game-over");
        }, 0);
      }
    } else {
      const timer = setTimeout(() => setTime(time - 1), 1000); 
      return () => clearTimeout(timer);
    }
  }, [time, navigate, coins, checkHighScore]);

  useEffect(() => {
    setCoins(0); // Reset coins at the start of a new game
  }, [setCoins]);

  const playSound = (soundRef) => {
    if (isSoundEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(error => {
        console.warn("Sound playback failed:", error);
      });
    }
  };

  // ASSEMBLING AND SERVING ICE CREAM CONE LOGIC
  const handleConeClick = (cone) => {
    // Only allow selecting a cone if no cone is currently selected
    if (!selectedCone) {
      // Play sound immediately
      playSound(popSound);
      // Function for selecting a cone
      setSelectedCone(cone);
    }
  };

  const handleScoopClick = (scoop) => {
    // Only allow adding scoops if a cone is selected
    if (!selectedCone) return;
    
    // Play plop sound immediately
    playSound(plopSound);
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
      playSound(wooshSound);

      // Show success animation
      setOrderSuccess(true);
      
      // Calculate coins based on number of scoops
      const scoopCount = customerOrder.scoops.length;
      const coinReward = scoopCount === 1 ? 15 : scoopCount === 2 ? 20 : 25;
      setCoins((prevCoins) => prevCoins + coinReward);

      // Add floating coin amount
      const catPosition = catPositions[customerIndex];
      setFloatingCoins(prev => [...prev, {
        id: Date.now(),
        amount: coinReward,
        x: catPosition + 80,
        y: 200
      }]);

      // Remove floating coin after animation
      setTimeout(() => {
        setFloatingCoins(prev => prev.filter(coin => coin.id !== Date.now()));
      }, 2000);

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
      }, 2500);
    } else {
      // Play angry sound for incorrect order
      playSound(angrySound);
      // Decrement coins for incorrect order
      setCoins((prevCoins) => Math.max(0, prevCoins - 5));
    }
  };

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

  const resetOrder = () => {
    // Play thud sound immediately
    if (thudSound.current) {
      thudSound.current.currentTime = 0;
      thudSound.current.play().catch(error => {
        console.warn("Sound playback failed:", error);
      });
    }
    setSelectedCone(null); // Clear the selected cone
    setSelectedScoops([]); // Clear the selected scoops
  };

  return {
    coins,
    time,
    floatingCoins,
    selectedCone,
    selectedScoops,
    orderSuccess,
    catPositions,
    cats,
    bobPhases,
    customerOrders,
    showMobileWarning,
    handleConeClick,
    handleScoopClick,
    handleOrderClick,
    resetOrder,
    getCustomerContainerStyles,
    getZIndexForNormalMode,
    cones,
    scoops
  };
} 