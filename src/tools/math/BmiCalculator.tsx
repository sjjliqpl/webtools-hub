import { useState } from "react";

export default function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setBmi(parseFloat((w / (h / 100) ** 2).toFixed(1)));
    }
  };

  const getStatus = (v: number) => {
    if (v < 18.5) return { text: "偏瘦", color: "text-blue-500", bar: "bg-blue-400" };
    if (v < 25) return { text: "正常", color: "text-green-500", bar: "bg-green-400" };
    if (v < 30) return { text: "超重", color: "text-yellow-500", bar: "bg-yellow-400" };
    return { text: "肥胖", color: "text-red-500", bar: "bg-red-400" };
  };

  const barPercent = bmi ? Math.min((bmi / 40) * 100, 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">BMI 计算器</h2>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">身高 (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="请输入身高"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">体重 (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="请输入体重"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        计算 BMI
      </button>

      {bmi !== null && (
        <div className="mt-5 space-y-4">
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-500 mb-1">你的 BMI</p>
            <p className="text-3xl font-bold text-slate-800">{bmi}</p>
            <p className={`text-sm font-medium mt-1 ${getStatus(bmi).color}`}>
              {getStatus(bmi).text}
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>偏瘦</span>
              <span>正常</span>
              <span>超重</span>
              <span>肥胖</span>
            </div>
            <div className="h-3 rounded-full bg-gradient-to-r from-blue-300 via-green-300 via-yellow-300 to-red-400 relative overflow-hidden">
              <div
                className="absolute top-0 h-full w-1 bg-slate-800 rounded-full"
                style={{ left: `${barPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
