import React from 'react';
import PropTypes from 'prop-types';
import '../../styles.css';

export default function CalculatorScreen({ value = '' }) {
    return (
        <div style={{
            gridColumnEnd: 'span 4'
        }}>
            <div style={{
                fontSize: '20px',
                textAlign: 'center'
            }}>
                HI-25ZH
                <div style={{fontSize:'16px', paddingTop: '5px'}}>Han Instruments</div>
            </div>
            <div className="calculator-screen">
                {value}
            </div>
        </div>
    );
}

CalculatorScreen.propTypes = {
    value: PropTypes.string,
};
