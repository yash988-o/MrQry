// Safe mathematical parser avoiding eval()
// Basic implementation supporting +, -, *, /, ^, (, ), sin, cos, tan, sqrt, log

const precedence: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  'mod': 2,
  '^': 3,
  '!': 4,
};

const isOperator = (c: string) => ['+', '-', '*', '/', '^', 'mod', '!'].includes(c);
const isFunction = (str: string) => ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'log', 'ln', 'abs'].includes(str);

function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let numStr = "";
  let fnStr = "";

  const pushNum = () => { if (numStr) { tokens.push(numStr); numStr = ""; } };
  const pushFn = () => { if (fnStr) { tokens.push(fnStr); fnStr = ""; } };

  // Normalize expression
  expr = expr.replace(/\s+/g, '').replace(/π/g, Math.PI.toString()).replace(/e/g, Math.E.toString());

  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];

    if (/[0-9.]/.test(c)) {
      pushFn();
      numStr += c;
    } else if (/[a-zA-Z]/.test(c)) {
      pushNum();
      fnStr += c;
    } else {
      pushNum();
      pushFn();
      
      // Handle negative numbers (unary minus)
      if (c === '-' && (i === 0 || expr[i-1] === '(' || isOperator(expr[i-1]))) {
        numStr += '-'; // Start a negative number
        continue;
      }
      
      tokens.push(c);
    }
  }
  pushNum();
  pushFn();

  return tokens;
}

function infixToRPN(tokens: string[]): string[] {
  const output: string[] = [];
  const operatorStack: string[] = [];

  for (const token of tokens) {
    if (!isNaN(parseFloat(token))) {
      output.push(token);
    } else if (isFunction(token)) {
      operatorStack.push(token);
    } else if (isOperator(token)) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== '(' &&
        (isFunction(operatorStack[operatorStack.length - 1]) ||
          precedence[operatorStack[operatorStack.length - 1]] >= precedence[token])
      ) {
        output.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        output.push(operatorStack.pop()!);
      }
      if (operatorStack[operatorStack.length - 1] === '(') {
        operatorStack.pop();
      }
      if (operatorStack.length > 0 && isFunction(operatorStack[operatorStack.length - 1])) {
        output.push(operatorStack.pop()!);
      }
    }
  }

  while (operatorStack.length > 0) {
    output.push(operatorStack.pop()!);
  }

  return output;
}

function evaluateRPN(rpn: string[], angleMode: "deg" | "rad" = "deg"): number {
  const stack: number[] = [];

  const toRad = (val: number) => angleMode === "deg" ? val * (Math.PI / 180) : val;
  const fromRad = (val: number) => angleMode === "deg" ? val * (180 / Math.PI) : val;
  
  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) throw new Error("Invalid factorial");
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  for (const token of rpn) {
    if (!isNaN(parseFloat(token))) {
      stack.push(parseFloat(token));
    } else if (isOperator(token)) {
      if (token === '!') {
        const a = stack.pop()!;
        stack.push(factorial(a));
        continue;
      }
      
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': 
          if (b === 0) throw new Error("Division by zero");
          stack.push(a / b); 
          break;
        case 'mod': stack.push(a % b); break;
        case '^': stack.push(Math.pow(a, b)); break;
      }
    } else if (isFunction(token)) {
      const a = stack.pop()!;
      switch (token) {
        case 'sin': stack.push(Math.sin(toRad(a))); break;
        case 'cos': stack.push(Math.cos(toRad(a))); break;
        case 'tan': stack.push(Math.tan(toRad(a))); break;
        case 'asin': stack.push(fromRad(Math.asin(a))); break;
        case 'acos': stack.push(fromRad(Math.acos(a))); break;
        case 'atan': stack.push(fromRad(Math.atan(a))); break;
        case 'sqrt': 
          if (a < 0) throw new Error("Invalid sqrt");
          stack.push(Math.sqrt(a)); 
          break;
        case 'log': stack.push(Math.log10(a)); break;
        case 'ln': stack.push(Math.log(a)); break;
        case 'abs': stack.push(Math.abs(a)); break;
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error("Invalid expression");
  }

  return stack[0];
}

export function safeEvaluate(expr: string, angleMode: "deg" | "rad" = "deg"): number {
  if (!expr) return 0;
  try {
    const tokens = tokenize(expr);
    const rpn = infixToRPN(tokens);
    const result = evaluateRPN(rpn, angleMode);
    
    // Fix floating point precision issues (e.g. 0.1 + 0.2)
    return Math.round(result * 10000000000) / 10000000000;
  } catch (error) {
    throw new Error("Syntax Error");
  }
}
