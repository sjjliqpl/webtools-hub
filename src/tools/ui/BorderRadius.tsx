import { useState } from "react";

export default function BorderRadius() {
  const [corners, setCorners] = useState([20, 20, 20, 20]);
  const [linked, setLinked] = useState(true);
  const [unit, setUnit] = useState<"px" | "%">("px");
  const [copied, setCopied] = useState(false);

  const labels = ["左上", "右上", "右下", "左下"];

  const updateCorner = (index: number, value: number) => {
    const v = Math.max(0, Math.min(100, value));
    if (linked) {
      setCorners([v, v, v, v]);
    } else {
      setCorners((prev) => prev.map((c, i) => (i === index ? v : c)));
    }
  };

  const allSame = corners.every((c) => c === corners[0]);
  const radiusValue = allSame
    ? `${corners[0]}${unit}`
    : corners.map((c) => `${c}${unit}`).join(" ");
  const cssCode = `border-radius: ${radiusValue};`;

  const copy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">Border Radius 生成器</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Preview */}
        <div className="flex-1 flex items-center justify-center min-h-[280px] bg-slate-50 rounded-2xl">
          <div
            className="w-40 h-40 bg-indigo-500 transition-all duration-200"
            style={{
              borderRadius: corners.map((c) => `${c}${unit}`).join(" "),
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-4">
          {/* Link toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={linked}
              onChange={(e) => {
                setLinked(e.target.checked);
                if (e.target.checked) setCorners([corners[0], corners[0], corners[0], corners[0]]);
              }}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-sm text-slate-600">链接所有角</span>
          </label>

          {/* Unit toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">单位：</span>
            {(["px", "%"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  unit === u
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Sliders */}
          {corners.map((val, i) => (
            <div key={labels[i]}>
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>{labels[i]}</span>
                <span className="font-mono text-slate-400">
                  {val}{unit}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={val}
                onChange={(e) => updateCorner(i, Number(e.target.value))}
                className="w-full accent-indigo-600"
                disabled={linked && i > 0}
              />
            </div>
          ))}
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
