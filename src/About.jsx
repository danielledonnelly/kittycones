// This is the Kitty Cones about screen, which can be accessed by clicking the "About" button on the home screen.

import { Link } from "react-router-dom";
import { Button } from "@radix-ui/themes";

const About = () => {
  return (
    <div className="starting screen">
      <div className="screen end-screen about-screen">
        <h1 className="screen-title">About</h1>
        
        <p className="screen-text">
        You're the server at Kitty Cones, an ice cream shop that caters to catty customers. 
        Click ingredients to match customer orders as fast as you can, and click the customer to serve them. 
        If you mess up an order, throw it away and try again. 
        
        <p>Click the play icon to activate Rush Hour Mode and speed things up.</p></p>
      </div>
    </div>
  );
};

export default About;