import React, { useState } from 'react';
import Customers, { generateCustomerOrders } from './Customers';
import './App.css';

function App() {
  const [selectedCone, setSelectedCone] = useState(null);
  const [selectedScoops, setSelectedScoops] = useState([]);
  const [customerImages, setCustomerImages] = useState(
    Array.from({ length: 10 }, (_, i) => `customer${i + 1}.png`)
  );

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

  const handleConeClick = (cone) => {
    setSelectedCone(cone);
  };

  const handleScoopClick = (scoop) => {
    setSelectedScoops((prevScoops) => [...prevScoops, scoop]);
  };

  const handleRestart = () => {
    setSelectedCone(null);
    setSelectedScoops([]);
  };

  const removeCustomer = (customerIndex) => {
    const updatedCustomers = [...customerImages];
    updatedCustomers.splice(customerIndex, 1); // Remove the matched customer
    setCustomerImages(updatedCustomers);

    // Clear the assembled ice cream
    setSelectedCone(null);
    setSelectedScoops([]);
  };

  return (
    <div className="app-container">
      {/* Background Layer */}
      <img src="/assets/background.png" alt="Background" className="background" />

      {/* Customers Layer */}
      <Customers
        cones={cones}
        scoops={scoops}
        selectedCone={selectedCone}
        selectedScoops={selectedScoops}
        removeCustomer={removeCustomer}
        customerImages={customerImages}
        customerOrders={customerOrders}
        setCustomerOrders={setCustomerOrders}
      />

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