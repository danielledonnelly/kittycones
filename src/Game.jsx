import { motion } from "motion/react";
import { useGame } from "./useGame";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Game() {
  const {
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
    scoops,
    isMobile,
    isInitialized,
    setCatPositions,
    setCats,
    setCustomerOrders,
    setIsInitialized,
    customerImages,
    generateCustomerOrders,
    gameOverRef
  } = useGame();
  
  const navigate = useNavigate();

  // Add state for emotion icons
  const [emotionIcons, setEmotionIcons] = useState([]);

  // Handle displaying emotions (hearts/rage)
  const createEmotionIcon = (type, x, y) => {
    const newIcon = {
      id: `emotion-${Date.now()}-${Math.random()}`,
      type, // 'hearts' or 'rage'
      x,
      y
    };
    
    setEmotionIcons(prev => [...prev, newIcon]);
    
    // Remove the icon after animation completes
    setTimeout(() => {
      setEmotionIcons(prev => prev.filter(icon => icon.id !== newIcon.id));
    }, 2000);
  };
  
  // Make the emotion function available to useGame
  useEffect(() => {
    window.addEmotionIcon = createEmotionIcon;
    
    return () => {
      delete window.addEmotionIcon;
    };
  }, []);

  // Ensure we navigate away when time is up
  useEffect(() => {
    if (time <= 0) {
      setTimeout(() => {
        navigate("/game-over");
      }, 100);
    }
  }, [time, navigate]);

  return (
    <div className="game-screen">
      {/* Mobile Warning */}
      {showMobileWarning && (
        <div className="mobile screen">
          <h1 className="mobile screen-title">WARNING</h1>
          <p className="mobile screen-text">
            Kitty Cones is not optimized for this screen size! Please play on a
            larger screen.
          </p>
        </div>
      )}

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
                y: cat.exitAnimation ? 0 : Math.sin(bobPhases[index]) * (catPositions[index] ? (isMobile ? 10 : 15) : (isMobile ? 5 : 8))
              }}
              transition={{ 
                duration: cat.exitAnimation ? 2.0 : 0.1,
                ease: cat.exitAnimation ? "easeIn" : "linear",
                type: "tween"
              }}
              style={{
                left: `${catPositions[index]}px`,
                width: isMobile ? '100px' : '220px',
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
                    transition: 'opacity 0.3s ease-out',
                    transform: isMobile ? 'scale(0.5)' : 'scale(1)'
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
                  pointerEvents: cat.exitAnimation ? 'none' : 'auto',
                  transform: isMobile ? 'scale(0.5)' : 'scale(1)'
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
          {selectedScoops.map((scoop, index) => (
            <motion.img
              key={index}
              src={`/assets/${scoop}`}
              alt={`Scoop ${index + 1}`}
              className="ice-cream-scoop"
              style={{ "--scoop-index": index }}
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
        </div>

        {/* Ingredients Section */}
        <div className="ingredients">
          {/* Cones Section */}
          <div className="cone-buttons">
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

          {/* Scoops Section */}
          <div className="scoop-buttons">
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
        </div>

        {/* Reset Button */}
        <div className="restart-container">
          <div className="restart-button">
            <button onClick={resetOrder} className="button">
              <img src="/assets/restart.png" alt="Reset Order" />
            </button>
          </div>
        </div>
      </div>

      {/* Add floating emotion icons */}
      {emotionIcons.map(icon => (
        <motion.div
          key={icon.id}
          className={`floating-emotion ${icon.type}`}
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{ 
            y: -100, 
            opacity: 0,
            scale: icon.type === 'hearts' ? 1.5 : 1.2
          }}
          transition={{ 
            duration: 2, 
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            left: `${icon.x}px`,
            bottom: '450px',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          <img 
            src={`/assets/${icon.type}.png`} 
            alt={icon.type} 
            style={{
              width: icon.type === 'hearts' ? '60px' : '70px',
              height: 'auto'
            }}
          />
        </motion.div>
      ))}
      
      {/* Add floating coin amounts */}
      {floatingCoins.map(coin => (
        <motion.div
          key={coin.id}
          className="floating-coin"
          initial={{ y: 0, opacity: 1 }}
          animate={{ 
            y: -100, 
            opacity: 0
          }}
          transition={{ 
            duration: 2, 
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            left: `${coin.x}px`,
            bottom: '450px',
            color: '#EFDAE6',
            fontSize: '28px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            zIndex: 1000,
            fontFamily: 'Fredoka, sans-serif'
          }}
        >
          +{coin.amount}
        </motion.div>
      ))}
    </div>
  );
}