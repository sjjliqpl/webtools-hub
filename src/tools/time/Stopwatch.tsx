import { useState, useRef, useCallback } from "react";

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = () => {
    if (running) return;
    setRunning(true);
    startRef.current = Date.now() - elapsed;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 10);
  };

  const pause = () => {
    clear();
    setRunning(false);
  };

  const reset = () => {
    clear();
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  const lap = () => {
    if (running) setLaps((prev) => [elapsed, ...prev]);
  };

  const format = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
  };

  // Find fastest / slowest lap times (differences between consecutive laps)
  const lapTimes = laps.map((t, i) => (i < laps.length - 1 ? t - laps[i + 1] : t));
  let fastestIdx = -1;
  let slowestIdx = -1;
  if (lapTimes.length >= 2) {
    let min = Infinity;
    let max = -Infinity;
    lapTimes.forEach((t, i) => {
      if (t < min) { min = t; fastestIdx = i; }
      if (t > max) { max = t; slowestIdx = i; }
    });
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center gap-5">
      {/* Time display */}
      <div className="text-5xl font-mono font-bold tracking-wider text-slate-900">
        {format(elapsed)}
      </div>

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
          onClick={lap}
          disabled={!running}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40"
        >
          计次
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-300 transition-colors"
        >
          重置
        </button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="w-full max-h-56 overflow-y-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="text-slate-500 text-left">
                <th className="px-4 py-2 font-medium">计次</th>
                <th className="px-4 py-2 font-medium">分段</th>
                <th className="px-4 py-2 font-medium">总计</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((t, i) => {
                let rowClass = "";
                if (i === fastestIdx) rowClass = "text-emerald-600 bg-emerald-50";
                else if (i === slowestIdx) rowClass = "text-rose-600 bg-rose-50";
                return (
                  <tr key={i} className={`border-t border-slate-100 ${rowClass}`}>
                    <td className="px-4 py-2 font-mono">#{laps.length - i}</td>
                    <td className="px-4 py-2 font-mono">{format(lapTimes[i])}</td>
                    <td className="px-4 py-2 font-mono">{format(t)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
