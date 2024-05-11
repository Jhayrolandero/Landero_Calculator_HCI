const operArr = ["+", "-", "/", "%", ".", "*"];
const display = document.querySelector("#display");
const resultDisplay = document.querySelector("#result");
let parenthesisStack = [];

pushParent = () => {
  parenthesisStack.push(")");
  parenthesisStack.push("(");
};

popParent = () => {
  return parenthesisStack.pop();
};

function evalResult(script) {
  return eval(script);
}

function checkDecimal(script) {
  const copyScript = script.slice();

  const operatorPattern = /[+\-*/%]/;
  const equationArr = copyScript.split(operatorPattern);

  return equationArr[equationArr.length - 1].includes(".");
}

function calculator() {
  let _display = "";
  let _result = 0;
  return {
    get display() {
      return _display;
    },
    set display(value) {
      _display += value;
      display.innerText = _display;

      try {
        _result = evalResult(_display);
        resultDisplay.innerText = _result;
      } catch {
        return;
      }
    },
    set operator(value) {
      // Get the last character of the display string
      const lastChar = _display[_display.length - 1];

      if (value === "()") {
        try {
          if (parenthesisStack.length == 0 || operArr.includes(lastChar)) {
            console.log("push naother");
            pushParent();
          }

          _display += popParent();
          display.innerText = _display;
          _result = evalResult(_display);
          resultDisplay.innerText = _result;
          return;
        } catch {
          resultDisplay.innerText = "Syntax Error";
          return;
        }
      }

      if (_display !== "" && value === "backspace") {
        try {
          if (lastChar === "(") parenthesisStack.push("(");
          if (lastChar === ")") parenthesisStack.push(")");

          _display = _display.slice(0, -1);
          display.innerText = _display;

          // Update the res accordingly
          newRes = evalResult(_display);
          if (newRes === undefined) {
            _display = _display.slice(0, -1);
            resultDisplay.innerText = _display;
            return;
          }

          resultDisplay.innerText = evalResult(_display);
          return;
        } catch {
          resultDisplay.innerText = "";
          return;
        }
      }

      // Reset
      if (value === "clearAll") {
        parenthesisStack = [];
        _display = "";
        _result = 0;
        display.innerText = _display;
        resultDisplay.innerText = "";
        return;
      }

      // auto add 0 for first instance of ,
      if (value === "." && _display === "" && !checkDecimal(_display)) {
        _display += "0" + value;
        display.innerText = _display;
        return;
      }

      // DOn;t add operator if empty
      if (_display === "") return;

      // Check the occureance of the latest decimal if it exist
      if (value === "." && checkDecimal(_display)) return;

      // Auto add 0 if last is a operator
      if (value === "." && operArr.includes(lastChar)) {
        _display += "0" + value;
        display.innerText = _display;
        return;
      }

      // Check if the last character is an operator
      if (operArr.includes(lastChar) || lastChar === "(") return;

      // Equal
      if (value === "=") {
        try {
          parenthesisStack = [];
          result = evalResult(_display);
          display.innerText = result;
          resultDisplay.innerText = "";
          _display = "";
          _result = 0;
          return;
        } catch {
          parenthesisStack = [];

          display.innerText = "NaN";
          resultDisplay.innerText = "";
          _display = "";
          _result = 0;
          return;
        }
      }

      // Append the operator to the display string
      _display += value;
      display.innerText = _display;
    },
  };
}

const calc = new calculator();
var nums = document.querySelectorAll(".num");

nums.forEach((num) => {
  num.addEventListener("click", () => {
    const numVal = num.getAttribute("data-number-value");
    calc.display = numVal;
  });
});

var opers = document.querySelectorAll(".operator");

opers.forEach((oper) => {
  oper.addEventListener("click", () => {
    const operVal = oper.getAttribute("data-oper-value");
    calc.operator = operVal;
  });
});
