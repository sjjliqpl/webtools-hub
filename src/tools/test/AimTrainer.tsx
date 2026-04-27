import { useState, useRef, useEffect, useCallback } from "react";

const AREA_W = 500;
const AREA_H = 350;
const TARGET_R = 40;
const DURATION = 30;

function randomPos() {
  return {
    x: TARGET_R + Math.random() * (AREA_W - 2 * TARGET_R),
    y: TARGET_R + Math.random() * (AREA_H - 2 * TARGET_R),
  };
}

export default function AimTrainer() {
  const [active, setActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [done, setDone] = useState(false);
  const [pos, setPos] = useState({ x: AREA_W / 2, y: AREA_H / 2 });
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastClickRef = useRef<number>(0);
  const areaRef = useRef<HTMLDivElement>(null);

  const endGame = useCallback(() => {
    setActive(false);
    setDone(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, endGame]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(DURATION);
    setDone(false);
    setReactionTimes([]);
    setPos(randomPos());
    lastClickRef.current = performance.now();
    setActive(true);
  };

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!active) return;
    const now = performance.now();
    const rt = Math.round(now - lastClickRef.current);
    lastClickRef.current = now;
    setReactionTimes(prev => [...prev, rt]);
    setScore(s => s + 1);
    setPos(randomPos());
  };

  const avgRT = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;
  const tpm = DURATION > 0 ? Math.round((score / DURATION) * 60) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-xl mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">瞄准训练</h2>

      {active && (
        <div className="flex gap-4 mb-3 text-sm text-slate-600">
          <span>得分: <strong>{score}</strong></span>
          <span>剩余: <strong>{timeLeft}s</strong></span>
        </div>
      )}

      {!active && !done && (
        <div className="text-center py-8">
          <p className="text-slate-500 mb-4 text-sm">30 秒内点击出现的目标，尽量快</p>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            开始
          </button>
        </div>
      )}

      {active && (
        <div
          ref={areaRef}
          className="relative bg-slate-100 rounded-xl overflow-hidden cursor-crosshair"
          style={{ width: AREA_W, height: AREA_H }}
        >
          <div
            onClick={handleTargetClick}
            className="absolute rounded-full bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
            style={{
              width: TARGET_R * 2,
              height: TARGET_R * 2,
              left: pos.x - TARGET_R,
              top: pos.y - TARGET_R,
              animation: "pulse 1s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          />
        </div>
      )}

      {done && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">⚡</div>
          <p className="text-slate-700 font-semibold mb-3">时间到！</p>
          <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-600">{score}</div>
              <div className="text-slate-500 text-xs">命中次数</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-600">{avgRT}ms</div>
              <div className="text-slate-500 text-xs">平均反应</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-600">{tpm}</div>
              <div className="text-slate-500 text-xs">目标/分钟</div>
            </div>
          </div>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            再试
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }
      `}</style>
    </div>
  );
}
