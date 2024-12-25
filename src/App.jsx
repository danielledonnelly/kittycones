import React, { useState } from 'react';
import Customers from './Customers';

function App() {
  const [selectedCone, setSelectedCone] = useState(null);
  const [selectedScoops, setSelectedScoops] = useState([]);

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

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Background Layer */}
      <img
        src="/assets/background.png"
        alt="Background"
        style={{
          position: 'absolute',
          width: '100vw',
          height: 'auto',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

       {/* Customers Layer */}
       <Customers cones={cones} scoops={scoops} />
      {/* Counter */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          maxHeight: '25vh',
          backgroundColor: '#9F86C0',
          bottom: 0,
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 40px 30px',
          boxSizing: 'border-box',
        }}
      >
        {/* Assembled Ice Cream */}
        <div
          style={{
            flex: '0 0 auto',
            width: '220px',
            height: '220px',
            position: 'relative',
          }}
        >
          {selectedCone && (
            <img
              src={`/assets/${selectedCone}`}
              alt="Selected Cone"
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
              }}
            />
          )}
          {selectedScoops.map((scoop, index) => (
            <img
              key={index}
              src={`/assets/${scoop}`}
              alt={`Scoop ${index + 1}`}
              style={{
                position: 'absolute',
                bottom: `${210 + index * 50}px`, 
                left: '50%',
                transform: 'translateX(-50%)',
                width: '110%',
              }}
            />
          ))}
        </div>

        {/* Buttons for Cones */}
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
          }}
        >
          {cones.map((cone) => (
            <button
              key={cone}
              onClick={() => handleConeClick(cone)}
              style={{
                background: 'none',
                padding: '10px',
                cursor: 'pointer',
                width: '120px',
                height: '120px',
                border: 'none',
                outline: 'none', // Remove the outline
              }}
            >
              <img
                src={`/assets/${cone}`}
                alt={cone}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </button>
          ))}
        </div>

        {/* Buttons for Scoops */}
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
          }}
        >
          {scoops.map((scoop) => (
            <button
              key={scoop}
              onClick={() => handleScoopClick(scoop)}
              style={{
                background: 'none',
                padding: '10px',
                cursor: 'pointer',
                width: '120px',
                height: '120px',
                border: 'none',
                outline: 'none', 
              }}
            >
              <img
                src={`/assets/${scoop}`}
                alt={scoop}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </button>
          ))}
        </div>

        {/* Restart Button */}
        <div
          style={{
            flex: '0 0 auto',
            width: '120px',
            height: '120px',
          }}
        >
          <button
            onClick={handleRestart}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              width: '100%',
              height: '100%',
            }}
          >
            <img
              src="/assets/restart.png"
              alt="Restart"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;