import React from 'react';

function App() {
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
      <img
        src="/assets/customers.png"
        alt="Customers"
        style={{
          position: 'absolute',
          width: '100vw',
          height: 'auto',
          top: 0,
          left: 0,
          zIndex: 2,
        }}
      />

      {/* Counter Layer */}
      <img
        src="/assets/counter.png"
        alt="Counter"
        style={{
          position: 'absolute',
          width: '100vw',
          height: 'auto',
          top: 0,
          left: 0,
          zIndex: 3,
        }}
      />
    </div>
  );
}

export default App;