import { useState } from "react";

interface MortgageResult {
  monthly: number;
  totalPayment: number;
  totalInterest: number;
}

export default function Mortgage() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const P = parseFloat(principal) * 10000;
    const annualRate = parseFloat(rate);
    const Y = parseInt(years);

    if (!P || P <= 0 || !annualRate || annualRate <= 0 || !Y || Y <= 0) {
      setError("请输入有效的正数");
      setResult(null);
      return;
    }

    setError("");
    const r = annualRate / 100 / 12;
    const n = Y * 12;
    const pow = Math.pow(1 + r, n);
    const monthly = (P * r * pow) / (pow - 1);

    setResult({
      monthly: Math.round(monthly * 100) / 100,
      totalPayment: Math.round(monthly * n * 100) / 100,
      totalInterest: Math.round((monthly * n - P) * 100) / 100,
    });
  };

  const fmt = (v: number) =>
    v.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-5">房贷计算器</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            贷款金额 (万元)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="例如: 100"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            年利率 (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="例如: 3.85"
            step="0.01"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            贷款期限 (年)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="例如: 30"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</div>
        )}
        <button
          onClick={calculate}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          计算
        </button>
      </div>

      {result && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5">
            <div className="text-xs text-slate-500 mb-1">每月还款</div>
            <div className="text-xl font-bold text-indigo-700">¥{fmt(result.monthly)}</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5">
            <div className="text-xs text-slate-500 mb-1">还款总额</div>
            <div className="text-xl font-bold text-indigo-700">¥{fmt(result.totalPayment)}</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5">
            <div className="text-xs text-slate-500 mb-1">利息总额</div>
            <div className="text-xl font-bold text-indigo-700">¥{fmt(result.totalInterest)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
