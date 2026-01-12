export function number(number, prevState) {
    const { entry, memory, operation } = prevState;
    let newEntry;

    if (number === ".") {
        if (entry.includes(".")) {
            return prevState;
        }
        newEntry = entry + number;
    } else if (operation == null || entry !== memory) {
        newEntry = String(parseFloat(entry + number));
    } else {
        newEntry = number;
    }

    return { 
        ...prevState,
        entry: newEntry 
    };
}

export function clearAll() {
    return {
        entry: "0",
        memory: "0",
        operation: null,
    };
}

export function clearEntry(prevState) {
    return { 
        ...prevState,
        entry: "0" 
    };
}

export function operation(operation, prevState) {
    if (prevState.operation !== null && prevState.memory !== "0") {
        const result = calculate(prevState);
        return {
            entry: result,
            memory: result,
            operation,
        };
    }
    
    return {
        ...prevState,
        memory: prevState.entry,
        operation,
    };
}

export function percentage(prevState) {
    if (prevState.operation !== null && prevState.memory !== "0") {
        const baseValue = calculate(prevState);
        const result = String(parseFloat(baseValue) / 100);
        return {
            entry: result,
            memory: result,
            operation: null,
        };
    }
    
    const result = String(parseFloat(prevState.entry) / 100);
    return {
        ...prevState,
        entry: result,
        memory: result,
        operation: null,
    };
}

function calculate(prevState) {
    const firstNumber = parseFloat(prevState.memory);
    const secondNumber = parseFloat(prevState.entry);

    switch (prevState.operation) {
        case "+":
            return String(firstNumber + secondNumber);
        case "-":
            return String(firstNumber - secondNumber);
        case "x":
            return String(firstNumber * secondNumber);
        case "/":
            return String(firstNumber / secondNumber);
        default:
            return String(secondNumber);
    }
}

export function equal(prevState) {
    const result = calculate(prevState);
    return {
        entry: result,
        memory: result,
        operation: null,
    };
}

export function backspace(prevState) {
    const result = prevState.entry.slice(0, -1);
    return {
        ...prevState,
        entry: result === "" ? "0" : result
    };
}
