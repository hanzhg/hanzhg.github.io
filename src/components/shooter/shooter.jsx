import React, { useState, useEffect, useCallback, useRef } from 'react';
import "../../styles.css";

export default function Shooter() {
  const [button, setButton] = useState(null);
  const [started, setStarted] = useState(false);
  const [buttonCount, setButtonCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const buttonCountRef = useRef(0);

  const generateRandomButton = useCallback(() => {
    const leftPosition = Math.random() * 60 + 20;
    const topPosition = Math.random() * 40 + 30;

    const buttonStyle = {
      left: `${leftPosition}%`,
      top: `${topPosition}%`,
    };

    const randomButton = (
      <button
        className="random-button"
        style={buttonStyle}
        onClick={() => {
          buttonCountRef.current++;
          setButtonCount(buttonCountRef.current);
          if (buttonCountRef.current === 1) {
            setStartTime(Date.now());
          }
          if (buttonCountRef.current === 10) {
            setEndTime(Date.now());
          }
          generateRandomButton();
        }}
      >
      </button>
    );

    setButton(randomButton);
  }, []);

  const startGeneration = () => {
    generateRandomButton();
    setStarted(true);
  };

  const resetGame = () => {
    setButton(null);
    setStarted(false);
    setButtonCount(0);
    buttonCountRef.current = 0;
    setStartTime(null);
    setEndTime(null);
  };

  useEffect(() => {
    if (buttonCount === 10 && startTime && endTime) {
      const timeTaken = (endTime - startTime) / 1000;
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
        <p>Target Hit Count: {buttonCount}</p>
      </div>
    </div>
  );
}
