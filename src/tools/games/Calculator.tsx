import { useState } from "react";

interface CalcState {
  displayValue: string;
  previousValue: string | null;
  operator: string | null;
  waitingForOperand: boolean;
}

const initialState: CalcState = {
  displayValue: "0",
  previousValue: null,
  operator: null,
  waitingForOperand: false,
};

function calculate(left: number, op: string, right: number): number {
  switch (op) {
    case "+": return left + right;
    case "-": return left - right;
    case "×": return left * right;
    case "÷": return right !== 0 ? left / right : NaN;
    default: return right;
  }
}

export default function Calculator() {
  const [state, setState] = useState<CalcState>(initialState);

  const inputDigit = (digit: string) => {
    setState((s) => {
      if (s.waitingForOperand || s.displayValue === "错误") {
        return { ...s, displayValue: digit, waitingForOperand: false };
      }
      return {
        ...s,
        displayValue: s.displayValue === "0" || s.displayValue === "错误" ? digit : s.displayValue + digit,
      };
    });
  };

  const inputDot = () => {
    setState((s) => {
      if (s.waitingForOperand || s.displayValue === "错误") {
        return { ...s, displayValue: "0.", waitingForOperand: false };
      }
      if (s.displayValue.includes(".")) return s;
      return { ...s, displayValue: s.displayValue + "." };
    });
  };

  const clear = () => setState(initialState);

  const toggleSign = () => {
    setState((s) => ({
      ...s,
      displayValue:
        s.displayValue.charAt(0) === "-"
          ? s.displayValue.slice(1)
          : s.displayValue === "0"
          ? "0"
          : "-" + s.displayValue,
    }));
  };

  const percentage = () => {
    setState((s) => ({
      ...s,
      displayValue: String(parseFloat(s.displayValue) / 100),
    }));
  };

  const handleOperator = (nextOp: string) => {
    setState((s) => {
      const current = parseFloat(s.displayValue);
      if (s.operator && !s.waitingForOperand && s.previousValue !== null) {
        const result = calculate(parseFloat(s.previousValue), s.operator, current);
        const resultStr = Number.isFinite(result) ? String(parseFloat(result.toFixed(10))) : "错误";
        return {
          displayValue: resultStr,
          previousValue: resultStr,
          operator: nextOp,
          waitingForOperand: true,
        };
      }
      return {
        ...s,
        previousValue: String(current),
        operator: nextOp,
        waitingForOperand: true,
      };
    });
  };

  const handleEquals = () => {
    setState((s) => {
      if (!s.operator || s.previousValue === null) return s;
      const current = parseFloat(s.displayValue);
      const result = calculate(parseFloat(s.previousValue), s.operator, current);
      const resultStr = Number.isFinite(result) ? String(parseFloat(result.toFixed(10))) : "错误";
      return {
        displayValue: resultStr,
        previousValue: null,
        operator: null,
        waitingForOperand: true,
      };
    });
  };

  const btnClass = (variant: "default" | "op" | "special" = "default") => {
    const base =
      "w-full h-16 rounded-lg text-lg font-medium flex items-center justify-center transition-all active:scale-95";
    switch (variant) {
      case "op":
        return `${base} bg-blue-500 text-white hover:bg-blue-600`;
      case "special":
        return `${base} bg-slate-200 text-slate-800 hover:bg-slate-300`;
      default:
        return `${base} bg-slate-100 text-slate-800 hover:bg-slate-200`;
    }
  };

  const displayExpr =
    state.previousValue !== null && state.operator
      ? `${state.previousValue} ${state.operator}`
      : "";

  return (
    <div className="tool-surface mx-auto" style={{ maxWidth: 320 }}>
      <div className="bg-slate-900 text-white text-right p-6 rounded-lg mb-4">
        <div className="text-sm text-slate-400 font-mono h-5 mb-1 truncate">
          {displayExpr}
        </div>
        <div className="text-3xl font-mono truncate">{state.displayValue}</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button className={btnClass("special")} onClick={clear}>C</button>
        <button className={btnClass("special")} onClick={toggleSign}>±</button>
        <button className={btnClass("special")} onClick={percentage}>%</button>
        <button className={btnClass("op")} onClick={() => handleOperator("÷")}>÷</button>

        {["7", "8", "9"].map((d) => (
          <button key={d} className={btnClass()} onClick={() => inputDigit(d)}>{d}</button>
        ))}
        <button className={btnClass("op")} onClick={() => handleOperator("×")}>×</button>

        {["4", "5", "6"].map((d) => (
          <button key={d} className={btnClass()} onClick={() => inputDigit(d)}>{d}</button>
        ))}
        <button className={btnClass("op")} onClick={() => handleOperator("-")}>−</button>

        {["1", "2", "3"].map((d) => (
          <button key={d} className={btnClass()} onClick={() => inputDigit(d)}>{d}</button>
        ))}
        <button className={btnClass("op")} onClick={() => handleOperator("+")}>+</button>

        <button
          className={`${btnClass()} col-span-2`}
          onClick={() => inputDigit("0")}
        >
          0
        </button>
        <button className={btnClass()} onClick={inputDot}>.</button>
        <button className={btnClass("op")} onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}
