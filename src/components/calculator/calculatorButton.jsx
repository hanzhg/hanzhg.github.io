import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../styles.css";

class CalculatorButton extends Component {
    constructor() {
        super();

        this.state = {
            isPressed: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onClick(this.props.value);
        this.setState({ isPressed: true });

        setTimeout(() => {
            this.setState({ isPressed: false });
        }, 200);
    }

    render() {
        const { className, value } = this.props;
        const { isPressed } = this.state;

        const buttonClass = `calculator-button ${className} ${isPressed ? "pressed" : ""}`;

        return (
            <button
                className={buttonClass}
                onClick={this.handleClick}
            >
                {value}
            </button>
        );
    }
}

CalculatorButton.defaultProps = {
    className: "",
    value: "",
    onClick: null,
};

CalculatorButton.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onClick: PropTypes.func,
};

export default CalculatorButton;
