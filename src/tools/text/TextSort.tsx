import { useState } from 'react';

type SortMode = 'asc' | 'desc' | 'length' | 'numeric';

export default function TextSort() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeMode, setActiveMode] = useState<SortMode | null>(null);
  const [copied, setCopied] = useState(false);

  const sort = (mode: SortMode) => {
    setActiveMode(mode);
    const lines = input.split('\n').filter((l) => l.trim() !== '');
    let sorted: string[];

    switch (mode) {
      case 'asc':
        sorted = [...lines].sort((a, b) => a.localeCompare(b));
        break;
      case 'desc':
        sorted = [...lines].sort((a, b) => b.localeCompare(a));
        break;
      case 'length':
        sorted = [...lines].sort((a, b) => a.length - b.length);
        break;
      case 'numeric':
        sorted = [...lines].sort((a, b) => {
          const na = parseFloat(a) || 0;
          const nb = parseFloat(b) || 0;
          return na - nb;
        });
        break;
    }

    setOutput(sorted.join('\n'));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const modes: { key: SortMode; label: string }[] = [
    { key: 'asc', label: 'A → Z' },
    { key: 'desc', label: 'Z → A' },
    { key: 'length', label: '按长度' },
    { key: 'numeric', label: '按数值' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">文本排序</h2>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => sort(m.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeMode === m.key
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">输入</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={14}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-none"
            placeholder="每行输入一条内容..."
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-600">输出</label>
            {output && (
              <button
                onClick={copy}
                className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {copied ? '已复制 ✓' : '复制'}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            rows={14}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono bg-slate-50 resize-none"
            placeholder="排序结果..."
          />
        </div>
      </div>
    </div>
  );
}
