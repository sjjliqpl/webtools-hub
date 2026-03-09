import { useState } from "react";

const PRESETS = [10, 15, 20, 25];

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPct, setTipPct] = useState("15");
  const [people, setPeople] = useState("1");

  const billNum = parseFloat(bill) || 0;
  const tipNum = parseFloat(tipPct) || 0;
  const peopleNum = Math.max(parseInt(people) || 1, 1);

  const tipAmount = billNum * (tipNum / 100);
  const total = billNum + tipAmount;
  const perPerson = total / peopleNum;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">小费计算器</h2>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">账单金额</label>
          <input
            type="number"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            placeholder="请输入账单金额"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">小费比例 (%)</label>
          <input
            type="number"
            value={tipPct}
            onChange={(e) => setTipPct(e.target.value)}
            placeholder="小费百分比"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <div className="flex gap-2 mt-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setTipPct(String(p))}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tipPct === String(p)
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">用餐人数</label>
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            min="1"
            placeholder="人数"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5">
        <div className="bg-indigo-50 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">小费</p>
          <p className="text-lg font-bold text-slate-800">{tipAmount.toFixed(2)}</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">总计</p>
          <p className="text-lg font-bold text-slate-800">{total.toFixed(2)}</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">每人</p>
          <p className="text-lg font-bold text-slate-800">{perPerson.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
