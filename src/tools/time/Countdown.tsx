import { useState, useRef, useCallback } from "react";

function playBeep() {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = 880;
  gain.gain.value = 0.3;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
  setTimeout(() => ctx.close(), 500);
}

export default function Countdown() {
  const [inputH, setInputH] = useState("0");
  const [inputM, setInputM] = useState("0");
  const [inputS, setInputS] = useState("0");
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = () => {
    if (running) return;
    let secs = remaining;
    if (secs <= 0) {
      secs = parseInt(inputH || "0") * 3600 + parseInt(inputM || "0") * 60 + parseInt(inputS || "0");
      if (secs <= 0) return;
      setTotal(secs);
      setRemaining(secs);
    }
    setFinished(false);
    setRunning(true);
    clear();
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clear();
          setRunning(false);
          setFinished(true);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    clear();
    setRunning(false);
  };

  const reset = () => {
    clear();
    setRunning(false);
    setRemaining(0);
    setTotal(0);
    setFinished(false);
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const progress = total > 0 ? (remaining / total) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center gap-5">
      {/* Input */}
      <div className="flex items-center gap-2">
        {[
          { label: "时", value: inputH, set: setInputH },
          { label: "分", value: inputM, set: setInputM },
          { label: "秒", value: inputS, set: setInputS },
        ].map(({ label, value, set }) => (
          <div key={label} className="flex items-center gap-1">
            <input
              type="number"
              min={0}
              value={value}
              onChange={(e) => set(e.target.value)}
              disabled={running}
              className="w-16 rounded-xl border border-slate-200 px-4 py-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <span className="text-sm text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Display */}
      <div className="text-5xl font-mono font-bold tracking-wider text-slate-900">
        {pad(h)}:{pad(m)}:{pad(s)}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Finished */}
      {finished && (
        <div className="text-lg font-bold text-rose-500 animate-pulse">
          时间到!
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        {!running ? (
          <button
            onClick={start}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            开始
          </button>
        ) : (
          <button
            onClick={pause}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            暂停
          </button>
        )}
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
