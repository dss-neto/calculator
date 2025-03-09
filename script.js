const display = document.getElementById("display");
const numberDiv = document.getElementById("numbers");
const operatorsDiv = document.getElementById("operators");

let result = 0;
let firstNumber = [];
let secondNumber = [];
let currentOperating = firstNumber;
// if true, the number will show after triggering result with
// operator
let showNext = false;
let operator;

numberDiv.addEventListener("click", (e) => workWithNumbers(e));

operatorsDiv.addEventListener("click", (e) => workWithOperators(e));

function workWithOperators(e) {
  target = e.target;
  if (target.tagName === "BUTTON") {
    if (target.id === "=") {
      result = firstNumber;
      if (operator === "-" && firstNumber.length === 0) {
        firstNumber.splice(
          0,
          0,
          operate(operator, 0, parseFloat(secondNumber.join("")))
        );
        secondNumber.splice(0, secondNumber.length);
        display.textContent = firstNumber;
        currentOperating = secondNumber;
        operator = null;
      } else if (operator) {
        firstNumber.splice(
          0,
          firstNumber.length,
          operate(
            operator,
            parseFloat(firstNumber.join("")),
            parseFloat(secondNumber.join(""))
          )
        );
        if (firstNumber[0] === "no way") {
          secondNumber = [];
          showNext = true;
        }
        display.textContent = firstNumber;
        currentOperating = secondNumber;
        operator = null;
      }
    } else if (target.id === "AC") {
      firstNumber = [];
      secondNumber = [];
      operator = null;
      showNext = false;
      result = 0;
      display.textContent = "";
      currentOperating = firstNumber;
    } else if (operator) {
      result = 0;
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
        currentOperating = secondNumber;
        operator = target.id;
        showNext = true;
      }
    } else if (target.id === "-" && !firstNumber) {
      result = 0;
      operator = target.id;
    } else {
      result = 0;
      showNext = true;
      operator = target.id;
      secondNumber.splice(0, secondNumber.length);
      currentOperating = secondNumber;
    }
  }
}

function workWithNumbers(e) {
  target = e.target;
  if (
    target.id !== "." ||
    (display.textContent && !currentOperating.includes("."))
  ) {
    if (target.tagName === "BUTTON") {
      if (result) {
        firstNumber = [];
        secondNumber = [];
        operator = null;
        showNext = false;
        result = 0;
        display.textContent = "";
        currentOperating = firstNumber;
      }
      if (display.textContent === operator) {
        display.textContent = "";
        showNext = false;
      }
      if (!showNext) {
        display.textContent += target.textContent;
        currentOperating.push(target.textContent);
      } else {
        currentOperating.push(target.textContent);
        display.textContent = secondNumber;
        showNext = false;
      }
    }
  }
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
