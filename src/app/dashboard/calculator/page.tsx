"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { safeEvaluate } from "@/lib/calculatorEngine";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SegmentedControl from "@/components/ui/SegmentedControl";

export default function CalculatorPage() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("scientific");
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");
  const [history, setHistory] = useState<{expr: string, res: string}[]>([]);

  // Auto-scroll history to bottom
  const historyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const handleInput = (val: string) => {
    if (result && !["+", "-", "*", "/", "^"].includes(val)) {
      setExpression(val);
      setResult("");
    } else if (result) {
      setExpression(result + val);
      setResult("");
    } else {
      setExpression(prev => prev + val);
    }
  };

  const handleClear = () => {
    setExpression("");
    setResult("");
  };

  const handleDelete = () => {
    if (result) {
      setResult("");
      setExpression("");
    } else {
      setExpression(prev => prev.slice(0, -1));
    }
  };

  const handleEqual = () => {
    try {
      if (!expression) return;
      const res = safeEvaluate(expression, angleMode).toString();
      setResult(res);
      setHistory(prev => [...prev, { expr: expression, res }]);
    } catch (e) {
      setResult("Error");
    }
  };

  const renderButton = (label: string, action: () => void, variant: "primary" | "secondary" | "ghost" | "danger" = "secondary", colSpan = 1) => (
    <Button 
      variant={variant}
      onClick={action}
      className={`h-14 text-lg font-mono ${colSpan === 2 ? 'col-span-2' : ''}`}
    >
      {label}
    </Button>
  );

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Universal Calculator</h1>
          <p className="text-text-secondary text-sm">Safe parsing, no eval().</p>
        </div>
        <SegmentedControl 
          segments={[
            { value: "basic", label: "Basic" },
            { value: "scientific", label: "Scientific" }
          ]} 
          selectedValue={mode} 
          onChange={setMode} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <Card className="lg:col-span-2 flex flex-col p-6 bg-bg-secondary border border-glass-border">
          
          {/* Display */}
          <div className="bg-bg-tertiary border border-glass-border rounded-2xl p-6 mb-6 flex flex-col items-end justify-end min-h-[140px]">
            <div className="text-text-secondary font-mono text-xl tracking-wider mb-2 h-7 break-all text-right">
              {expression}
            </div>
            <div className={`font-display font-bold text-5xl tracking-tight truncate w-full text-right ${result === "Error" ? "text-accent-red" : "text-text-primary"}`}>
              {result || "0"}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <SegmentedControl 
              segments={[
                { value: "deg", label: "Deg" },
                { value: "rad", label: "Rad" }
              ]} 
              selectedValue={angleMode} 
              onChange={(val) => setAngleMode(val as "deg" | "rad")} 
            />
            <button onClick={() => setHistory([])} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Clear History
            </button>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 flex-1">
            {/* Scientific Functions Column (hidden on mobile if basic) */}
            {mode === "scientific" && (
              <>
                {renderButton("sin", () => handleInput("sin("), "ghost")}
                {renderButton("cos", () => handleInput("cos("), "ghost")}
                {renderButton("tan", () => handleInput("tan("), "ghost")}
                {renderButton("sin⁻¹", () => handleInput("asin("), "ghost")}
                {renderButton("cos⁻¹", () => handleInput("acos("), "ghost")}
                {renderButton("tan⁻¹", () => handleInput("atan("), "ghost")}
                {renderButton("ln", () => handleInput("ln("), "ghost")}
                {renderButton("log", () => handleInput("log("), "ghost")}
                {renderButton("√", () => handleInput("sqrt("), "ghost")}
                {renderButton("|x|", () => handleInput("abs("), "ghost")}
                {renderButton("^", () => handleInput("^"), "ghost")}
                {renderButton("!", () => handleInput("!"), "ghost")}
                {renderButton("mod", () => handleInput("mod"), "ghost")}
                {renderButton("π", () => handleInput("π"), "ghost")}
                {renderButton("e", () => handleInput("e"), "ghost")}
                {renderButton("(", () => handleInput("("), "ghost")}
                {renderButton(")", () => handleInput(")"), "ghost")}
              </>
            )}

            {/* Standard Keypad */}
            <div className={`col-span-4 grid grid-cols-4 gap-3 ${mode === "scientific" ? 'sm:col-span-5' : ''}`}>
              {renderButton("AC", handleClear, "danger")}
              {renderButton("DEL", handleDelete, "secondary")}
              {renderButton("%", () => handleInput("/100"), "secondary")}
              {renderButton("÷", () => handleInput("/"), "secondary")}

              {renderButton("7", () => handleInput("7"), "secondary")}
              {renderButton("8", () => handleInput("8"), "secondary")}
              {renderButton("9", () => handleInput("9"), "secondary")}
              {renderButton("×", () => handleInput("*"), "secondary")}

              {renderButton("4", () => handleInput("4"), "secondary")}
              {renderButton("5", () => handleInput("5"), "secondary")}
              {renderButton("6", () => handleInput("6"), "secondary")}
              {renderButton("-", () => handleInput("-"), "secondary")}

              {renderButton("1", () => handleInput("1"), "secondary")}
              {renderButton("2", () => handleInput("2"), "secondary")}
              {renderButton("3", () => handleInput("3"), "secondary")}
              {renderButton("+", () => handleInput("+"), "secondary")}

              {renderButton("0", () => handleInput("0"), "secondary", 2)}
              {renderButton(".", () => handleInput("."), "secondary")}
              {renderButton("=", handleEqual, "primary")}
            </div>
          </div>
        </Card>

        {/* History Panel */}
        <Card className="flex flex-col p-0 overflow-hidden hidden lg:flex">
          <div className="p-4 border-b border-glass-border bg-bg-tertiary/50">
            <h3 className="font-medium text-text-primary">History</h3>
          </div>
          <div ref={historyRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex items-center justify-center text-text-muted text-sm">
                No history yet
              </div>
            ) : (
              history.map((item, idx) => (
                <div key={idx} className="flex flex-col text-right group cursor-pointer hover:bg-bg-tertiary p-2 rounded-lg transition-colors" onClick={() => { setExpression(item.expr); setResult(item.res); }}>
                  <span className="text-xs text-text-secondary font-mono mb-1">{item.expr}</span>
                  <span className="text-lg font-semibold text-text-primary group-hover:text-accent-active transition-colors">{item.res}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
