import React, { useState, useEffect, useRef } from "react";
import "../../styles.css";

const Stopwatch = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [lapTimes, setLapTimes] = useState([]);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const accumulatedTimeRef = useRef(0);

    const toggle = () => {
        setIsRunning(!isRunning);
    };

    const lap = () => {
        setLapTimes([...lapTimes, timeElapsed]);
    };

    const reset = () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setLapTimes([]);
        setTimeElapsed(0);
        accumulatedTimeRef.current = 0;
    };

    const startTimer = () => {
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(update, 10);
    };

    const update = () => {
        const delta = Date.now() - startTimeRef.current;
        setTimeElapsed(accumulatedTimeRef.current + delta);
    };

    useEffect(() => {
        if (isRunning) {
            startTimer();
        } else {
            clearInterval(timerRef.current);
            accumulatedTimeRef.current = timeElapsed;
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    return (
        <div>
            <TimeElapsed id="timer" timeElapsed={timeElapsed} />
            <div id="stopwatch-menu">
                <button className="controls" onClick={toggle}>
                    {isRunning ? "Stop" : "Start"}
                </button>
                <button
                    className="controls"
                    onClick={isRunning ? lap : reset}
                    disabled={!isRunning && !timeElapsed}
                >
                    {isRunning || !timeElapsed ? "Lap" : "Reset"}
                </button>
                <LapTimes lapTimes={lapTimes} />
            </div>
        </div>
    );
};

const TimeElapsed = ({ id, timeElapsed }) => {
    const getUnits = () => {
        const seconds = timeElapsed / 1000;
        return {
            min: Math.floor(seconds / 60).toString(),
            sec: Math.floor(seconds % 60).toString(),
            msec: (seconds % 1).toFixed(2).substring(2),
        };
    };

    const leftPad = (width, n) => {
        if ((n + "").length > width) {
            return n;
        }
        const padding = new Array(width).join("0");
        return (padding + n).slice(-width);
    };

    const units = getUnits();
    return (
        <div id={id}>
            <span>{leftPad(2, units.min)}</span>:
            <span>{leftPad(2, units.sec)}</span>.
            <span>{leftPad(2, units.msec)}</span>
        </div>
    );
};

const LapTimes = ({ lapTimes }) => {
    const rows = lapTimes.map((lapTime, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>
                <TimeElapsed timeElapsed={lapTime} />
            </td>
        </tr>
    ));
    return (
        <table id="lap-times">
            <thead>
                <tr>
                    <th width="50px">Lap</th>
                    <th width="80px">Time</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
};

export default Stopwatch;
