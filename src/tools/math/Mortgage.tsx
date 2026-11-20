import { useState } from "react";
import { mortgagePayment } from "../../lib/toolMath";

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
    try {
      setResult(mortgagePayment(Number(principal) * 10000, rate.trim() ? Number(rate) : NaN, Number(years)));
      setError("");
    } catch (cause) {
      setResult(null); setError((cause as Error).message);
    }
  };

  const fmt = (v: number) =>
    v.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="tool-surface">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            贷款金额 (万元)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => { setPrincipal(e.target.value); setResult(null); }}
            placeholder="例如: 100"
            className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            年利率 (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => { setRate(e.target.value); setResult(null); }}
            placeholder="例如: 3.85"
            step="0.01"
            className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            贷款期限 (年)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => { setYears(e.target.value); setResult(null); }}
            placeholder="例如: 30"
            className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-md px-4 py-2">{error}</div>
        )}
        <button
          onClick={calculate}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          计算
        </button>
      </div>

      {result && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-md p-5">
            <div className="text-xs text-slate-500 mb-1">每月还款</div>
            <div className="text-xl font-bold text-blue-700">¥{fmt(result.monthly)}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-md p-5">
            <div className="text-xs text-slate-500 mb-1">还款总额</div>
            <div className="text-xl font-bold text-blue-700">¥{fmt(result.totalPayment)}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-md p-5">
            <div className="text-xs text-slate-500 mb-1">利息总额</div>
            <div className="text-xl font-bold text-blue-700">¥{fmt(result.totalInterest)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
