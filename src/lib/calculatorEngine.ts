import { evaluate, format } from 'mathjs';

export function safeEvaluate(expr: string, angleMode: "deg" | "rad" = "deg"): number | string {
  if (!expr) return 0;
  try {
    // Sanitize common UI symbols to standard math operators
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/ln\(/g, 'log(') // mathjs log(x) is natural log by default.
      .replace(/log10\(/g, 'log10(');

    // If angle mode is degrees, we create a scope with wrapped trigonometric functions
    // so that inputs are automatically converted to radians (which mathjs expects).
    const scope: Record<string, any> = {};
    
    if (angleMode === "deg") {
      const toRad = (x: number) => x * (Math.PI / 180);
      const fromRad = (x: number) => x * (180 / Math.PI);
      
      scope.sin = (x: number) => Math.sin(toRad(x));
      scope.cos = (x: number) => Math.cos(toRad(x));
      scope.tan = (x: number) => Math.tan(toRad(x));
      scope.asin = (x: number) => fromRad(Math.asin(x));
      scope.acos = (x: number) => fromRad(Math.acos(x));
      scope.atan = (x: number) => fromRad(Math.atan(x));
    }

    // Evaluate using mathjs
    const result = evaluate(sanitized, scope);
    
    // Format to avoid floating point precision issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
    // precision 14 handles standard float issues cleanly.
    return format(result, { precision: 14 });
    
  } catch (error) {
    throw new Error("Syntax Error");
  }
}
