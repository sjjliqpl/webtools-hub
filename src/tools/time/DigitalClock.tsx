import { useState, useEffect } from "react";

const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

export default function DigitalClock() {
  const [now, setNow] = useState(new Date());
  const [is24h, setIs24h] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const displayHour = is24h ? hours : hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";

  const pad = (n: number) => String(n).padStart(2, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const weekday = WEEKDAYS[now.getDay()];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col items-center gap-4">
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-mono font-bold tracking-wider">
          {pad(displayHour)}:{pad(minutes)}:{pad(seconds)}
        </span>
        {!is24h && (
          <span className="text-xl font-mono text-indigo-400">{ampm}</span>
        )}
      </div>

      <div className="flex items-center gap-3 text-slate-400 text-sm">
        <span>{year}-{month}-{day}</span>
        <span className="text-slate-600">|</span>
        <span>{weekday}</span>
      </div>

      <button
        onClick={() => setIs24h((v) => !v)}
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        {is24h ? "切换 12 小时制" : "切换 24 小时制"}
      </button>
    </div>
  );
}
