import { useState, useRef, useCallback } from "react";

type Phase = "idle" | "playing" | "result";

const AREA_W = 380;
const AREA_H = 400;
const TOTAL = 10;

const DIFFICULTY_OPTIONS = [
  { label: "简单", baseR: 40, minR: 15, shrink: 2, dots: 1 },
  { label: "普通", baseR: 28, minR: 10, shrink: 2, dots: 1 },
  { label: "困难", baseR: 22, minR:  8, shrink: 2, dots: 2 },
  { label: "极难", baseR: 16, minR:  5, shrink: 1, dots: 3 },
];

interface Target {
  id: number;
  x: number;
  y: number;
}

function randomPos(r: number, existingTargets: Target[]): { x: number; y: number } {
  const maxTries = 100;
  for (let t = 0; t < maxTries; t++) {
    const x = r + Math.random() * (AREA_W - 2 * r);
    const y = r + Math.random() * (AREA_H - 2 * r);
    const tooClose = existingTargets.some(
      tgt => Math.sqrt((tgt.x - x) ** 2 + (tgt.y - y) ** 2) < r * 2.5
    );
    if (!tooClose) return { x, y };
  }
  return {
    x: r + Math.random() * (AREA_W - 2 * r),
    y: r + Math.random() * (AREA_H - 2 * r),
  };
}

function generateTargets(count: number, r: number): Target[] {
  const targets: Target[] = [];
  for (let i = 0; i < count; i++) {
    const pos = randomPos(r, targets);
    targets.push({ id: i, ...pos });
  }
  return targets;
}

export default function ClickPrecision() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [radius, setRadius] = useState(DIFFICULTY_OPTIONS[1].baseR);
  const [targets, setTargets] = useState<Target[]>([]);
  const [diffIdx, setDiffIdx] = useState(1);
  const [clickTimes, setClickTimes] = useState<number[]>([]);
  const clickStartRef = useRef<number>(Date.now());
  const areaRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);

  const diff = DIFFICULTY_OPTIONS[diffIdx];

  const newTargets = useCallback((r: number, count: number) => {
    const ts = generateTargets(count, r);
    nextIdRef.current += count;
    setTargets(ts.map(t => ({ ...t, id: t.id + nextIdRef.current })));
    clickStartRef.current = Date.now();
  }, []);

  const startGame = () => {
    const d = DIFFICULTY_OPTIONS[diffIdx];
    setScore(0);
    setAttempts(0);
    setRadius(d.baseR);
    setClickTimes([]);
    nextIdRef.current = 0;
    const ts = generateTargets(d.dots, d.baseR);
    setTargets(ts);
    clickStartRef.current = Date.now();
    setPhase("playing");
  };

  const handleTargetClick = (e: React.MouseEvent, targetId: number) => {
    if (phase !== "playing") return;
    e.stopPropagation();

    const elapsed = Date.now() - clickStartRef.current;
    const nextAttempts = attempts + 1;
    const nextScore = score + 1;
    const nextRadius = Math.max(diff.minR, radius - diff.shrink);

    setClickTimes(prev => [...prev, elapsed]);
    setAttempts(nextAttempts);
    setScore(nextScore);

    if (nextAttempts >= TOTAL) {
      setPhase("result");
      return;
    }

    setRadius(nextRadius);
    const remaining = targets.filter(t => t.id !== targetId);
    if (remaining.length === 0) {
      newTargets(nextRadius, diff.dots);
    } else {
      setTargets(remaining.map(t => ({ ...t })));
      clickStartRef.current = Date.now();
    }
  };

  const handleAreaClick = () => {
    // miss click — do nothing (no penalty, just visual feedback)
  };

  const avgTime = clickTimes.length > 0
    ? Math.round(clickTimes.reduce((a, b) => a + b, 0) / clickTimes.length)
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">鼠标精确点击</h2>

      {phase !== "idle" && phase !== "result" && (
        <div className="flex gap-4 mb-3 text-sm text-slate-600">
          <span>命中: <strong>{score}</strong></span>
          <span>进度: <strong>{attempts}/{TOTAL}</strong></span>
          <span>目标半径: <strong>{radius}px</strong></span>
          <span>点数: <strong>{diff.dots}</strong></span>
        </div>
      )}

      {phase === "idle" && (
        <div className="text-center py-8">
          <p className="text-slate-500 mb-4 text-sm">点击圆形目标，目标越来越小，共 {TOTAL} 次</p>
          <div className="flex gap-2 justify-center mb-4">
            {DIFFICULTY_OPTIONS.map((d, i) => (
              <button
                key={d.label}
                onClick={() => setDiffIdx(i)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${diffIdx === i ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-300 hover:border-indigo-400"}`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mb-4">同时显示 {diff.dots} 个点 · 初始半径 {diff.baseR}px</p>
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
          {targets.map(tgt => (
            <div
              key={tgt.id}
              onClick={e => handleTargetClick(e, tgt.id)}
              className="absolute rounded-full bg-indigo-500 hover:bg-indigo-600 cursor-pointer transition-colors"
              style={{
                width: radius * 2,
                height: radius * 2,
                left: tgt.x - radius,
                top: tgt.y - radius,
              }}
            />
          ))}
        </div>
      )}

      {phase === "result" && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-slate-700 font-semibold mb-2">测试完成！</p>
          <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-600">{score}/{TOTAL}</div>
              <div className="text-slate-500 text-xs">命中次数</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-600">{Math.round((score / TOTAL) * 100)}%</div>
              <div className="text-slate-500 text-xs">精准率</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-600">{avgTime}<span className="text-sm font-normal">ms</span></div>
              <div className="text-slate-500 text-xs">平均反应</div>
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
