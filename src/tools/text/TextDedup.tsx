import { useState } from 'react';

export default function TextDedup() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [removedCount, setRemovedCount] = useState(0);

  const deduplicate = () => {
    const lines = input.split('\n');
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    }

    setOutput(unique.join('\n'));
    setRemovedCount(lines.length - unique.length);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">文本去重</h2>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={deduplicate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          去重
        </button>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded"
          />
          区分大小写
        </label>
        {removedCount > 0 && (
          <span className="text-sm text-slate-500">
            移除了 <span className="font-semibold text-indigo-600">{removedCount}</span> 行重复内容
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">输入（每行一条）</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={14}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-none"
            placeholder="每行输入一条内容..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">输出（去重结果）</label>
          <textarea
            value={output}
            readOnly
            rows={14}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono bg-slate-50 resize-none"
            placeholder="去重后的结果..."
          />
        </div>
      </div>
    </div>
  );
}
