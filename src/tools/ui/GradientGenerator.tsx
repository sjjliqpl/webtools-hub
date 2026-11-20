import { copyText } from '../../lib/clipboard';
import { useState } from 'react';

interface Stop {
  color: string;
  position: number;
}

export default function GradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { color: '#6366f1', position: 0 },
    { color: '#ec4899', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const stopsCSS = stops
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');

  const css =
    type === 'linear'
      ? `background: linear-gradient(${angle}deg, ${stopsCSS});`
      : `background: radial-gradient(circle, ${stopsCSS});`;

  const gradientValue =
    type === 'linear'
      ? `linear-gradient(${angle}deg, ${stopsCSS})`
      : `radial-gradient(circle, ${stopsCSS})`;

  const updateStop = (index: number, field: keyof Stop, value: string | number) => {
    setStops(prev => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addStop = () => {
    setStops(prev => [...prev, { color: '#a855f7', position: 50 }]);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(prev => prev.filter((_, i) => i !== index));
  };

  const handleCopy = async () => {
    if (!await copyText(css)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-surface space-y-6">
      {/* Type tabs */}
      <div className="flex gap-6 border-b border-slate-200">
        {(['linear', 'radial'] as const).map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={
              type === t
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium pb-2 capitalize'
                : 'pb-2 text-slate-500 capitalize hover:text-slate-700'
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Angle (linear only) */}
      {type === 'linear' && (
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">
            Angle: {angle}°
          </label>
          <input
            type="range"
            min={0}
            max={360}
            value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      )}

      {/* Color stops */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Color Stops</span>
          <button
            onClick={addStop}
            className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            + Add Stop
          </button>
        </div>
        {stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              type="color"
              value={stop.color}
              onChange={e => updateStop(i, 'color', e.target.value)}
              className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
            />
            <div className="flex-1 space-y-1">
              <span className="text-xs text-slate-400">{stop.position}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={stop.position}
                onChange={e => updateStop(i, 'position', Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
            <button
              onClick={() => removeStop(i)}
              disabled={stops.length <= 2}
              className="text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div
        className="rounded-md w-full"
        style={{ minHeight: 200, background: gradientValue }}
      />

      {/* Generated CSS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">生成的 CSS</span>
          <button onClick={handleCopy} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            {copied ? '已复制' : '复制'}
          </button>
        </div>
        <pre className="bg-slate-900 text-green-400 rounded-md p-4 text-sm font-mono break-all whitespace-pre-wrap">{css}</pre>
      </div>
    </div>
  );
}
