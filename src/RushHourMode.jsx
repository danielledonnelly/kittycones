import React, { useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";

function RushHourMode({ 
  rushHourCats, 
  rushHourPositions, 
  customerOrders, 
  handleOrderClick,
  isRushHourInitialized,
  setRushHourCats,
  setRushHourPositions,
  setRushHourNextCatId,
  rushHourNextCatId,
  setCustomerOrders,
  generateCustomerOrders,
  cones,
  scoops
}) {
  // Simple continuous movement for Rush Hour mode
  useEffect(() => {
    if (!isRushHourInitialized) return;
    
    const moveInterval = setInterval(() => {
      setRushHourPositions(prev => {
        const newPositions = prev.map(pos => pos - 2);
        
        if (newPositions[0] < -250) {
          newPositions.shift();
          const rightmostPos = newPositions[newPositions.length - 1];
          newPositions.push(rightmostPos + 300);
          
          setRushHourCats(prevCats => {
            const newCats = [...prevCats];
            newCats.shift();
            
            const newCatImg = `customer${rushHourNextCatId}.png`;
            newCats.push({
              image: newCatImg,
              id: `cat-${Date.now()}-${newCats.length}`
            });
            
            setRushHourNextCatId(prevId => prevId % 10 + 1);
            
            setCustomerOrders(prevOrders => {
              const newOrders = [...prevOrders];
              newOrders.shift();
              const newOrder = generateCustomerOrders(cones, scoops, [newCatImg])[0];
              newOrders.push(newOrder);
              return newOrders;
            });
            
            return newCats;
          });
        }
        
        return newPositions;
      });
    }, 16);
    
    return () => clearInterval(moveInterval);
  }, [isRushHourInitialized, rushHourNextCatId, setRushHourCats, setRushHourPositions, setRushHourNextCatId, setCustomerOrders, generateCustomerOrders, cones, scoops]);

  // Helper function to handle z-index for customers
  const getZIndexForCat = (position, isExiting = false) => {
    // If the cat is exiting, it should be behind other cats
    if (isExiting) return 1;
    // Otherwise, cats further right (higher position) have lower z-index
    return Math.floor(position);
  };

  return (
    <AnimatePresence>
      {rushHourCats.map((cat, index) => (
        cat && cat.image && (
          <motion.div
            key={cat.id}
            className="customer"
            initial={{ 
              opacity: 1,
              zIndex: getZIndexForCat(rushHourPositions[index])
            }}
            animate={{ 
              opacity: 1, 
              x: 0,
              zIndex: getZIndexForCat(rushHourPositions[index])
            }}
            exit={{ 
              opacity: 1, 
              x: -window.innerWidth,
              zIndex: getZIndexForCat(rushHourPositions[index], true)
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
              position: 'absolute',
              left: `${rushHourPositions[index]}px`,
              bottom: '0',
              width: '220px'
            }}
          >
            {customerOrders[index] && (
              <div
                className="order"
                onClick={() => handleOrderClick(customerOrders[index], index, cat.id)}
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
    </AnimatePresence>
  );
}

export default RushHourMode; 