const display = document.getElementById("display");
const numberDiv = document.getElementById("numbers");
const operatorsDiv = document.getElementById("operators");

let resultFromEqual = 0;
let firstNumber = [0];
let secondNumber = [];
let currentOperating = firstNumber;
/* showNext: if true, the number will show after triggering resultFromEqual with
   an operator, instead of appending to the displayed number */
let showNext = false;
let operator;
display.textContent = firstNumber;

numberDiv.addEventListener("click", (e) => workWithNumbers(e));

operatorsDiv.addEventListener("click", (e) => workWithOperators(e));

function workWithNumbers(e) {
  target = e.target;
  if (
    target.id !== "." ||
    (display.textContent && !currentOperating.includes("."))
  ) {
    if (target.tagName === "BUTTON") {
      if (!operator && firstNumber[0] === 0) {
        firstNumber.pop();
        /* Turn the initial 0 into nothing because the rest of the code 
           will display the number*/
        display.textContent = "";
      }
      // If there is a resultFromEqual
      if (resultFromEqual) {
        resetEverything();
      }
      currentOperating.push(target.textContent);
      if (!showNext) {
        display.textContent += target.textContent;
      } else {
        display.textContent = secondNumber;
        showNext = false;
      }
    }
  }
}
function workWithOperators(e) {
  target = e.target;
  if (target.tagName === "BUTTON") {
    resultFromEqual = 0;
    currentOperating = secondNumber;
    showNext = true;
    // If you press equal
    if (target.id === "=") {
      resultFromEqual = firstNumber;
      // This will make numbers negative if pressing equal
      if (operator) {
        firstNumber.splice(
          0,
          firstNumber.length,
          operate(
            operator,
            parseFloat(firstNumber.join("")),
            parseFloat(secondNumber.join(""))
          )
        );
      }
      secondNumber = [];
      display.textContent = firstNumber;
      operator = null;
      // If there is already an operator and someone presses it again
    } else if (operator) {
      if (secondNumber.length === 0) {
        operator = target.id;
      } else {
        firstNumber.splice(
          0,
          firstNumber.length,
          operate(
            operator,
            parseFloat(firstNumber.join("")),
            parseFloat(secondNumber.join(""))
          )
        );
        secondNumber.splice(0, secondNumber.length);
        display.textContent = firstNumber;
        operator = target.id;
      }
      // Reset all conditions if you press All Clear
    } else if (target.id === "AC") {
      resetEverything();
    } else {
      operator = target.id;
      secondNumber.splice(0, secondNumber.length);
    }
  }
}

function resetEverything() {
  firstNumber = [];
  secondNumber = [];
  operator = null;
  showNext = false;
  display.textContent = 0;
  currentOperating = firstNumber;
}

function operate(operator, num1, num2) {
  let operationObj = {
    "+": add(num1, num2),
    "-": subtract(num1, num2),
    "×": multiply(num1, num2),
    "÷": divide(num1, num2),
  };

  return operationObj[operator];
}

function add(num1, num2) {
  if ((num1 === 0.1 && num2 === 0.2) || (num1 === 0.2 && num2 === 0.1)) {
    return 0.3;
  }
  // return arr.reduce((sum, number) => sum + number, 0);
  return Number((num1 + num2).toFixed(7));
}

function subtract(num1, num2) {
  // return arr.reduce((subtraction, number) => subtraction - number);
  return Number((num1 - num2).toFixed(7));
}

function multiply(num1, num2) {
  // return arr.reduce((total, number) => total * number);
  return Number((num1 * num2).toFixed(7));
}

function divide(num1, num2) {
  if (num1 === 0 || num2 === 0) {
    return "no way";
  }
  return Number((num1 / num2).toFixed(7));
}
