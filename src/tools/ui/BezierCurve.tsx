import { useState, useRef, useCallback, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

const PRESETS: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
};

const SVG_SIZE = 250;
const PAD = 24;
const PLOT = SVG_SIZE - PAD * 2;

function toSVG(nx: number, ny: number): Point {
  return { x: PAD + nx * PLOT, y: PAD + (1 - ny) * PLOT };
}

function fromSVG(sx: number, sy: number): Point {
  return {
    x: Math.min(1, Math.max(0, (sx - PAD) / PLOT)),
    y: (PAD + PLOT - sy) / PLOT,
  };
}

export default function BezierCurve() {
  const [p1, setP1] = useState<Point>({ x: 0.25, y: 0.1 });
  const [p2, setP2] = useState<Point>({ x: 0.25, y: 1 });
  const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null);
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  const css = `transition: all 0.6s cubic-bezier(${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}, ${p2.x.toFixed(2)}, ${p2.y.toFixed(2)});`;

  const p0svg = toSVG(0, 0);
  const p3svg = toSVG(1, 1);
  const p1svg = toSVG(p1.x, p1.y);
  const p2svg = toSVG(p2.x, p2.y);

  const pathD = `M ${p0svg.x} ${p0svg.y} C ${p1svg.x} ${p1svg.y}, ${p2svg.x} ${p2svg.y}, ${p3svg.x} ${p3svg.y}`;

  const getSVGPoint = useCallback((e: MouseEvent | React.MouseEvent): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * SVG_SIZE,
      y: ((e.clientY - rect.top) / rect.height) * SVG_SIZE,
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const svgPt = getSVGPoint(e);
    const norm = fromSVG(svgPt.x, svgPt.y);
    if (dragging === 'p1') setP1({ x: Math.min(1, Math.max(0, norm.x)), y: Math.min(2, Math.max(-1, norm.y)) });
    else setP2({ x: Math.min(1, Math.max(0, norm.x)), y: Math.min(2, Math.max(-1, norm.y)) });
  }, [dragging, getSVGPoint]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  const applyPreset = (name: string) => {
    const [p1x, p1y, p2x, p2y] = PRESETS[name];
    setP1({ x: p1x, y: p1y });
    setP2({ x: p2x, y: p2y });
  };

  const handlePlay = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 1400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const numInput = (label: string, val: number, min: number, max: number, onChange: (v: number) => void) => (
    <div>
      <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
      <input
        type="number" step={0.01} min={min} max={max} value={val.toFixed(2)}
        onChange={e => onChange(Math.min(max, Math.max(min, parseFloat(e.target.value) || 0)))}
        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">CSS Cubic-Bezier Editor</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* SVG + presets */}
        <div className="space-y-4">
          <svg
            ref={svgRef}
            width={SVG_SIZE}
            height={SVG_SIZE}
            className="bg-slate-50 rounded-xl border border-slate-200 cursor-crosshair"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(v => {
              const { x: gx, y: gy } = toSVG(v, v);
              return (
                <g key={v}>
                  <line x1={gx} y1={PAD} x2={gx} y2={PAD + PLOT} stroke="#e2e8f0" strokeWidth={1} />
                  <line x1={PAD} y1={gy} x2={PAD + PLOT} y2={gy} stroke="#e2e8f0" strokeWidth={1} />
                </g>
              );
            })}
            {/* Diagonal reference */}
            <line x1={p0svg.x} y1={p0svg.y} x2={p3svg.x} y2={p3svg.y} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 3" />
            {/* Handle lines */}
            <line x1={p0svg.x} y1={p0svg.y} x2={p1svg.x} y2={p1svg.y} stroke="#a5b4fc" strokeWidth={1.5} />
            <line x1={p3svg.x} y1={p3svg.y} x2={p2svg.x} y2={p2svg.y} stroke="#f9a8d4" strokeWidth={1.5} />
            {/* Curve */}
            <path d={pathD} fill="none" stroke="#6366f1" strokeWidth={2.5} strokeLinecap="round" />
            {/* Fixed endpoints */}
            <circle cx={p0svg.x} cy={p0svg.y} r={5} fill="#94a3b8" />
            <circle cx={p3svg.x} cy={p3svg.y} r={5} fill="#94a3b8" />
            {/* Draggable P1 */}
            <circle
              cx={p1svg.x} cy={p1svg.y} r={7} fill="#6366f1" stroke="white" strokeWidth={2}
              style={{ cursor: 'grab' }}
              onMouseDown={e => { e.preventDefault(); setDragging('p1'); }}
            />
            {/* Draggable P2 */}
            <circle
              cx={p2svg.x} cy={p2svg.y} r={7} fill="#ec4899" stroke="white" strokeWidth={2}
              style={{ cursor: 'grab' }}
              onMouseDown={e => { e.preventDefault(); setDragging('p2'); }}
            />
          </svg>

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(PRESETS).map(name => (
              <button
                key={name}
                onClick={() => applyPreset(name)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {numInput('P1 X (0–1)', p1.x, 0, 1, x => setP1(prev => ({ ...prev, x })))}
            {numInput('P1 Y (−1–2)', p1.y, -1, 2, y => setP1(prev => ({ ...prev, y })))}
            {numInput('P2 X (0–1)', p2.x, 0, 1, x => setP2(prev => ({ ...prev, x })))}
            {numInput('P2 Y (−1–2)', p2.y, -1, 2, y => setP2(prev => ({ ...prev, y })))}
          </div>

          {/* Animation preview */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Preview Animation</p>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 h-16 relative overflow-hidden flex items-center">
              <div
                ref={ballRef}
                className="w-8 h-8 rounded-full bg-indigo-500 shadow absolute"
                style={{
                  left: animating ? 'calc(100% - 48px)' : '8px',
                  transition: animating
                    ? `left 0.6s cubic-bezier(${p1.x}, ${p1.y}, ${p2.x}, ${p2.y})`
                    : 'none',
                }}
              />
            </div>
            <button
              onClick={handlePlay}
              disabled={animating}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {animating ? 'Playing…' : '▶ Play'}
            </button>
          </div>

          {/* CSS output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Generated CSS</span>
              <button onClick={handleCopy} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-900 text-green-400 rounded-xl p-4 text-sm font-mono break-all whitespace-pre-wrap">{css}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
