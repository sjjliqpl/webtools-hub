import { useState } from 'react';

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type JustifyContent = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type AlignSelf = 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch';

interface ItemProps {
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  alignSelf: AlignSelf;
}

const ITEM_COLORS = [
  'bg-indigo-200 text-indigo-700',
  'bg-pink-200 text-pink-700',
  'bg-amber-200 text-amber-700',
  'bg-emerald-200 text-emerald-700',
];

const SELECT_CLS = 'w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500';
const LABEL_CLS = 'text-xs font-medium text-slate-500 mb-1 block';

export default function FlexboxPlayground() {
  const [direction, setDirection] = useState<FlexDirection>('row');
  const [justify, setJustify] = useState<JustifyContent>('flex-start');
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch');
  const [wrap, setWrap] = useState<FlexWrap>('nowrap');
  const [gap, setGap] = useState(8);
  const [selected, setSelected] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const [items, setItems] = useState<ItemProps[]>(
    Array.from({ length: 4 }, () => ({
      flexGrow: 0,
      flexShrink: 1,
      flexBasis: 'auto',
      alignSelf: 'auto',
    }))
  );

  const updateItem = (index: number, field: keyof ItemProps, value: string | number) => {
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const containerCSS = `.container {\n  display: flex;\n  flex-direction: ${direction};\n  justify-content: ${justify};\n  align-items: ${alignItems};\n  flex-wrap: ${wrap};\n  gap: ${gap}px;\n}`;

  const selectedItemCSS =
    selected !== null
      ? `\n\n.item-${selected + 1} {\n  flex-grow: ${items[selected].flexGrow};\n  flex-shrink: ${items[selected].flexShrink};\n  flex-basis: ${items[selected].flexBasis};\n  align-self: ${items[selected].alignSelf};\n}`
      : '';

  const fullCSS = containerCSS + selectedItemCSS;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">Flexbox Playground</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Controls */}
        <div className="lg:w-72 space-y-4 shrink-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Container</p>

          <div>
            <label className={LABEL_CLS}>flex-direction</label>
            <select className={SELECT_CLS} value={direction} onChange={e => setDirection(e.target.value as FlexDirection)}>
              {['row', 'row-reverse', 'column', 'column-reverse'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>justify-content</label>
            <select className={SELECT_CLS} value={justify} onChange={e => setJustify(e.target.value as JustifyContent)}>
              {['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>align-items</label>
            <select className={SELECT_CLS} value={alignItems} onChange={e => setAlignItems(e.target.value as AlignItems)}>
              {['flex-start', 'center', 'flex-end', 'stretch', 'baseline'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>flex-wrap</label>
            <select className={SELECT_CLS} value={wrap} onChange={e => setWrap(e.target.value as FlexWrap)}>
              {['nowrap', 'wrap', 'wrap-reverse'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>gap: {gap}px</label>
            <input type="range" min={0} max={40} value={gap} onChange={e => setGap(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>

          {selected !== null && (
            <>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-2 border-t border-slate-100">Item {selected + 1}</p>
              <div>
                <label className={LABEL_CLS}>flex-grow (0–5)</label>
                <input type="number" min={0} max={5} className={SELECT_CLS} value={items[selected].flexGrow}
                  onChange={e => updateItem(selected, 'flexGrow', Number(e.target.value))} />
              </div>
              <div>
                <label className={LABEL_CLS}>flex-shrink (0–5)</label>
                <input type="number" min={0} max={5} className={SELECT_CLS} value={items[selected].flexShrink}
                  onChange={e => updateItem(selected, 'flexShrink', Number(e.target.value))} />
              </div>
              <div>
                <label className={LABEL_CLS}>flex-basis</label>
                <input type="text" className={SELECT_CLS} value={items[selected].flexBasis}
                  onChange={e => updateItem(selected, 'flexBasis', e.target.value)} />
              </div>
              <div>
                <label className={LABEL_CLS}>align-self</label>
                <select className={SELECT_CLS} value={items[selected].alignSelf}
                  onChange={e => updateItem(selected, 'alignSelf', e.target.value as AlignSelf)}>
                  {['auto', 'flex-start', 'center', 'flex-end', 'stretch'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Preview + CSS */}
        <div className="flex-1 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Preview <span className="normal-case font-normal">(click a box to select)</span></p>
          <div
            className="border-2 border-dashed border-indigo-300 rounded-xl p-4 min-h-[160px]"
            style={{ display: 'flex', flexDirection: direction, justifyContent: justify, alignItems, flexWrap: wrap, gap }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                onClick={() => setSelected(selected === i ? null : i)}
                className={`rounded-lg px-5 py-4 font-bold text-sm cursor-pointer transition-all select-none ${ITEM_COLORS[i]} ${selected === i ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`}
                style={{
                  flexGrow: item.flexGrow,
                  flexShrink: item.flexShrink,
                  flexBasis: item.flexBasis,
                  alignSelf: item.alignSelf,
                  minWidth: 40,
                  minHeight: 40,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Generated CSS</span>
            <button onClick={handleCopy} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-slate-900 text-green-400 rounded-xl p-4 text-sm font-mono break-all whitespace-pre-wrap">{fullCSS}</pre>
        </div>
      </div>
    </div>
  );
}
