import React, { Component } from "react";
import "../../styles.css";

export default class Stopwatch extends Component {
    constructor(props) {
        super(props);

        ["lap", "update", "reset", "toggle"].forEach((method) => {
            this[method] = this[method].bind(this);
        });

        this.state = this.initialState = {
            isRunning: false,
            lapTimes: [],
            timeElapsed: 0,
        };
    }
    toggle() {
        this.setState({ isRunning: !this.state.isRunning }, () => {
            this.state.isRunning
                ? this.startTimer()
                : clearInterval(this.timer);
        });
    }
    lap() {
        const { lapTimes, timeElapsed } = this.state;
        this.setState({ lapTimes: lapTimes.concat(timeElapsed) });
    }
    reset() {
        clearInterval(this.timer);
        this.setState(this.initialState);
    }
    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(this.update, 10);
    }
    update() {
        const delta = Date.now() - this.startTime;
        this.setState({ timeElapsed: this.state.timeElapsed + delta });
        this.startTime = Date.now();
    }
    render() {
        const { isRunning, lapTimes, timeElapsed } = this.state;
        return (
            <div>
                <TimeElapsed id="timer" timeElapsed={timeElapsed} />
                <div id="stopwatch-menu">
                    <button className="controls" onClick={this.toggle}>
                        {isRunning ? "Stop" : "Start"}
                    </button>
                    <button
                        className="controls"
                        onClick={isRunning ? this.lap : this.reset}
                        disabled={!isRunning && !timeElapsed}
                    >
                        {isRunning || !timeElapsed ? "Lap" : "Reset"}
                    </button>
                    <LapTimes lapTimes={lapTimes} />
                </div>
            </div>
        );
    }
}
const TimeElapsed = (props) => {
    const getUnits = () => {
        const seconds = props.timeElapsed / 1000;
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
        <div id={props.id}>
            <span>{leftPad(2, units.min)}</span>:
            <span>{leftPad(2, units.sec)}</span>.
            <span>{leftPad(2, units.msec)}</span>
        </div>
    );
};

const LapTimes = (props) => {
    const rows = props.lapTimes.map((lapTime, index) => (
        <tr key={++index}>
            <td>{index}</td>
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
