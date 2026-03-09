import { useState } from "react";

export default function Temperature() {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");

  const handleCelsius = (value: string) => {
    setCelsius(value);
    if (value === "" || value === "-") {
      setFahrenheit("");
      return;
    }
    const c = parseFloat(value);
    if (!isNaN(c)) {
      setFahrenheit((Math.round((c * 9 / 5 + 32) * 100) / 100).toString());
    }
  };

  const handleFahrenheit = (value: string) => {
    setFahrenheit(value);
    if (value === "" || value === "-") {
      setCelsius("");
      return;
    }
    const f = parseFloat(value);
    if (!isNaN(f)) {
      setCelsius((Math.round(((f - 32) * 5 / 9) * 100) / 100).toString());
    }
  };

  const tempC = celsius !== "" ? parseFloat(celsius) : null;

  const getIndicatorColor = () => {
    if (tempC === null) return "bg-slate-300";
    if (tempC <= 0) return "bg-blue-500";
    if (tempC <= 15) return "bg-cyan-400";
    if (tempC <= 25) return "bg-green-400";
    if (tempC <= 35) return "bg-orange-400";
    return "bg-red-500";
  };

  const getIndicatorHeight = () => {
    if (tempC === null) return "10%";
    const clamped = Math.max(-20, Math.min(50, tempC));
    const pct = ((clamped + 20) / 70) * 100;
    return `${Math.max(5, pct)}%`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-5">温度转换</h2>
      <div className="flex gap-6 items-start">
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              摄氏度 (°C)
            </label>
            <input
              type="number"
              value={celsius}
              onChange={(e) => handleCelsius(e.target.value)}
              placeholder="输入摄氏度"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          <div className="flex items-center justify-center text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              华氏度 (°F)
            </label>
            <input
              type="number"
              value={fahrenheit}
              onChange={(e) => handleFahrenheit(e.target.value)}
              placeholder="输入华氏度"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          {tempC !== null && (
            <div className="text-center text-sm text-slate-500">
              {tempC}°C = {(tempC * 9 / 5 + 32).toFixed(2)}°F
            </div>
          )}
        </div>

        {/* Thermometer indicator */}
        <div className="flex flex-col items-center gap-1 pt-2">
          <span className="text-xs text-slate-400">50°C</span>
          <div className="w-6 h-40 rounded-full bg-slate-100 relative overflow-hidden border border-slate-200">
            <div
              className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-300 ${getIndicatorColor()}`}
              style={{ height: getIndicatorHeight() }}
            />
          </div>
          <span className="text-xs text-slate-400">-20°C</span>
          {tempC !== null && (
            <span className="mt-1 text-sm font-semibold text-indigo-600">{tempC}°C</span>
          )}
        </div>
      </div>
    </div>
  );
}
