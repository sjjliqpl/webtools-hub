import { useState } from 'react';

export default function LifeProgress() {
  const [birthday, setBirthday] = useState('');
  const [lifespan, setLifespan] = useState(80);

  const now = new Date();
  let yearsLived = 0;
  let percentage = 0;

  if (birthday) {
    const birth = new Date(birthday);
    yearsLived = (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    yearsLived = Math.max(0, yearsLived);
    percentage = Math.min(100, (yearsLived / lifespan) * 100);
  }

  const filledSquares = Math.min(lifespan, Math.floor(yearsLived));

  const motivationalTexts = [
    'Make every moment count. ✨',
    'The best time to start is now. 🚀',
    'Life is what you make of it. 🌟',
  ];
  const motivational = motivationalTexts[Math.floor(yearsLived) % motivationalTexts.length];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">⏳ Life Progress</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Birthday</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Expected Lifespan</label>
          <input
            type="number"
            min={1}
            max={150}
            value={lifespan}
            onChange={(e) => setLifespan(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {birthday && (
        <>
          <div className="text-center space-y-2">
            <div className="text-5xl font-bold text-indigo-600">{percentage.toFixed(1)}%</div>
            <p className="text-sm text-slate-500">
              {yearsLived.toFixed(1)} of {lifespan} years lived
            </p>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-1 justify-center">
            {Array.from({ length: lifespan }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${
                  i < filledSquares ? 'bg-indigo-500' : 'bg-slate-200'
                }`}
                title={`Year ${i + 1}`}
              />
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 italic">{motivational}</p>
        </>
      )}

      {!birthday && (
        <p className="text-sm text-slate-400 text-center">Enter your birthday to see your life progress.</p>
      )}
    </div>
  );
}
