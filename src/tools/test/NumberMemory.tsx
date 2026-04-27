import { useState, useEffect, useRef, useCallback } from "react";

type Phase = "idle" | "show" | "input" | "result";

function generateNumber(digits: number): string {
  let n = "";
  for (let i = 0; i < digits; i++) {
    n += i === 0 ? String(Math.floor(Math.random() * 9) + 1) : String(Math.floor(Math.random() * 10));
  }
  return n;
}

export default function NumberMemory() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(3);
  const [bestLevel, setBestLevel] = useState(0);
  const [current, setCurrent] = useState("");
  const [answer, setAnswer] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRound = useCallback((lvl: number) => {
    const num = generateNumber(lvl);
    setCurrent(num);
    setAnswer("");
    setPhase("show");
    const duration = (2 + lvl * 0.5) * 1000;
    timerRef.current = setTimeout(() => setPhase("input"), duration);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleStart = () => {
    setLevel(3);
    startRound(3);
  };

  const handleSubmit = () => {
    if (answer.trim() === current) {
      const next = level + 1;
      setLevel(next);
      setPhase("idle");
      startRound(next);
    } else {
      setBestLevel(b => Math.max(b, level));
      setPhase("result");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">数字记忆测试</h2>
      <div className="flex gap-4 mb-4 text-sm text-slate-600">
        <span>当前关卡: <strong>{level} 位数</strong></span>
        <span>最佳: <strong>{bestLevel > 0 ? `${bestLevel} 位` : "-"}</strong></span>
      </div>

      {phase === "idle" && (
        <div className="text-center py-8">
          <p className="text-slate-500 mb-4 text-sm">数字显示后消失，输入你记住的数字</p>
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            开始
          </button>
        </div>
      )}

      {phase === "show" && (
        <div className="text-center py-12">
          <div className="text-5xl font-mono font-bold text-slate-800 tracking-widest">{current}</div>
          <p className="text-sm text-slate-400 mt-4">记住这个数字…</p>
        </div>
      )}

      {phase === "input" && (
        <div className="text-center py-8">
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            确认
          </button>
        </div>
      )}

      {phase === "result" && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">❌</div>
          <p className="text-slate-700 font-semibold mb-1">游戏结束</p>
          <p className="text-sm text-slate-500 mb-1">你记到了 <strong>{level} 位数</strong></p>
          <p className="text-sm text-slate-500 mb-1">正确答案: <strong className="font-mono">{current}</strong></p>
          <p className="text-sm text-slate-500 mb-4">你的输入: <strong className="font-mono text-red-500">{answer}</strong></p>
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            再试
          </button>
        </div>
      )}
    </div>
  );
}
