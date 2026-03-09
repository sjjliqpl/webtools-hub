import { useState } from 'react';

type Unit = 'px' | 'rem' | 'em' | 'vw' | 'vh' | 'pt' | 'pc';

const UNITS: Unit[] = ['px', 'rem', 'em', 'vw', 'vh', 'pt', 'pc'];

interface ConversionResult {
  unit: Unit;
  value: number;
}

function convert(value: number, from: Unit, baseFontSize: number, vw: number, vh: number): ConversionResult[] {
  // Convert input to px first
  let px: number;
  switch (from) {
    case 'px':  px = value; break;
    case 'rem': px = value * baseFontSize; break;
    case 'em':  px = value * baseFontSize; break;
    case 'vw':  px = (value / 100) * vw; break;
    case 'vh':  px = (value / 100) * vh; break;
    case 'pt':  px = value * (96 / 72); break;
    case 'pc':  px = value * 16; break;
    default:    px = value;
  }

  return UNITS.map(unit => {
    let converted: number;
    switch (unit) {
      case 'px':  converted = px; break;
      case 'rem': converted = px / baseFontSize; break;
      case 'em':  converted = px / baseFontSize; break;
      case 'vw':  converted = (px / vw) * 100; break;
      case 'vh':  converted = (px / vh) * 100; break;
      case 'pt':  converted = px * (72 / 96); break;
      case 'pc':  converted = px / 16; break;
      default:    converted = px;
    }
    return { unit, value: converted };
  });
}

const LABEL_CLS = 'text-xs font-medium text-slate-500 mb-1 block';
const INPUT_CLS = 'w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500';

export default function CssUnitConverter() {
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [viewportW, setViewportW] = useState(1440);
  const [viewportH, setViewportH] = useState(900);
  const [inputValue, setInputValue] = useState(16);
  const [inputUnit, setInputUnit] = useState<Unit>('px');
  const [copiedUnit, setCopiedUnit] = useState<Unit | null>(null);

  const results = convert(inputValue, inputUnit, baseFontSize, viewportW, viewportH);

  const handleCopy = (unit: Unit, value: number) => {
    navigator.clipboard.writeText(`${value.toFixed(4)}${unit}`);
    setCopiedUnit(unit);
    setTimeout(() => setCopiedUnit(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">CSS Unit Converter</h2>

      {/* Config */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
        <div>
          <label className={LABEL_CLS}>Base font size (px)</label>
          <input type="number" min={1} className={INPUT_CLS} value={baseFontSize}
            onChange={e => setBaseFontSize(Math.max(1, Number(e.target.value)))} />
        </div>
        <div>
          <label className={LABEL_CLS}>Viewport width (px)</label>
          <input type="number" min={1} className={INPUT_CLS} value={viewportW}
            onChange={e => setViewportW(Math.max(1, Number(e.target.value)))} />
        </div>
        <div>
          <label className={LABEL_CLS}>Viewport height (px)</label>
          <input type="number" min={1} className={INPUT_CLS} value={viewportH}
            onChange={e => setViewportH(Math.max(1, Number(e.target.value)))} />
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className={LABEL_CLS}>Value</label>
          <input type="number" step="any" className={INPUT_CLS} value={inputValue}
            onChange={e => setInputValue(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="w-28">
          <label className={LABEL_CLS}>Unit</label>
          <select className={INPUT_CLS} value={inputUnit} onChange={e => setInputUnit(e.target.value as Unit)}>
            {UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {results.map(({ unit, value }) => (
          <div key={unit} className="bg-slate-50 rounded-xl p-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{unit}</span>
            <span className="text-base font-mono font-medium text-slate-800 break-all">
              {value.toFixed(4)}
            </span>
            <button
              onClick={() => handleCopy(unit, value)}
              className="mt-auto text-xs px-2 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors font-medium"
            >
              {copiedUnit === unit ? 'Copied!' : 'Copy'}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400">
        Note: <code className="font-mono">em</code> conversions use base font size (same as rem). For true em, multiply by the element's inherited font size.
      </p>
    </div>
  );
}
