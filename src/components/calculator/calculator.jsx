import React, { Component } from "react";
import CalculatorScreen from "./calculatorScreen";
import Button from "./calculatorButton";
import {
    number,
    clearAll,
    clearEntry,
    operation,
    percentage,
    equal,
    backspace,
} from "./calculatorActions";
import "../../styles.css";

class Calculator extends Component {
    state = {
        entry: "0",
    };

    number = (num) => {
        this.setState(number.bind(null, num));
    };

    clearAll = () => {
        this.setState(clearAll);
    };

    clearEntry = (number) => {
        this.setState(clearEntry.bind(null, number));
    };

    operation = (op) => {
        this.setState(operation.bind(null, op));
    };

    percentage = () => {
        this.setState(percentage);
    };

    equal = () => {
        this.setState(equal);
    };

    backspace = (number) => {
        this.setState(backspace.bind(number));
    };

    renderButton(value, onClick) {
        return <Button value={value} onClick={onClick} />;
    }

    render() {
        return (
            <div className="calculator">
                <div className="calculator-container">
                    <CalculatorScreen value={this.state.entry} />
                    {this.renderButton("AC", this.clearAll)}
                    {this.renderButton("CE", this.clearEntry)}
                    {this.renderButton("%", this.percentage)}
                    {this.renderButton("/", this.operation)}
                    {this.renderButton("7", this.number)}
                    {this.renderButton("8", this.number)}
                    {this.renderButton("9", this.number)}
                    {this.renderButton("x", this.operation)}
                    {this.renderButton("4", this.number)}
                    {this.renderButton("5", this.number)}
                    {this.renderButton("6", this.number)}
                    {this.renderButton("-", this.operation)}
                    {this.renderButton("1", this.number)}
                    {this.renderButton("2", this.number)}
                    {this.renderButton("3", this.number)}
                    {this.renderButton("+", this.operation)}
                    {this.renderButton("0", this.number)}
                    {this.renderButton(".", this.number)}
                    {this.renderButton("DEL", this.backspace)}
                    {this.renderButton("=", this.equal)}
                </div>
            </div>
        );
    }
}

export default Calculator;
