const display = document.getElementById("display");
const numberDiv = document.getElementById("numbers");
const operatorsDiv = document.getElementById("operators");

const NUMBERS_LIST = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
const OPERATORS_LIST = ["=", "+", "-", "*", "/"];
const keyboardObj = {
  Backspace: function () {
    document.getElementById("Backspace").classList.add("dim");
    backspaceFunctionality();
  },
  Enter: function () {
    document.getElementById("=").classList.add("dim");
    workWithOperators("=");
  },
  Escape: function () {
    document.getElementById("Escape").classList.add("dim");
    resetEverything();
  },
};

let resultFromEqual = 0;
let firstNumber = ["0"];
let secondNumber = [];
let currentOperating = firstNumber;
/* showNext: if true, the number will show after triggering
  resultFromEqual with an operator, instead of appending to the displayed number */
let showNext = false;
let operator;
display.textContent = firstNumber;

document.addEventListener("keydown", (logKey) => {
  if (
    logKey.key !== "Enter" &&
    logKey.key !== "Backspace" &&
    logKey.key !== "Escape"
  ) {
    if (NUMBERS_LIST.includes(logKey.key)) {
      document.getElementById(logKey.key).classList.add("dim");
      workWithNumbers(logKey.key, "BUTTON");
    } else if (OPERATORS_LIST.includes(logKey.key)) {
      document.getElementById(logKey.key).classList.add("dim");
      workWithOperators(logKey.key);
    }
  } else {
    keyboardObj[logKey.key]();
  }
});

document.addEventListener("keyup", (logKey) => unDimButton(logKey.key));

numberDiv.addEventListener("click", (e) =>
  workWithNumbers(e.target.id, e.target.tagName)
);

operatorsDiv.addEventListener("click", (e) => workWithOperators(e.target.id));

function unDimButton(key) {
  if (key !== "Enter") {
    document.getElementById(key).classList.remove("dim");
  } else if (key === "Enter") {
    document.getElementById("=").classList.remove("dim");
  }
}

function workWithNumbers(targetId, targetElement) {
  const isDotButton = () => targetId === ".";
  const hasDecimalPoint = () => currentOperating.includes(".");
  const isButtonElement = () => targetElement === "BUTTON";
  const isWithinDigitLimit = () => currentOperating.length < 10;
  const isZeroTheFirstNumber = () => currentOperating[0] === "0";
  const hasOneDigit = () => currentOperating.length === 1;
  const isZeroButton = () => targetId === "0";

  if (
    isWithinDigitLimit() &&
    (!isDotButton() || (!hasDecimalPoint() && isButtonElement()))
  ) {
    if (resultFromEqual) {
      resetEverything();
    }
    if (hasOneDigit() && isZeroTheFirstNumber()) {
      currentOperating.pop();
      /* Turn the initial 0 into nothing because the rest of the code 
         will display the number*/
      display.textContent = "";
    }
    if (!(isZeroButton() && hasOneDigit() && isZeroTheFirstNumber())) {
      currentOperating.push(targetId);
      if (!showNext) {
        display.textContent += targetId;
      } else {
        display.textContent = secondNumber;
        showNext = false;
      }
    }
  }
}
function workWithOperators(targetId) {
  if (targetId !== "Backspace" && (targetId !== "=" || operator)) {
    resultFromEqual = 0;
    currentOperating = secondNumber;
    showNext = true;
  }
  if (targetId === "Escape") {
    resetEverything();
  } else if (targetId === "Backspace") {
    backspaceFunctionality();
  } else if (targetId === "=") {
    equalsFunctionality();
  } else {
    operatorFunctionality(targetId);
  }
}

function operatorFunctionality(targetId) {
  const isOperatingNumberEmpty = () => secondNumber.length === 0;
  const isResultBeyondLimit = () =>
    firstNumber > 9999999999 || firstNumber < -999999999;

  if (operator) {
    if (isOperatingNumberEmpty()) {
      operator = targetId;
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
      if (isResultBeyondLimit()) {
        display.textContent = Number.parseFloat(firstNumber).toExponential(2);
      } else display.textContent = firstNumber;
      operator = targetId;
    }
  } else {
    operator = targetId;
    secondNumber.splice(0, secondNumber.length);
  }
}

function equalsFunctionality() {
  const isOperatingNumberEmpty = () => secondNumber.length === 0;
  const isResultBeyondLimit = () =>
    firstNumber > 9999999999 || firstNumber < -999999999;

  if (!isOperatingNumberEmpty()) {
    if (operator) {
      resultFromEqual = firstNumber;
      firstNumber.splice(
        0,
        firstNumber.length,
        operate(
          operator,
          parseFloat(firstNumber.join("")),
          parseFloat(secondNumber.join(""))
        )
      );
      secondNumber = [];
      if (isResultBeyondLimit()) {
        display.textContent = Number.parseFloat(firstNumber).toExponential(2);
      } else display.textContent = firstNumber;
      operator = null;
    } else {
      currentOperating = firstNumber;
      showNext = false;
    }
  }
}

function backspaceFunctionality() {
  const isOperatingNumberEmpty = () => currentOperating.length === 0;
  const hasOneDigit = () => currentOperating.length === 1;
  if (!hasOneDigit()) {
    currentOperating.pop();
  } else if (resultFromEqual) {
    resetEverything();
  } else {
    currentOperating.splice(0, currentOperating.length, "0");
  }
  display.textContent = currentOperating.join("");
  if (isOperatingNumberEmpty()) {
    display.textContent = 0;
  }
}

function resetEverything() {
  resultFromEqual = 0;
  firstNumber = [0];
  secondNumber = [];
  currentOperating = firstNumber;
  /* showNext: if true, the number will show after triggering resultFromEqual with
     an operator, instead of appending to the displayed number */
  showNext = false;
  operator = null;
  display.textContent = firstNumber;
}

function operate(operator, num1, num2) {
  let operationObj = {
    "+": function () {
      return Number((num1 + num2).toFixed(4));
    },
    "-": function () {
      return Number((num1 - num2).toFixed(4));
    },
    "/": function () {
      if (num1 === 0 || num2 === 0) {
        return "no way";
      }
      return Number((num1 / num2).toFixed(4));
    },
    "*": function () {
      return Number((num1 * num2).toFixed(4));
    },
  };

  return operationObj[operator]();
}
