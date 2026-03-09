import { useState } from 'react';

function calcDiff(a: Date, b: Date) {
  const start = a < b ? a : b;
  const end = a < b ? b : a;

  const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months--;

  let years = end.getFullYear() - start.getFullYear();
  if (
    end.getMonth() < start.getMonth() ||
    (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
  ) {
    years--;
  }

  return { days, weeks, months: Math.max(0, months), years: Math.max(0, years) };
}

export default function DateDiff() {
  const [dateA, setDateA] = useState('');
  const [dateB, setDateB] = useState('');

  const valid = dateA && dateB;
  const diff = valid ? calcDiff(new Date(dateA), new Date(dateB)) : null;

  const cards = diff
    ? [
        { label: 'Days', value: diff.days },
        { label: 'Weeks', value: diff.weeks },
        { label: 'Months', value: diff.months },
        { label: 'Years', value: diff.years },
      ]
    : null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">📅 Date Difference</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Start Date</label>
          <input
            type="date"
            value={dateA}
            onChange={(e) => setDateA(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">End Date</label>
          <input
            type="date"
            value={dateB}
            onChange={(e) => setDateB(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {diff && dateA === dateB && (
        <p className="text-sm text-slate-500 text-center">Both dates are the same.</p>
      )}

      {cards && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-indigo-700">{c.value}</div>
              <div className="text-xs text-slate-500 mt-1">{c.label}</div>
            </div>
          ))}
        </div>
      )}

      {!valid && (
        <p className="text-sm text-slate-400 text-center">Select two dates to see the difference.</p>
      )}
    </div>
  );
}
