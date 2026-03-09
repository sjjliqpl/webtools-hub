import { useState, useCallback } from "react";

interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string): RGB | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100, ln = l / 100;
  if (sn === 0) { const v = Math.round(ln * 255); return { r: v, g: v, b: v }; }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hn = h / 360;
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

export default function ColorConverter() {
  const [rgb, setRgb] = useState<RGB>({ r: 99, g: 102, b: 241 });
  const [hexInput, setHexInput] = useState(rgbToHex({ r: 99, g: 102, b: 241 }));
  const [copied, setCopied] = useState("");

  const hsl = rgbToHsl(rgb);
  const hex = rgbToHex(rgb);

  const updateFromHex = useCallback((value: string) => {
    setHexInput(value);
    const parsed = hexToRgb(value);
    if (parsed) setRgb(parsed);
  }, []);

  const updateFromRgb = useCallback((field: keyof RGB, value: number) => {
    const next = { ...rgb, [field]: clamp(value, 0, 255) };
    setRgb(next);
    setHexInput(rgbToHex(next));
  }, [rgb]);

  const updateFromHsl = useCallback((field: keyof HSL, value: number) => {
    const maxVal = field === "h" ? 360 : 100;
    const next: HSL = { ...hsl, [field]: clamp(value, 0, maxVal) };
    const newRgb = hslToRgb(next);
    setRgb(newRgb);
    setHexInput(rgbToHex(newRgb));
  }, [hsl]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const inputClass = "rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-full";
  const copyBtn = "px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors";

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">颜色格式转换器</h2>

      <div className="flex flex-col sm:flex-row gap-6">
        <div
          className="w-full sm:w-40 h-40 rounded-2xl border border-slate-200 shrink-0"
          style={{ backgroundColor: hex }}
        />

        <div className="flex-1 space-y-4">
          {/* HEX */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">HEX</label>
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={hexInput}
                onChange={(e) => updateFromHex(e.target.value)}
                maxLength={7}
              />
              <button className={copyBtn} onClick={() => copy(hex, "hex")}>
                {copied === "hex" ? "已复制" : "复制"}
              </button>
            </div>
          </div>

          {/* RGB */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">RGB</label>
            <div className="flex gap-2">
              {(["r", "g", "b"] as const).map((ch) => (
                <input
                  key={ch}
                  type="number"
                  min={0}
                  max={255}
                  className={inputClass}
                  placeholder={ch.toUpperCase()}
                  value={rgb[ch]}
                  onChange={(e) => updateFromRgb(ch, Number(e.target.value))}
                />
              ))}
              <button
                className={copyBtn}
                onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "rgb")}
              >
                {copied === "rgb" ? "已复制" : "复制"}
              </button>
            </div>
          </div>

          {/* HSL */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">HSL</label>
            <div className="flex gap-2">
              {(["h", "s", "l"] as const).map((ch) => (
                <input
                  key={ch}
                  type="number"
                  min={0}
                  max={ch === "h" ? 360 : 100}
                  className={inputClass}
                  placeholder={ch.toUpperCase()}
                  value={hsl[ch]}
                  onChange={(e) => updateFromHsl(ch, Number(e.target.value))}
                />
              ))}
              <button
                className={copyBtn}
                onClick={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "hsl")}
              >
                {copied === "hsl" ? "已复制" : "复制"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
