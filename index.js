/* ======= SETUP ======= */

// Input variables
const billInput = document.querySelector('#bill-input');
const peopleInput = document.querySelector('#people-input');
const customPercentInput= document.querySelector('#custom-percent');
const inputArray = [billInput, peopleInput, customPercentInput];

const percentButtons = document.querySelectorAll('.percent-button');

// Output variables
const tipAmountText = document.querySelector('#tip-amount-answer').querySelector('h2');
const totalAmountText = document.querySelector('#total-amount-answer').querySelector('h2');
const finalAmountText = document.querySelector('#final-amount-answer').querySelector('h2');

// 'Private' variables
const billError = document.querySelector('#bill-input-error');
const peopleError = document.querySelector('#people-input-error');
let filledFields = [];
const requiredFields = 3;

let selectedTipButton = null;
let validBillInputs = /^[0-9.]+/;
let validPeopleInputs = /^[0-9]+/;

let billAmount = 0;
let peopleAmount = 0;
let tipPercent = 0;

// Core Functions
function on(eventType, selector, callback) {
    if (typeof(eventType) === 'string'){
        selector.addEventListener(eventType, function(event) {
            callback.call(event.target);
        });
    } else if (typeof(eventType) === 'object') {
        eventType.forEach(singleEventType => {
            selector.addEventListener(singleEventType, function(event) {
                callback.call(event.target);
            });
        });
    }
}

function unfocus(arg){
    if(arg.keyCode === 13){
        inputArray.forEach(element => {
            element.blur();
        })
    } 
}

/* ======= MAIN ======= */

// Event listeners
on('change', billInput, function() {
    // Check if bill input is empty, if so then return
    if (billInput.value === '') {
        if (filledFields.includes('bill')){
            filledFields.splice(filledFields.indexOf('bill'), 1);
        }
        return 'empty'
    }

    const currentValue = billInput.value;
    const valid = validBillInputs.exec(currentValue);
    const valid_ = (valid === null || valid === '')

    if (valid_ === false && valid.join('') === currentValue && Number(currentValue >= 0.01)) {
        // Hide error info and set billAmount to the textbox's input
        billError.hidden = true;
        billInput.style.removeProperty('border');
        billAmount = Number(currentValue);
        if (!filledFields.includes('bill')){
            filledFields.push('bill');
        }
    } else {
        // Show error info
        if (filledFields.includes('bill')){
            filledFields.splice(filledFields.indexOf('bill'), 1);
        }
        const inputError = getError(currentValue)
        billError.textContent = inputError;
        billError.removeAttribute('hidden');
        billInput.style.border = '2px solid rgb(255, 119, 119)';
    }
    calculateTip();
});

on('change', peopleInput, function() {
    // Check if people input is empty, if so then return
    if (peopleInput.value === '') {
        if (filledFields.includes('people')){
            filledFields.splice(filledFields.indexOf('people'), 1);
        }
        return 'empty';
    }

    const currentValue = peopleInput.value;
    const valid = validPeopleInputs.exec(currentValue);
    const valid_ = (valid === null || valid === '')

    if (valid_ === false && valid.join('') === currentValue && Number(currentValue >= 0.01)) {
        // Hide error info and set peopleAmount to the textbox's input
        peopleError.hidden = true;
        peopleInput.style.removeProperty('border');
        peopleAmount = Number(currentValue);
        if (!filledFields.includes('people')){
            filledFields.push('people');
        }
    } else {
        // Show error info
        if (filledFields.includes('people')){
            filledFields.splice(filledFields.indexOf('people'), 1);
        }
        const inputError = getError(currentValue, true)
        peopleError.textContent = inputError;
        peopleError.removeAttribute('hidden');
        peopleInput.style.border = '2px solid rgb(255, 119, 119)';
    }
    calculateTip();
});

on('change', customPercentInput, function() {
    // Check if people input is empty, if so then return
    if (customPercentInput.value === '') {
        customPercentInput.style.removeProperty('border');
        if (filledFields.includes('percent')){
            filledFields.splice(filledFields.indexOf('percent'), 1);
        }
        return 'empty';
    }

    const currentValue = customPercentInput.value;
    const valid = validPeopleInputs.exec(currentValue);
    const valid_ = (valid === null || valid === '')

    if (valid_ === false && valid.join('') === currentValue && Number(currentValue >= 0.01)) {
        // Hide error info and set peopleAmount to the textbox's input
        customPercentInput.style.border = '2px solid #26c0ab';
        tipPercent = Number(currentValue);
        if (!filledFields.includes('percent')){
            filledFields.push('percent');
        }
        if (selectedTipButton){
            selectedTipButton.style.removeProperty('background-color');
            selectedTipButton.style.removeProperty('color');
        }
    } else {
        // Show error info
        if (filledFields.includes('percent')){
            filledFields.splice(filledFields.indexOf('percent'), 1);
        }
        customPercentInput.style.border = '2px solid rgb(255, 119, 119)';
    }
    calculateTip();
});

inputArray.forEach(element => {
    element.addEventListener('keydown', unfocus);
});

percentButtons.forEach(element => {
    element.addEventListener('click', tipPressed)
})

// Logic functions
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
  

function calculateTip() {
    if (filledFields.length >= 1) {
        document.querySelector('#reset-button').removeAttribute('disabled');
    } 
    
    if (filledFields.length === requiredFields) {
        const tipPerPerson = (billAmount*(tipPercent/100)/peopleAmount)
        const totalAmount = billAmount/peopleAmount + tipPerPerson;
        tipAmountText.textContent = formatter.format(tipPerPerson);
        totalAmountText.textContent = formatter.format(totalAmount);
        finalAmountText.textContent = formatter.format(billAmount+(billAmount*(tipPercent/100)));
    }
}

function tipPressed() {
    if (selectedTipButton) {
        selectedTipButton.style.removeProperty('background-color');
        selectedTipButton.style.removeProperty('color');
        if (filledFields.includes('percent')){
            filledFields.splice(filledFields.indexOf('percent'), 1);
        }
        if (selectedTipButton === this) {
            selectedTipButton = null;
            return;
        }
    }

    const button = this;
    selectedTipButton = button;
    tipPercent = Number(this.id.split('-')[0]);
    button.style.backgroundColor = '#26c0ab';
    button.style.color = '#00494d';
    if (!filledFields.includes('percent')){
        filledFields.push('percent');
    }
    calculateTip();
}

function reset() {
    peopleAmount = 0;
    billAmount = 0;
    tipPercent = 0;
    peopleInput.value = '';
    billInput.value = '';
    customPercentInput.value = '';
    tipAmountText.textContent = '$0.00';
    totalAmountText.textContent = '$0.00';
    finalAmountText.textContent = '$0.00';
    filledFields = [];
    if (selectedTipButton) {
        selectedTipButton.style.removeProperty('background-color');
        selectedTipButton.style.removeProperty('color');
        selectedTipButton = null;
    };
    document.querySelector('#reset-button').disabled = true;
    customPercentInput.style.removeProperty('border');
}

function getError(num, whole) {
   if (num < 0.01) {
    return 'Must be larger than 0';
   }
   if (whole && !isNaN(num)) {
    return 'Must be a whole number';
   }
   return 'Must be a number';
}
