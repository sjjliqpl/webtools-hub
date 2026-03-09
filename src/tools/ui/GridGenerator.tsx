import { useState } from 'react';

const LABEL_CLS = 'text-xs font-medium text-slate-500 mb-1 block';
const INPUT_CLS = 'w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500';

export default function GridGenerator() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [colGap, setColGap] = useState(8);
  const [rowGap, setRowGap] = useState(8);
  const [templateCols, setTemplateCols] = useState('repeat(3, 1fr)');
  const [templateRows, setTemplateRows] = useState('auto');
  const [copied, setCopied] = useState(false);

  const totalCells = cols * rows;

  const css = `.grid-container {\n  display: grid;\n  grid-template-columns: ${templateCols};\n  grid-template-rows: ${templateRows};\n  column-gap: ${colGap}px;\n  row-gap: ${rowGap}px;\n}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CELL_COLORS = [
    '#e0e7ff', '#fce7f3', '#fef3c7', '#d1fae5',
    '#dbeafe', '#ede9fe', '#ffedd5', '#f0fdf4',
    '#f1f5f9', '#fdf2f8', '#ecfdf5', '#fffbeb',
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">CSS Grid Builder</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className={LABEL_CLS}>Columns (1–12)</label>
          <input
            type="number" min={1} max={12} value={cols} className={INPUT_CLS}
            onChange={e => {
              const v = Math.min(12, Math.max(1, Number(e.target.value)));
              setCols(v);
              setTemplateCols(`repeat(${v}, 1fr)`);
            }}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Rows (1–6)</label>
          <input
            type="number" min={1} max={6} value={rows} className={INPUT_CLS}
            onChange={e => setRows(Math.min(6, Math.max(1, Number(e.target.value))))}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Column gap: {colGap}px</label>
          <input type="range" min={0} max={40} value={colGap} onChange={e => setColGap(Number(e.target.value))} className="w-full accent-indigo-600 mt-1" />
        </div>
        <div>
          <label className={LABEL_CLS}>Row gap: {rowGap}px</label>
          <input type="range" min={0} max={40} value={rowGap} onChange={e => setRowGap(Number(e.target.value))} className="w-full accent-indigo-600 mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>grid-template-columns</label>
          <input type="text" className={INPUT_CLS} value={templateCols} onChange={e => setTemplateCols(e.target.value)} />
        </div>
        <div>
          <label className={LABEL_CLS}>grid-template-rows</label>
          <input type="text" className={INPUT_CLS} value={templateRows} onChange={e => setTemplateRows(e.target.value)} />
        </div>
      </div>

      {/* Preview */}
      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">Preview</p>
        <div
          className="border-2 border-dashed border-indigo-300 rounded-xl p-4"
          style={{
            display: 'grid',
            gridTemplateColumns: templateCols,
            gridTemplateRows: templateRows,
            columnGap: colGap,
            rowGap: rowGap,
          }}
        >
          {Array.from({ length: totalCells }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg flex items-center justify-center text-sm font-semibold text-slate-600 min-h-[48px]"
              style={{ backgroundColor: CELL_COLORS[i % CELL_COLORS.length] }}
            >
              {i + 1}
            </div>
          ))}
        </div>
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
  );
}
