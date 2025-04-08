import { Link } from "react-router-dom";
import { Button } from "@radix-ui/themes";

const About = () => {
  return (
    <div className="starting screen">
      <div className="end screen end-screen">
        <h1 className="screen-title">About</h1>
        
        <p className="screen-text">
        Kitty Cones is a fast-paced game where you serve ice cream to hungry cats!
        Click the items on the counter to build and serve customer orders before the timer runs out. 
        The more scoops an order has, the more coins you earn.
        <p>This game was made by Dani Donnelly.</p></p>
      </div>
    </div>
  );
};

export default About;