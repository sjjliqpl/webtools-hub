import { useState } from "react";

export default function RandomNumber() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("5");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const lo = parseInt(min);
    const hi = parseInt(max);
    const n = parseInt(count);

    if (isNaN(lo) || isNaN(hi) || isNaN(n)) {
      setError("请输入有效的数字");
      return;
    }
    if (lo > hi) {
      setError("最小值不能大于最大值");
      return;
    }
    if (n <= 0) {
      setError("生成数量必须大于 0");
      return;
    }
    if (!allowDuplicates && n > hi - lo + 1) {
      setError(`不允许重复时，最多生成 ${hi - lo + 1} 个数字`);
      return;
    }

    setError("");

    if (allowDuplicates) {
      const nums = Array.from({ length: n }, () =>
        Math.floor(Math.random() * (hi - lo + 1)) + lo
      );
      setResults(nums);
    } else {
      const pool = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      setResults(pool.slice(0, n));
    }
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(results.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-5">随机数生成器</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">最小值</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">最大值</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">生成数量</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={allowDuplicates}
            onChange={(e) => setAllowDuplicates(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
          />
          允许重复
        </label>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</div>
        )}
        <button
          onClick={generate}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
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
              className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              {copied ? "已复制 ✓" : "复制全部"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.map((num, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-medium"
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
