import { useState, useEffect, useCallback } from "react";

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (sn === 0) {
    r = g = b = ln;
  } else {
    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
    const p = 2 * ln - q;
    const hn = h / 360;
    r = hue2rgb(p, q, hn + 1 / 3);
    g = hue2rgb(p, q, hn);
    b = hue2rgb(p, q, hn - 1 / 3);
  }
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generatePalette(): string[] {
  const baseHue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.floor(Math.random() * 20);
  const lightness = 55 + Math.floor(Math.random() * 15);
  return Array.from({ length: 5 }, (_, i) => {
    const hue = (baseHue + i * 72 + Math.floor(Math.random() * 20 - 10)) % 360;
    return hslToHex(hue, saturation, lightness);
  });
}

export default function PaletteGenerator() {
  const [colors, setColors] = useState<string[]>(generatePalette);
  const [toast, setToast] = useState("");

  const generate = useCallback(() => setColors(generatePalette()), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate]);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setToast(hex);
    setTimeout(() => setToast(""), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">调色板生成器</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">按空格键生成</span>
          <button
            onClick={generate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            生成调色板
          </button>
        </div>
      </div>

      <div className="flex gap-3 h-64 relative">
        {colors.map((color, i) => (
          <button
            key={`${color}-${i}`}
            className="flex-1 rounded-2xl flex items-end justify-center pb-4 transition-transform hover:scale-[1.02] cursor-pointer border-0"
            style={{ backgroundColor: color }}
            onClick={() => copyColor(color)}
            title="点击复制"
          >
            <span className="bg-black/30 text-white text-xs font-mono px-3 py-1.5 rounded-lg backdrop-blur-sm">
              {color.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-sm px-4 py-2 rounded-xl shadow-lg animate-pulse z-50">
          已复制 {toast}
        </div>
      )}
    </div>
  );
}
