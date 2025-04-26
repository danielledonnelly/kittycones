// This is the component used to enter the player's initials after they have earned a new high score.

import { useState, useEffect, useRef } from "react";

const InitialsModal = ({ score, onSave, onCancel }) => {
  const [initials, setInitials] = useState(["", "", ""]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    // Focus the first input when component mounts
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value.toUpperCase();
    if (value.length > 0 && /[A-Z]/.test(value)) {
      const newInitials = [...initials];
      newInitials[index] = value.charAt(0);
      setInitials(newInitials);
      
      // Auto-advance to next input
      if (index < 2) {
        setCurrentIndex(index + 1);
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (initials[index] !== "") {
        // Clear current input if it has a value
        const newInitials = [...initials];
        newInitials[index] = "";
        setInitials(newInitials);
        e.preventDefault(); // Prevent default backspace behavior
      } else if (index > 0) {
        // Move to previous input when backspace is pressed on empty input
        setCurrentIndex(index - 1);
        inputRefs[index - 1].current.focus();
      }
    } else if (e.key === "Enter" && initials.every(initial => initial !== "")) {
      // Submit when Enter is pressed and all initials are filled
      handleSave();
    }
  };

  const handleSave = () => {
    console.log("Save button clicked");
    console.log("Current initials:", initials);
    if (initials.every(initial => initial !== "")) {
      console.log("Saving initials:", initials.join(""));
      onSave(initials.join(""));
    } else {
      console.log("Cannot save: initials not complete");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="initials-modal">
        <h2>New High Score!</h2>
        <p>Your score: {score} points</p>
        <p>Enter your initials:</p>
        
        <div className="initials-input-container">
          {initials.map((initial, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength="1"
              value={initial}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="initial-input"
            />
          ))}
        </div>
        
        <div className="modal-buttons">
          <button 
            className="screen-button"
            onClick={handleSave}
            disabled={initials.some(initial => initial === "")}
          >
            Save
          </button>
          <button className="screen-button secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialsModal; 