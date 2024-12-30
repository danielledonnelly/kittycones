import React, { useMemo } from 'react';

// Generate customer orders (only once)
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

function Customers({ cones, scoops, selectedCone, selectedScoops }) {
  const customerImages = [
    'customer1.png',
    'customer2.png',
    'customer3.png',
  ];

  const customerOrders = useMemo(() => generateCustomerOrders(cones, scoops, customerImages), []);

  const handleOrderClick = (customerOrder, customerIndex) => {
    if (!selectedCone || selectedScoops.length === 0) {
      alert('Your ice cream is incomplete!');
      return;
    }

    // Updated cone matching logic
    const isConeMatch = customerOrder.cone === selectedCone;

    // Scoops matching logic
    const isScoopsMatch =
      customerOrder.scoops.length === selectedScoops.length &&
      customerOrder.scoops.every((scoop, index) => scoop === selectedScoops[index]);

    if (isConeMatch && isScoopsMatch) {
      alert(`Order matched for customer ${customerIndex + 1}!`);
      // Logic to remove customer or update state can go here
    } else {
      alert('Order does not match!');
    }
  };
  

  return (
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
      {customerImages.map((customer, index) => (
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
  );
}

export default Customers;