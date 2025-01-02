import React, { useState, useEffect } from 'react';
import './App.css';

const generateCustomerOrders = (cones, scoops, customerImages) => {
  return customerImages.map(() => {
    const randomCone = cones[Math.floor(Math.random() * cones.length)];
    const scoopCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 scoops
    const randomScoops = Array.from({ length: scoopCount }, () =>
      scoops[Math.floor(Math.random() * scoops.length)]
    );
    return { cone: randomCone, scoops: randomScoops };
  });
};

function App() {
  const [selectedCone, setSelectedCone] = useState(null);
  const [selectedScoops, setSelectedScoops] = useState([]);
  const [customerImages, setCustomerImages] = useState(
    Array.from({ length: 10 }, (_, i) => `customer${i + 1}.png`)
  );
  const [coins, setCoins] = useState(0); // Coin counter
  const [time, setTime] = useState(60); // Timer countdown

  const cones = [
    'light-cone.png',
    'dark-cone.png',
    'light-cake-cone.png',
    'dark-cake-cone.png',
  ];

  const scoops = [
    'vanilla-scoop.png',
    'chocolate-scoop.png',
    'strawberry-scoop.png',
    'blueberry-scoop.png',
  ];

  const [customerOrders, setCustomerOrders] = useState(() =>
    generateCustomerOrders(cones, scoops, Array.from({ length: 10 }, (_, i) => `customer${i + 1}.png`))
  );

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0; // Stop at 0
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

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
  };

  const handleOrderClick = (customerOrder, customerIndex) => {
    if (!selectedCone || selectedScoops.length === 0) {
      alert('Your ice cream is incomplete!');
      return;
    }
  
    const isConeMatch = customerOrder.cone === selectedCone;
    const isScoopsMatch =
      customerOrder.scoops.length === selectedScoops.length &&
      customerOrder.scoops.every((scoop, index) => scoop === selectedScoops[index]);
  
    if (isConeMatch && isScoopsMatch) {
      // Increment coins
      setCoins((prevCoins) => prevCoins + 15);
  
      // Update the customer queue
      const updatedCustomers = [...customerImages.slice(1), `customer${Math.floor(Math.random() * 10) + 1}.png`];
      const updatedOrders = [
        ...customerOrders.slice(1),
        generateCustomerOrders(cones, scoops, [`customer${Math.floor(Math.random() * 10) + 1}.png`])[0],
      ];
  
      setCustomerImages(updatedCustomers);
      setCustomerOrders(updatedOrders);
  
      // Clear the assembled ice cream
      setSelectedCone(null);
      setSelectedScoops([]);
    } else {
      alert('Order does not match!');
    }
  };
  

  return (
    <div className="app-container">
      {/* Coin Counter */}
      <div
        className="coin-counter"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 9999,
          background: '#FFF0F0BF',
          color: '#000',
          border: '2px solid #241843',
          borderRadius: '10px',
          padding: '10px 20px',
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: '"Roboto", sans-serif',
        }}
      >
        Coins: {coins}
      </div>

      {/* Timer */}
      <div
        className="timer"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px', // Positioned at the top-right
          zIndex: 9999,
          background: '#FFF0F0BF',
          color: '#000',
          border: '2px solid #241843',
          borderRadius: '10px',
          padding: '10px 20px',
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: '"Roboto", sans-serif',
        }}
      >
        Time: {time}
      </div>

      {/* Background Layer */}
      <img src="/assets/background.png" alt="Background" className="background" />

      {/* Customers Layer */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-evenly',
          zIndex: 2,
        }}
      >
        {customerImages.slice(0, 3).map((customer, index) => (
          <div
            key={index}
            className="customer"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Ice Cream Order */}
            <div
              className="order"
              onClick={() => handleOrderClick(customerOrders[index], index)}
              style={{
                position: 'absolute',
                bottom: '105%',
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'center',
                width: '100px',
              }}
            >
              {/* Cone */}
              {customerOrders[index]?.cone && (
                <img
                  className="cone-order"
                  src={`/assets/${customerOrders[index].cone}`}
                  alt="Cone"
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    width: '100%',
                  }}
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
                    position: 'absolute',
                    bottom: `${100 + scoopIndex * 20}px`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '110%',
                  }}
                />
              ))}
            </div>

            {/* Customer Image */}
            <img
              src={`/assets/${customer}`}
              alt={`Customer ${index + 1}`}
              style={{
                width: '600px',
                height: 'auto',
              }}
            />
          </div>
        ))}
      </div>

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

        {/* Restart Button */}
        <div className="restart-button">
          <button onClick={handleRestart} className="button">
            <img src="/assets/restart.png" alt="Restart" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;