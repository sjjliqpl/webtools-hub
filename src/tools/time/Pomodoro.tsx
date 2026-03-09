import { useState, useEffect, useRef, useCallback } from "react";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Pomodoro() {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [remaining, setRemaining] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = mode === "work" ? WORK_SECONDS : BREAK_SECONDS;
  const progress = remaining / total;
  const offset = CIRCUMFERENCE * (1 - progress);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const switchMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "work" ? "break" : "work";
      setRemaining(next === "work" ? WORK_SECONDS : BREAK_SECONDS);
      if (prev === "work") setSessions((s) => s + 1);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    clear();
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          switchMode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clear;
  }, [running, mode, clear, switchMode]);

  const toggle = () => setRunning((v) => !v);

  const reset = () => {
    clear();
    setRunning(false);
    setMode("work");
    setRemaining(WORK_SECONDS);
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const mm = pad(Math.floor(remaining / 60));
  const ss = pad(remaining % 60);

  const color = mode === "work" ? "#4f46e5" : "#10b981";
  const bgColor = mode === "work" ? "bg-indigo-50" : "bg-emerald-50";
  const label = mode === "work" ? "工作" : "休息";

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center gap-5">
      {/* Mode label */}
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          mode === "work"
            ? "bg-indigo-100 text-indigo-700"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {label}
      </span>

      {/* Circular progress */}
      <div className={`relative flex items-center justify-center rounded-full ${bgColor}`}>
        <svg width="220" height="220" className="-rotate-90">
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            style={{ strokeDashoffset: offset }}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-mono font-bold tracking-wider text-slate-900">
            {mm}:{ss}
          </span>
        </div>
      </div>

      {/* Session count */}
      <span className="text-sm text-slate-500">
        已完成 <span className="font-semibold text-slate-700">{sessions}</span> 个番茄
      </span>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={toggle}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {running ? "暂停" : "开始"}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-300 transition-colors"
        >
          重置
        </button>
      </div>
    </div>
  );
}
