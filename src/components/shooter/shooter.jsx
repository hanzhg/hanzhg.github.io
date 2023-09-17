import React, { useState, useEffect } from 'react';
import "../../styles.css";

export default function Shooter() {
    const [button, setButton] = useState(null);
    const [started, setStarted] = useState(false);
    var [buttonCount, setButtonCount] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
  
    // Function to generate a random button with positions
    const generateRandomButton = () => {
      const leftPosition = Math.random() * 60 + 20; // Random left position within the square
      const topPosition = Math.random() * 40 + 30; // Random top position within the square
  
      const buttonStyle = {
        left: `${leftPosition}%`,
        top: `${topPosition}%`,
      };
  
      const randomButton = (
        <button
          className="random-button"
          style={buttonStyle}
          onClick={() => {
            buttonCount ++;
            setButtonCount(buttonCount); // Increment the button count
            if (buttonCount === 1) {
              setStartTime(Date.now()); // Record the start time when the count reaches 1
            }
            if (buttonCount === 10) {
              setEndTime(Date.now()); // Record the end time when the count reaches 10
            }
            generateRandomButton(); // Generate a new random button
          }}
        >
        </button>
      );
  
      setButton(randomButton);
    };
  
    // Function to start the generation of buttons
    const startGeneration = () => {
      generateRandomButton();
      setStarted(true);
    };
  
    const resetGame = () => {
        setButton(null);
        setStarted(false);
        setButtonCount(0);
        setStartTime(null);
        setEndTime(null);
    };

    // Calculate the time taken when the button count reaches 10
    useEffect(() => {
      if (buttonCount === 10 && startTime && endTime) {
        const timeTaken = (endTime - startTime) / 1000; // Convert to seconds
        alert(`Time taken to reach 10 buttons: ${timeTaken} seconds`);
      }
    }, [buttonCount, startTime, endTime]);
  
    return (
      <div>
          {started && button}
          <div id="buttons">
                <button className="controls" onClick={startGeneration}>
                Start
                </button>
                <button className="controls" onClick={resetGame}>
                Reset
                </button>
              <p>Button Count: {buttonCount}</p>
          </div>
      </div>
    );
  }