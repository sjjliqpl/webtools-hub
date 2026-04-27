import { useState, useRef, useEffect, useCallback } from "react";

type Row = number[];
type Digit = Row[];

const DIGITS: Record<string, Digit> = {
  '0': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,1,1],[1,0,1,0,1],[1,1,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '1': [[0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
  '2': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,1]],
  '3': [[1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,0]],
  '4': [[0,0,0,1,0],[0,0,1,1,0],[0,1,0,1,0],[1,0,0,1,0],[1,1,1,1,1],[0,0,0,1,0],[0,0,0,1,0]],
  '5': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '6': [[0,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '7': [[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0]],
  '8': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '9': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0]],
};

interface Plate {
  answer: string;
  fg: [number, number, number];
  bg: [number, number, number];
}

const PLATES: Plate[] = [
  { answer: "12", fg: [220, 80, 80],  bg: [80, 160, 80]  },
  { answer: "8",  fg: [220, 140, 60], bg: [140, 100, 60] },
  { answer: "5",  fg: [60, 180, 60],  bg: [180, 80, 80]  },
  { answer: "29", fg: [160, 80, 180], bg: [80, 160, 80]  },
  { answer: "74", fg: [220, 80, 80],  bg: [140, 140, 140]},
  { answer: "3",  fg: [60, 180, 60],  bg: [180, 80, 80]  },
];

function rnd(offset: number) {
  return Math.round((Math.random() - 0.5) * 2 * offset);
}

function clamp(v: number) { return Math.max(0, Math.min(255, v)); }

function isOnDigit(x: number, y: number, answer: string, canvasW: number, canvasH: number): boolean {
  const chars = answer.split("");
  const digitW = 200;
  const digitH = 280;
  const totalW = chars.length === 2 ? digitW * 2 + 20 : digitW;
  const startX = (canvasW - totalW) / 2;
  const startY = (canvasH - digitH) / 2;

  for (let ci = 0; ci < chars.length; ci++) {
    const bitmap = DIGITS[chars[ci]];
    if (!bitmap) continue;
    const offsetX = startX + ci * (digitW + 20);
    const cellW = digitW / 5;
    const cellH = digitH / 7;
    const col = Math.floor((x - offsetX) / cellW);
    const row = Math.floor((y - startY) / cellH);
    if (col >= 0 && col < 5 && row >= 0 && row < 7) {
      if (bitmap[row][col] === 1) return true;
    }
  }
  return false;
}

function drawPlate(canvas: HTMLCanvasElement, plate: Plate) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  ctx.fillStyle = "#e8e8e8";
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 4 + Math.random() * 8;
    const onDigit = isOnDigit(x, y, plate.answer, W, H);
    const base = onDigit ? plate.fg : plate.bg;
    const offset = 30;
    const color = `rgb(${clamp(base[0] + rnd(offset))},${clamp(base[1] + rnd(offset))},${clamp(base[2] + rnd(offset))})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

export default function ColorBlindTest() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCurrent = useCallback(() => {
    if (canvasRef.current) {
      drawPlate(canvasRef.current, PLATES[current]);
    }
  }, [current]);

  useEffect(() => {
    drawCurrent();
  }, [drawCurrent]);

  const handleNext = () => {
    const next = [...answers, input.trim()];
    setAnswers(next);
    setInput("");
    if (current + 1 >= PLATES.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setAnswers([]);
    setInput("");
    setDone(false);
  };

  const correctCount = done
    ? answers.filter((a, i) => a === PLATES[i].answer).length
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">色盲检测</h2>

      {!done ? (
        <>
          <p className="text-sm text-slate-600 mb-3">第 {current + 1} / {PLATES.length} 张：图中有什么数字？</p>
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="rounded-xl border border-slate-200 mb-4 mx-auto block"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && input.length > 0 && handleNext()}
              placeholder="输入你看到的数字"
              className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              autoFocus
            />
            <button
              onClick={handleNext}
              disabled={input.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              下一张
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="text-4xl mb-3">{correctCount === PLATES.length ? "🌈" : "👁️"}</div>
          <p className="text-xl font-bold text-slate-800 mb-1">{correctCount} / {PLATES.length}</p>
          <p className={`text-sm font-medium mb-4 ${correctCount === PLATES.length ? "text-green-600" : "text-orange-500"}`}>
            {correctCount === PLATES.length ? "全部正确！色觉正常" : "可能有色觉偏差"}
          </p>
          <div className="text-left mb-4 space-y-1">
            {PLATES.map((p, i) => {
              const correct = answers[i] === p.answer;
              return (
                <div key={i} className={`flex justify-between text-sm px-3 py-1.5 rounded-lg ${correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  <span>第 {i + 1} 张: 答案 <strong>{p.answer}</strong></span>
                  <span>你答: <strong>{answers[i] || "未填"}</strong> {correct ? "✓" : "✗"}</span>
                </div>
              );
            })}
          </div>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            再次测试
          </button>
        </div>
      )}
    </div>
  );
}
