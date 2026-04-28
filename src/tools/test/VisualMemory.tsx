import { useState, useEffect, useCallback, useRef } from "react";

type Phase = "idle" | "show" | "input" | "result";

const DIFFICULTY_OPTIONS = [
  { label: "简单", ms: 1000 },
  { label: "普通", ms: 500 },
  { label: "困难", ms: 200 },
  { label: "极难", ms: 50 },
];

function pickRandom(n: number, max: number): number[] {
  const pool = Array.from({ length: max }, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

export default function VisualMemory() {
  const GRID = 25;
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [diffIdx, setDiffIdx] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayMs = DIFFICULTY_OPTIONS[diffIdx].ms;

  const cellCount = 2 + level;

  const startRound = useCallback((ms: number) => {
    const cells = pickRandom(cellCount, GRID);
    setHighlighted(cells);
    setSelected([]);
    setPhase("show");
    timerRef.current = setTimeout(() => {
      setPhase("input");
    }, ms);
  }, [cellCount]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleStart = () => {
    setLevel(1);
    setScore(0);
    startRound(displayMs);
  };

  const handleCellClick = (idx: number) => {
    if (phase !== "input") return;
    if (selected.includes(idx)) return;
    const next = [...selected, idx];
    setSelected(next);
    if (next.length === highlighted.length) {
      setPhase("result");
    }
  };

  const handleNext = () => {
    const correct = highlighted.filter(c => selected.includes(c)).length;
    const isAllCorrect = correct === highlighted.length && selected.every(s => highlighted.includes(s));
    if (isAllCorrect) {
      const newScore = score + level;
      const newLevel = level + 1;
      setScore(newScore);
      setBest(b => Math.max(b, newScore));
      setLevel(newLevel);
      startRound(displayMs);
    } else {
      setBest(b => Math.max(b, score));
      setPhase("idle");
    }
  };

  const getCellStyle = (idx: number): string => {
    if (phase === "show" && highlighted.includes(idx))
      return "bg-indigo-500";
    if (phase === "result") {
      const wasHighlighted = highlighted.includes(idx);
      const wasSelected = selected.includes(idx);
      if (wasHighlighted && wasSelected) return "bg-green-500";
      if (wasSelected && !wasHighlighted) return "bg-red-500";
      if (wasHighlighted && !wasSelected) return "bg-yellow-400";
    }
    if (phase === "input" && selected.includes(idx)) return "bg-indigo-400";
    return "bg-slate-200 hover:bg-slate-300";
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">视觉记忆测试</h2>
      <div className="flex gap-4 mb-4 text-sm text-slate-600">
        <span>关卡: <strong>{level}</strong></span>
        <span>得分: <strong>{score}</strong></span>
        <span>最佳: <strong>{best}</strong></span>
      </div>

      {phase === "idle" && (
        <div className="text-center py-8">
          <p className="text-slate-500 mb-4 text-sm">记住高亮的格子，然后在输入阶段点击它们</p>
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
          <p className="text-xs text-slate-400 mb-4">显示时长：{displayMs} ms</p>
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            开始
          </button>
        </div>
      )}

      {phase !== "idle" && (
        <>
          <div className="mb-3 text-sm text-slate-600 text-center">
            {phase === "show" && `记住 ${highlighted.length} 个格子的位置 (${displayMs} ms)`}
            {phase === "input" && `点击你记住的 ${highlighted.length} 个格子 (${selected.length}/${highlighted.length})`}
            {phase === "result" && (
              <span>
                {highlighted.every(c => selected.includes(c)) && selected.every(s => highlighted.includes(s))
                  ? "✅ 全部正确！"
                  : "❌ 有错误"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {Array.from({ length: GRID }, (_, i) => (
              <button
                key={i}
                onClick={() => handleCellClick(i)}
                className={`aspect-square rounded-lg transition-colors ${getCellStyle(i)} ${phase === "input" ? "cursor-pointer" : "cursor-default"}`}
              />
            ))}
          </div>

          {phase === "result" && (
            <div className="flex gap-2 justify-center text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> 正确</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500 inline-block" /> 错误</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400 inline-block" /> 漏选</span>
            </div>
          )}

          {phase === "result" && (
            <div className="flex gap-2 justify-center">
              {highlighted.every(c => selected.includes(c)) && selected.every(s => highlighted.includes(s)) ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  下一关
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  再试
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
