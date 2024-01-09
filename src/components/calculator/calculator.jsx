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
    constructor() {
        super();
        [
            "number",
            "clearAll",
            "clearEntry",
            "operation",
            "percentage",
            "equal",
            "backspace",
        ].forEach((method) => {
            this[method] = this[method].bind(this);
        });

        this.state = {
            entry: "0",
        };
    }

    number(num) {
        this.setState(number.bind(null, num));
    }

    clearAll() {
        this.setState(clearAll);
    }

    clearEntry(number) {
        this.setState(clearEntry.bind(null, number));
    }

    operation(op) {
        this.setState(operation.bind(null, op));
    }

    percentage() {
        this.setState(percentage);
    }

    equal() {
        this.setState(equal);
    }

    backspace(number) {
        this.setState(backspace.bind(number));
    }

    render() {
        return (
            <div className="calculator">
                <div className="calculator-container">
                    <CalculatorScreen value={this.state.entry} />
                    <Button value="AC" onClick={this.clearAll} />
                    <Button value="CE" onClick={this.clearEntry} />
                    <Button value="%" onClick={this.percentage} />
                    <Button value="/" onClick={this.operation} />
                    <Button value="7" onClick={this.number} />
                    <Button value="8" onClick={this.number} />
                    <Button value="9" onClick={this.number} />
                    <Button value="x" onClick={this.operation} />
                    <Button value="4" onClick={this.number} />
                    <Button value="5" onClick={this.number} />
                    <Button value="6" onClick={this.number} />
                    <Button value="-" onClick={this.operation} />
                    <Button value="1" onClick={this.number} />
                    <Button value="2" onClick={this.number} />
                    <Button value="3" onClick={this.number} />
                    <Button value="+" onClick={this.operation} />
                    <Button value="0" onClick={this.number} />
                    <Button value="." onClick={this.number} />
                    <Button value="DEL" onClick={this.backspace} />
                    <Button value="=" onClick={this.equal} />
                </div>
            </div>
        );
    }
}

export default Calculator;
