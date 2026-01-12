import React, { useState, useCallback } from "react";
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

const Calculator = () => {
    const [state, setState] = useState({
        entry: "0",
        memory: "0",
        operation: null
    });

    const handleNumber = useCallback((num) => {
        setState(prevState => number(num, prevState));
    }, []);

    const handleClearAll = useCallback(() => {
        setState(clearAll());
    }, []);

    const handleClearEntry = useCallback(() => {
        setState(prevState => clearEntry(prevState));
    }, []);

    const handleOperation = useCallback((op) => {
        setState(prevState => operation(op, prevState));
    }, []);

    const handlePercentage = useCallback(() => {
        setState(prevState => percentage(prevState));
    }, []);

    const handleEqual = useCallback(() => {
        setState(prevState => equal(prevState));
    }, []);

    const handleBackspace = useCallback(() => {
        setState(prevState => backspace(prevState));
    }, []);

    const renderButton = useCallback((value, onClick) => {
        return <Button value={value} onClick={onClick} />;
    }, []);

    return (
        <div className="centered">
            <div className="calculator">
                <div className="calculator-container">
                    <CalculatorScreen value={state.entry} />
                    {renderButton("AC", handleClearAll)}
                    {renderButton("CE", handleClearEntry)}
                    {renderButton("%", handlePercentage)}
                    {renderButton("/", handleOperation)}
                    {renderButton("7", handleNumber)}
                    {renderButton("8", handleNumber)}
                    {renderButton("9", handleNumber)}
                    {renderButton("x", handleOperation)}
                    {renderButton("4", handleNumber)}
                    {renderButton("5", handleNumber)}
                    {renderButton("6", handleNumber)}
                    {renderButton("-", handleOperation)}
                    {renderButton("1", handleNumber)}
                    {renderButton("2", handleNumber)}
                    {renderButton("3", handleNumber)}
                    {renderButton("+", handleOperation)}
                    {renderButton("0", handleNumber)}
                    {renderButton(".", handleNumber)}
                    {renderButton("DEL", handleBackspace)}
                    {renderButton("=", handleEqual)}
                </div>
            </div>
        </div>
    );
};

export default React.memo(Calculator);
