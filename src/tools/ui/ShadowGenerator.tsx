import { useState } from "react";

export default function ShadowGenerator() {
  const [offsetX, setOffsetX] = useState(4);
  const [offsetY, setOffsetY] = useState(4);
  const [blur, setBlur] = useState(16);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#6366f1");
  const [opacity, setOpacity] = useState(0.4);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const hexToRgba = (hex: string, a: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const shadowValue = `${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;
  const cssCode = `box-shadow: ${shadowValue};`;

  const copy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sliders: { label: string; value: number; min: number; max: number; set: (v: number) => void }[] = [
    { label: "X 偏移", value: offsetX, min: -50, max: 50, set: setOffsetX },
    { label: "Y 偏移", value: offsetY, min: -50, max: 50, set: setOffsetY },
    { label: "模糊", value: blur, min: 0, max: 100, set: setBlur },
    { label: "扩展", value: spread, min: 0, max: 50, set: setSpread },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">Box Shadow 生成器</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Preview */}
        <div className="flex-1 flex items-center justify-center min-h-[280px] bg-slate-50 rounded-2xl">
          <div
            className="w-40 h-40 bg-white rounded-2xl transition-shadow duration-200"
            style={{ boxShadow: shadowValue }}
          />
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-4">
          {sliders.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>{s.label}</span>
                <span className="font-mono text-slate-400">{s.value}px</span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          ))}

          {/* Opacity */}
          <div>
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>不透明度</span>
              <span className="font-mono text-slate-400">{opacity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Color & Inset */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">颜色</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              Inset
            </label>
          </div>
        </div>
      </div>

      {/* Code Output */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">CSS 代码</span>
          <button onClick={copy} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            {copied ? "已复制" : "复制"}
          </button>
        </div>
        <div className="bg-slate-800 text-green-400 rounded-xl p-4 text-sm font-mono">
          {cssCode}
        </div>
      </div>
    </div>
  );
}
