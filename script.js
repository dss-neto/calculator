const display = document.getElementById("display");
const numberDiv = document.getElementById("numbers");
const operatorsDiv = document.getElementById("operators");

const NUMBERS_LIST = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
const OPERATORS_LIST = ["=", "+", "-", "*", "/"];

let resultFromEqual = 0;
let firstNumber = [0];
let secondNumber = [];
let currentOperating = firstNumber;
/* showNext: if true, the number will show after triggering
  resultFromEqual with an operator, instead of appending to the displayed number */
let showNext = false;
let operator;
display.textContent = firstNumber;
const keyboardObj = {
  Backspace: function () {
    backspaceFunctionality();
  },
  Enter: function () {
    workWithOperators("=");
  },
  Escape: function () {
    resetEverything();
  },
};

document.addEventListener("keydown", (logKey) => {
  if (
    logKey.key !== "Enter" &&
    logKey.key !== "Backspace" &&
    logKey.key !== "Escape"
  ) {
    if (NUMBERS_LIST.includes(logKey.key)) {
      workWithNumbers(logKey.key, "BUTTON");
    } else if (OPERATORS_LIST.includes(logKey.key)) {
      workWithOperators(logKey.key);
    }
  } else {
    keyboardObj[logKey.key]();
  }
});

numberDiv.addEventListener("click", (e) =>
  workWithNumbers(e.target.id, e.target.tagName)
);

operatorsDiv.addEventListener("click", (e) => workWithOperators(e.target.id));

function workWithNumbers(targetId, targetElement) {
  if (targetId !== "." || !currentOperating.includes(".")) {
    if (targetElement === "BUTTON") {
      if (currentOperating[0] === 0 && currentOperating.length === 1) {
        currentOperating.pop();
        /* Turn the initial 0 into nothing because the rest of the code 
           will display the number*/
        display.textContent = "";
      }
      if (resultFromEqual) {
        resetEverything();
      }
      if (currentOperating.length === 1 && currentOperating[0] === 0) {
        currentOperating.pop();
        display.textContent = "";
      }
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
  if (targetId !== "backspace" && (targetId !== "=" || operator)) {
    resultFromEqual = 0;
    currentOperating = secondNumber;
    showNext = true;
  }
  if (targetId === "AC") {
    resetEverything();
  } else if (targetId === "backspace") {
    backspaceFunctionality();
  } else if (targetId === "=") {
    equalsFunctionality();
  } else {
    operatorFunctionality(targetId);
  }
}

function operatorFunctionality(targetId) {
  if (operator) {
    if (secondNumber.length === 0) {
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
      display.textContent = firstNumber;
      operator = targetId;
    }
  } else {
    operator = targetId;
    secondNumber.splice(0, secondNumber.length);
  }
}

function equalsFunctionality() {
  if (secondNumber.length > 0) {
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
      display.textContent = firstNumber;
      operator = null;
    } else {
      currentOperating = firstNumber;
      showNext = false;
    }
  }
}

function backspaceFunctionality() {
  if (currentOperating.length !== 1) {
    currentOperating.pop();
  } else if (resultFromEqual) {
    resetEverything();
  } else {
    currentOperating.splice(0, currentOperating.length, 0);
  }
  display.textContent = currentOperating.join("");
  if (currentOperating.length === 0) {
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
      return Number((num1 + num2).toFixed(7));
    },
    "-": function () {
      return Number((num1 - num2).toFixed(7));
    },
    "/": function () {
      if (num1 === 0 || num2 === 0) {
        return "no way";
      }
      return Number((num1 / num2).toFixed(7));
    },
    "*": function () {
      return Number((num1 * num2).toFixed(7));
    },
  };

  return operationObj[operator]();
}
