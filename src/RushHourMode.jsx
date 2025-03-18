import React, { useEffect } from 'react';

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

  return (
    rushHourCats.map((cat, index) => (
      cat && cat.image && (
        <div
          key={cat.id}
          className="customer"
          style={{
            position: 'absolute',
            left: `${rushHourPositions[index]}px`,
            bottom: '0',
            width: '220px',
            zIndex: Math.floor(rushHourPositions[index])
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
        </div>
      )
    ))
  );
}

export default RushHourMode; 