import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../styles.css";

class CalculatorButton extends Component {
    constructor() {
        super();

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onClick(this.props.value);
    }

    render() {
        return (
            <button
                className={`calculator-button ${this.props.className}`}
                onClick={this.handleClick}
            >
                {this.props.value}
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
