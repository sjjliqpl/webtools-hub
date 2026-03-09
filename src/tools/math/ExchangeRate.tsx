import { useState } from "react";

const rates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  CNY: 7.24,
  JPY: 149.5,
  GBP: 0.79,
  KRW: 1350,
};

const currencyNames: Record<string, string> = {
  USD: "美元 (USD)",
  EUR: "欧元 (EUR)",
  CNY: "人民币 (CNY)",
  JPY: "日元 (JPY)",
  GBP: "英镑 (GBP)",
  KRW: "韩元 (KRW)",
};

const codes = Object.keys(rates);

export default function ExchangeRate() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CNY");
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState((rates.CNY / rates.USD).toFixed(4));

  const convert = (amount: string, from: string, to: string): string => {
    const val = parseFloat(amount);
    if (isNaN(val) || amount === "") return "";
    const inUSD = val / rates[from];
    return (inUSD * rates[to]).toFixed(4);
  };

  const handleFromAmount = (value: string) => {
    setFromAmount(value);
    setToAmount(convert(value, fromCurrency, toCurrency));
  };

  const handleToAmount = (value: string) => {
    setToAmount(value);
    setFromAmount(convert(value, toCurrency, fromCurrency));
  };

  const handleFromCurrency = (cur: string) => {
    setFromCurrency(cur);
    setToAmount(convert(fromAmount, cur, toCurrency));
  };

  const handleToCurrency = (cur: string) => {
    setToCurrency(cur);
    setToAmount(convert(fromAmount, fromCurrency, cur));
  };

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const conversionRate = (rates[toCurrency] / rates[fromCurrency]).toFixed(4);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-5">汇率换算</h2>
      <div className="space-y-4">
        {/* From */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">从</label>
          <div className="flex gap-3">
            <select
              value={fromCurrency}
              onChange={(e) => handleFromCurrency(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
            >
              {codes.map((c) => (
                <option key={c} value={c}>{currencyNames[c]}</option>
              ))}
            </select>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => handleFromAmount(e.target.value)}
              placeholder="金额"
              className="flex-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={swap}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500"
            title="交换货币"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">到</label>
          <div className="flex gap-3">
            <select
              value={toCurrency}
              onChange={(e) => handleToCurrency(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
            >
              {codes.map((c) => (
                <option key={c} value={c}>{currencyNames[c]}</option>
              ))}
            </select>
            <input
              type="number"
              value={toAmount}
              onChange={(e) => handleToAmount(e.target.value)}
              placeholder="金额"
              className="flex-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* Rate display */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 text-center">
          <div className="text-xs text-slate-500 mb-1">汇率</div>
          <div className="text-lg font-bold text-indigo-700">
            1 {fromCurrency} = {conversionRate} {toCurrency}
          </div>
        </div>
      </div>
    </div>
  );
}
