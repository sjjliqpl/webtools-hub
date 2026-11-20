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
    <div className="tool-surface space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">生日</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">预期寿命（年）</label>
          <input
            type="number"
            min={1}
            max={150}
            value={lifespan}
            onChange={(e) => setLifespan(Math.min(150, Math.max(1, Math.floor(Number(e.target.value)) || 1)))}
            className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {birthday && (
        <>
          <div className="text-center space-y-2">
            <div className="text-5xl font-bold text-blue-600">{percentage.toFixed(1)}%</div>
            <p className="text-sm text-slate-500">
              {yearsLived.toFixed(1)} of {lifespan} years lived
            </p>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-1 justify-center">
            {Array.from({ length: lifespan }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${
                  i < filledSquares ? 'bg-blue-500' : 'bg-slate-200'
                }`}
                title={`Year ${i + 1}`}
              />
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 italic">{motivational}</p>
        </>
      )}

      {!birthday && (
        <p className="text-sm text-slate-400 text-center">输入生日查看时间进度。</p>
      )}
    </div>
  );
}
