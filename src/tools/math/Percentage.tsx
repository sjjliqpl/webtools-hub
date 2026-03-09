import { useState } from "react";

const TABS = [
  "A 是 B 的百分之几？",
  "A 的 B% 是多少？",
  "A 增加/减少 B% 是多少？",
] as const;

export default function Percentage() {
  const [tab, setTab] = useState(0);
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const aNum = parseFloat(a) || 0;
  const bNum = parseFloat(b) || 0;

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

  const renderResult = () => {
    if (!a || !b) return null;

    if (tab === 0) {
      const result = bNum !== 0 ? ((aNum / bNum) * 100).toFixed(2) : "—";
      return (
        <div className="bg-indigo-50 rounded-xl p-4 text-center">
          <p className="text-sm text-slate-500 mb-1">结果</p>
          <p className="text-2xl font-bold text-slate-800">{result}%</p>
          <p className="text-xs text-slate-400 mt-1">
            {aNum} 是 {bNum} 的 {result}%
          </p>
        </div>
      );
    }

    if (tab === 1) {
      const result = ((aNum * bNum) / 100).toFixed(2);
      return (
        <div className="bg-indigo-50 rounded-xl p-4 text-center">
          <p className="text-sm text-slate-500 mb-1">结果</p>
          <p className="text-2xl font-bold text-slate-800">{result}</p>
          <p className="text-xs text-slate-400 mt-1">
            {aNum} 的 {bNum}% 是 {result}
          </p>
        </div>
      );
    }

    const increase = (aNum * (1 + bNum / 100)).toFixed(2);
    const decrease = (aNum * (1 - bNum / 100)).toFixed(2);
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-sm text-slate-500 mb-1">增加 {bNum}%</p>
          <p className="text-2xl font-bold text-green-600">{increase}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-sm text-slate-500 mb-1">减少 {bNum}%</p>
          <p className="text-2xl font-bold text-red-600">{decrease}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">百分比计算器</h2>

      <div className="flex gap-4 border-b border-slate-200 mb-5">
        {TABS.map((label, i) => (
          <button
            key={i}
            onClick={() => {
              setTab(i);
              setA("");
              setB("");
            }}
            className={`text-sm whitespace-nowrap ${
              tab === i
                ? "border-b-2 border-indigo-600 text-indigo-600 pb-2"
                : "text-slate-500 pb-2 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3 mb-5">
        <div>
          <label className="block text-sm text-slate-600 mb-1">
            {tab === 0 ? "A 的值" : "A 的值"}
          </label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="请输入 A"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">
            {tab === 0 ? "B 的值" : "B 的百分比 (%)"}
          </label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder={tab === 0 ? "请输入 B" : "请输入百分比"}
            className={inputClass}
          />
        </div>
      </div>

      {renderResult()}
    </div>
  );
}
