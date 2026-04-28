import { useState, useEffect, useRef, useCallback } from "react";

type Phase = "idle" | "show" | "input" | "result";

const DISPLAY_TIME_OPTIONS = [1, 2, 3, 5, 8, 10];
const DIGIT_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10];

function generateNumber(digits: number): string {
  let n = "";
  for (let i = 0; i < digits; i++) {
    n += i === 0 ? String(Math.floor(Math.random() * 9) + 1) : String(Math.floor(Math.random() * 10));
  }
  return n;
}

export default function NumberMemory() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [digits, setDigits] = useState(5);
  const [displaySec, setDisplaySec] = useState(3);
  const [current, setCurrent] = useState("");
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const startRound = useCallback((d: number, sec: number) => {
    const num = generateNumber(d);
    setCurrent(num);
    setAnswer("");
    setLastCorrect(null);
    setPhase("show");
    timerRef.current = setTimeout(() => setPhase("input"), sec * 1000);
  }, []);

  const handlePanelClick = () => {
    if (phase === "idle") {
      startRound(digits, displaySec);
    }
  };

  const handleConfigChange = (newDigits: number, newSec: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
    setCorrect(0);
    setIncorrect(0);
    setLastCorrect(null);
    setCurrent("");
    setAnswer("");
    setDigits(newDigits);
    setDisplaySec(newSec);
  };

  const handleSubmit = () => {
    if (answer.trim() === current) {
      setCorrect(c => c + 1);
      setLastCorrect(true);
    } else {
      setIncorrect(c => c + 1);
      setLastCorrect(false);
    }
    setPhase("result");
  };

  const handleNext = () => {
    startRound(digits, displaySec);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">数字记忆测试</h2>

      {/* Config */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 w-16 shrink-0">显示时长</span>
          <div className="flex gap-1 flex-wrap">
            {DISPLAY_TIME_OPTIONS.map(sec => (
              <button
                key={sec}
                onClick={() => handleConfigChange(digits, sec)}
                className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${displaySec === sec ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-300 hover:border-indigo-400"}`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 w-16 shrink-0">数字位数</span>
          <div className="flex gap-1 flex-wrap">
            {DIGIT_OPTIONS.map(d => (
              <button
                key={d}
                onClick={() => handleConfigChange(d, displaySec)}
                className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${digits === d ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-300 hover:border-indigo-400"}`}
              >
                {d}位
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4 text-sm">
        <span className="text-green-600">✓ 正确: <strong>{correct}</strong></span>
        <span className="text-red-500">✗ 错误: <strong>{incorrect}</strong></span>
        {correct + incorrect > 0 && (
          <span className="text-slate-500">正确率: <strong>{Math.round((correct / (correct + incorrect)) * 100)}%</strong></span>
        )}
      </div>

      {/* Phase panels */}
      {phase === "idle" && (
        <div
          onClick={handlePanelClick}
          className="cursor-pointer select-none text-center py-12 rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
        >
          <div className="text-3xl mb-2">🖱️</div>
          <p className="text-slate-600 font-medium">点击此处开始</p>
          <p className="text-xs text-slate-400 mt-1">{digits} 位数字，显示 {displaySec} 秒后消失</p>
        </div>
      )}

      {phase === "show" && (
        <div className="text-center py-12 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-5xl font-mono font-bold text-slate-800 tracking-widest break-all px-2">{current}</div>
          <p className="text-sm text-slate-400 mt-4">记住这个数字…</p>
        </div>
      )}

      {phase === "input" && (
        <div className="text-center py-6 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-sm text-slate-600 mb-3">输入你记住的数字</p>
          <input
            type="text"
            inputMode="numeric"
            value={answer}
            onChange={e => setAnswer(e.target.value.replace(/\D/g, ""))}
            onKeyDown={e => e.key === "Enter" && answer.length > 0 && handleSubmit()}
            autoFocus
            className="w-full text-center text-2xl font-mono font-bold border border-slate-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4 tracking-widest"
            placeholder="输入数字"
          />
          <button
            onClick={handleSubmit}
            disabled={answer.length === 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            确认
          </button>
        </div>
      )}

      {phase === "result" && (
        <div className="text-center py-6 rounded-xl border border-slate-200 bg-slate-50">
          <div className="text-4xl mb-2">{lastCorrect ? "✅" : "❌"}</div>
          <p className={`font-semibold mb-2 ${lastCorrect ? "text-green-600" : "text-red-500"}`}>
            {lastCorrect ? "正确！" : "错误"}
          </p>
          <p className="text-sm text-slate-500 mb-1">正确答案: <strong className="font-mono">{current}</strong></p>
          {!lastCorrect && (
            <p className="text-sm text-slate-500 mb-1">你的输入: <strong className="font-mono text-red-500">{answer}</strong></p>
          )}
          <button
            onClick={handleNext}
            className="mt-3 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            下一题
          </button>
        </div>
      )}
    </div>
  );
}
