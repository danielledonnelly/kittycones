import React from 'react';
import { motion } from "framer-motion";

function RushHourMode({ 
  rushHourCats, 
  rushHourPositions, 
  customerOrders, 
  handleOrderClick 
}) {
  return (
    <>
      {rushHourCats.map((cat, index) => (
        cat && cat.image && !cat.served && (
          <motion.div
            key={cat.id}
            className="customer"
            animate={{
              left: `${rushHourPositions[index]}px`,
              opacity: 1
            }}
            transition={{ 
              type: "tween",
              duration: 0.1,
              ease: "linear"
            }}
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
    </>
  );
}

export default RushHourMode; 