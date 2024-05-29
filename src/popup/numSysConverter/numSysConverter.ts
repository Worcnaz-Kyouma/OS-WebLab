//Types
type numericSystems = 'hexadecimal' | 'binary' | 'decimal';

type inputsMapType = { 
    system: numericSystems, 
    input: HTMLInputElement,
    toDecimal: (value:string) => string,
    fromDecimal: (value:string) => string
}[];

//Global variables
let inputsMap: inputsMapType = [];

//Inits
function init() {
    prepareInputLogic();
    prepareClearBtnLogic();
}

function prepareInputLogic() {
    const hexadecimalInput = document.getElementById('hexadecimal-converter') as HTMLInputElement;
    const binaryInput = document.getElementById('binary-converter') as HTMLInputElement;
    const decimalInput = document.getElementById('decimal-converter') as HTMLInputElement;

    inputsMap = [
        { system: 'hexadecimal', input: hexadecimalInput,
            toDecimal: parseHexadecimalToDecimal,
            fromDecimal: parseDecimalToHexadecimal
        },
        { system: 'binary', input: binaryInput,
            toDecimal: parseBinaryToDecimal,
            fromDecimal: parseDecimalToBinary
         },
        { system: 'decimal', input: decimalInput,
            toDecimal: parseDecimalToDecimal,
            fromDecimal: parseDecimalToDecimal
         }
    ];

    inputsMap.forEach(inputMap => {
        inputMap.input.addEventListener('input', () => handleInputChange(inputMap.system, inputMap.input.value, inputMap.toDecimal));
    });
}

function prepareClearBtnLogic() {
    const clearBtn = document.getElementById('clear-converter-btn');
    clearBtn.addEventListener('click', handleInputsClear);
}

//Actions
function handleInputChange(system: numericSystems, inputValue: string, toDecimal: (value:string) => string) {
    if(inputValue === '') {
        handleInputsClear();
        return;
    }

    const filteredValue = filterInputValue(system, inputValue);

    const decimalInput = toDecimal(filteredValue);
    
    inputsMap.forEach(inputMap => {
        const inputElement = inputMap.input;

        if(inputMap.system !== system) {
            inputElement.readOnly = true;
        }

        const convertedValue = inputMap.fromDecimal(decimalInput);
        const formattedValue = formatInputValue(inputMap.system, convertedValue);
        inputElement.value = formattedValue;
    })
}

function handleInputsClear(event: MouseEvent = undefined) {
    inputsMap.forEach(inputMap => {
        const inputElement = inputMap.input;
        inputElement.value = '';
        inputElement.readOnly = false;
    })
}

//Logic
function filterInputValue(system: numericSystems, inputValue: string) {
    let filteredValue;
    switch(system) {
        case 'hexadecimal':
            filteredValue = filterHexadecimalValue(inputValue);
            break;
        case 'binary':
            filteredValue = filterBinaryValue(inputValue);
            break;
        case 'decimal':
            filteredValue = filterDecimalValue(inputValue);
            break;
    }

    return filteredValue;
}
function formatInputValue(system: numericSystems, inputValue: string) {
    let formattedValue;
    switch(system) {
        case 'hexadecimal':
            formattedValue = formatHexadecimalValue(inputValue);
            break;
        case 'binary':
            formattedValue = formatBinaryValue(inputValue);
            break;
        case 'decimal':
            formattedValue = formatDecimalValue(inputValue);
            break;
    }

    return formattedValue;
}

function filterHexadecimalValue(inputValue: string) {
    const filteredValue = inputValue
                                    .replace('/[^0-9A-Fa-f]/g', '');
    return filteredValue;
}
function formatHexadecimalValue(inputValue: string) {
    const formattedValue = inputValue
                                    .toUpperCase()
                                    .replace(/(.{2})/g, '$1 ')
                                    .trim();
    return formattedValue;
}
function parseHexadecimalToDecimal(hexadecimal: string) {
    const decimal = parseInt(hexadecimal, 16).toString();
    return decimal;
}
function parseDecimalToHexadecimal(decimal: string) {
    const hexadecimal = Number(decimal).toString(16);
    return hexadecimal;
}

function filterBinaryValue(inputValue: string) {
    const filteredValue = inputValue
                                    .replace('[^01]/g', '');
    return filteredValue;
}
function formatBinaryValue(inputValue: string) {
    const formattedValue = inputValue
                                    .replace(/(.{4})/g, '$1 ')
                                    .trim();
    return formattedValue;
}
function parseBinaryToDecimal(binary: string) {
    const decimal = parseInt(binary, 2).toString();
    return decimal;
}
function parseDecimalToBinary(decimal: string) {
    const binary = Number(decimal).toString(2);
    return binary;
}

function filterDecimalValue(inputValue: string) {
    const filteredValue = inputValue
                                    .replace('[^0-9]/g', '');
    return filteredValue;
}
function formatDecimalValue(inputValue: string) {
    const formattedValue = inputValue;
    return formattedValue;
}
function parseDecimalToDecimal(decimal: string) {
    return decimal;
}

init();