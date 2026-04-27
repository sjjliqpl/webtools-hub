import { useState, useRef, useCallback } from "react";

type Phase = "idle" | "playing" | "result";

const AREA_W = 380;
const AREA_H = 400;
const TOTAL = 10;
const BASE_R = 60;
const MIN_R = 10;
const SHRINK = 3;

function randomPos(r: number) {
  return {
    x: r + Math.random() * (AREA_W - 2 * r),
    y: r + Math.random() * (AREA_H - 2 * r),
  };
}

export default function ClickPrecision() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [radius, setRadius] = useState(BASE_R);
  const [pos, setPos] = useState({ x: AREA_W / 2, y: AREA_H / 2 });
  const areaRef = useRef<HTMLDivElement>(null);

  const newTarget = useCallback((r: number) => {
    setPos(randomPos(r));
  }, []);

  const startGame = () => {
    const r = BASE_R;
    setScore(0);
    setAttempts(0);
    setRadius(r);
    setPos(randomPos(r));
    setPhase("playing");
  };

  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== "playing") return;
    const rect = areaRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const dx = cx - pos.x;
    const dy = cy - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const hit = dist <= radius;

    const nextAttempts = attempts + 1;
    const nextScore = hit ? score + 1 : score;
    const nextRadius = Math.max(MIN_R, radius - SHRINK);

    setAttempts(nextAttempts);
    setScore(nextScore);

    if (nextAttempts >= TOTAL) {
      setPhase("result");
    } else {
      setRadius(nextRadius);
      newTarget(nextRadius);
    }
  };

  const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">鼠标精确点击</h2>

      {phase !== "idle" && phase !== "result" && (
        <div className="flex gap-4 mb-3 text-sm text-slate-600">
          <span>命中: <strong>{score}</strong></span>
          <span>进度: <strong>{attempts}/{TOTAL}</strong></span>
          <span>目标半径: <strong>{radius}px</strong></span>
        </div>
      )}

      {phase === "idle" && (
        <div className="text-center py-8">
          <p className="text-slate-500 mb-4 text-sm">点击圆形目标，目标越来越小，共 10 次</p>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            开始
          </button>
        </div>
      )}

      {phase === "playing" && (
        <div
          ref={areaRef}
          onClick={handleAreaClick}
          className="relative bg-slate-100 rounded-xl cursor-crosshair overflow-hidden"
          style={{ width: AREA_W, height: AREA_H }}
        >
          {/* Target circle */}
          <div
            className="absolute rounded-full bg-indigo-500 transition-none"
            style={{
              width: radius * 2,
              height: radius * 2,
              left: pos.x - radius,
              top: pos.y - radius,
            }}
          />
          {/* Outer ring animation */}
          <div
            className="absolute rounded-full border-4 border-indigo-300 animate-ping"
            style={{
              width: radius * 2,
              height: radius * 2,
              left: pos.x - radius,
              top: pos.y - radius,
            }}
          />
        </div>
      )}

      {phase === "result" && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-slate-700 font-semibold mb-2">测试完成！</p>
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-600">{score}/{TOTAL}</div>
              <div className="text-slate-500 text-xs">命中次数</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-600">{accuracy}%</div>
              <div className="text-slate-500 text-xs">精准率</div>
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
    </div>
  );
}
