import React from 'react';
import PropTypes from 'prop-types';
import '../../styles.css';

export default function CalculatorScreen(props) {
    return (
        <div style={{
            "gridColumnEnd": 'span 4',
            'fontSize': '15px',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            Han Instruments HI-25 XS
            </div>
            <div className="calculator-screen">
                {props.value}
            </div>
        </div>
    );
}

CalculatorScreen.defaultProps = {
    value: '',
};

CalculatorScreen.propTypes = {
    value: PropTypes.string,
};
