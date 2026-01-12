import React, { useState, useCallback } from "react";
import "../../styles.css";

const CalculatorButton = ({ className = "", value = "0", onClick }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = useCallback(() => {
        onClick(value);
        setIsPressed(true);

        const timer = setTimeout(() => {
            setIsPressed(false);
        }, 200);

        return () => clearTimeout(timer);
    }, [onClick, value]);

    const getButtonType = () => {
        if (["+", "-", "x", "/", "."].includes(value)) return "operator";
        if (["AC", "CE", "%"].includes(value)) return "function";
        if (value === "=") return "equal";
        if (value === "DEL") return "delete";
        if (!isNaN(value)) return "number";
        return "";
    };

    const buttonClass = `calculator-button ${getButtonType()} ${className} ${isPressed ? "pressed" : ""}`;

    return (
        <button className={buttonClass} onClick={handleClick}>
            {value}
        </button>
    );
};

export default React.memo(CalculatorButton);
