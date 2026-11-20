import { copyText } from '../../lib/clipboard';
import { useState } from "react";
import { randomIntegers } from "../../lib/toolMath";

export default function RandomNumber() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("5");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    try {
      setResults(randomIntegers(min.trim() ? Number(min) : NaN, max.trim() ? Number(max) : NaN, Number(count), allowDuplicates));
      setError("");
    } catch (cause) { setError((cause as Error).message); setResults([]); }
  };

  const copyAll = async () => {
    if (!await copyText(results.join(", "))) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tool-surface">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">最小值</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">最大值</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">生成数量</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={allowDuplicates}
            onChange={(e) => setAllowDuplicates(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
          />
          允许重复
        </label>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-md px-4 py-2">{error}</div>
        )}
        <button
          onClick={generate}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          生成
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">
              结果 ({results.length} 个)
            </span>
            <button
              onClick={copyAll}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              {copied ? "已复制 ✓" : "复制全部"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.map((num, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium"
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
