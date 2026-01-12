import React from 'react';
import '../../styles.css';

const CalculatorScreen = ({ value = '' }) => {
    return (
        <div className="calculator-header">
            <div className="calculator-brand">
                HI-25ZH
                <div className="calculator-subtext">Han Instruments</div>
            </div>

            <div className="calculator-screen">
                {value}
            </div>
        </div>
    );
};

export default React.memo(CalculatorScreen);
