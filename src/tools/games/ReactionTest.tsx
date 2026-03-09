import { useState, useRef, useCallback } from "react";

type Phase = "idle" | "waiting" | "ready" | "result" | "tooEarly";

export default function ReactionTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);

  const cleanup = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = useCallback(() => {
    cleanup();
    setPhase("waiting");
    setReactionTime(null);
    const delay = 1000 + Math.random() * 4000;
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setPhase("ready");
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    switch (phase) {
      case "idle":
      case "result":
      case "tooEarly":
        start();
        break;
      case "waiting":
        cleanup();
        setPhase("tooEarly");
        break;
      case "ready": {
        const elapsed = Math.round(performance.now() - startRef.current);
        setReactionTime(elapsed);
        setAttempts((prev) => [...prev.slice(-4), elapsed]);
        setPhase("result");
        break;
      }
    }
  }, [phase, start]);

  const reset = () => {
    cleanup();
    setPhase("idle");
    setReactionTime(null);
    setAttempts([]);
  };

  const avg =
    attempts.length > 0
      ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
      : null;

  const bgColor: Record<Phase, string> = {
    idle: "bg-slate-700",
    waiting: "bg-red-500",
    ready: "bg-green-500",
    result: "bg-indigo-600",
    tooEarly: "bg-yellow-500",
  };

  const message: Record<Phase, string> = {
    idle: "点击开始",
    waiting: "等待...",
    ready: "点击!",
    result: `${reactionTime} ms`,
    tooEarly: "太快了! 点击重试",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">反应速度测试</h2>

      <div
        onClick={handleClick}
        className={`${bgColor[phase]} rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none transition-colors min-h-[240px] mb-4`}
      >
        <span className="text-white text-3xl font-bold">{message[phase]}</span>
        {phase === "ready" && (
          <span className="text-white/80 text-sm mt-2">准备...</span>
        )}
        {phase === "result" && (
          <span className="text-white/80 text-sm mt-2">点击再试一次</span>
        )}
      </div>

      {attempts.length > 0 && (
        <div className="mb-4 p-4 bg-slate-50 rounded-xl">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>最近记录</span>
            <span>平均: {avg} ms</span>
          </div>
          <div className="flex gap-2">
            {attempts.map((t, i) => (
              <span
                key={i}
                className="flex-1 text-center text-xs py-1 bg-white rounded-lg text-slate-700 border border-slate-200"
              >
                {t} ms
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={reset}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        重置
      </button>
    </div>
  );
}
