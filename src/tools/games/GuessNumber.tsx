import { useState, useRef } from 'react';

interface GuessRecord {
  value: number;
  result: 'high' | 'low' | 'correct';
}

export default function GuessNumber() {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [won, setWon] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(input, 10);
    if (isNaN(num) || num < 1 || num > 100) return;

    let result: GuessRecord['result'];
    if (num > target) {
      result = 'high';
      setFeedback({ text: '太高了! ⬆️', color: 'text-red-500' });
    } else if (num < target) {
      result = 'low';
      setFeedback({ text: '太低了! ⬇️', color: 'text-blue-500' });
    } else {
      result = 'correct';
      setFeedback({ text: '恭喜猜对了! 🎉', color: 'text-emerald-500' });
      setWon(true);
    }
    setHistory((prev) => [...prev, { value: num, result }]);
    setAnimKey((k) => k + 1);
    setInput('');
  };

  const newGame = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setInput('');
    setHistory([]);
    setFeedback(null);
    setWon(false);
    inputRef.current?.focus();
  };

  const resultBadge = (r: GuessRecord['result']) => {
    if (r === 'high') return 'bg-red-100 text-red-700';
    if (r === 'low') return 'bg-blue-100 text-blue-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">Guess the Number</h2>
      <p className="text-sm text-slate-500 mb-4">Pick a number between 1 and 100</p>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          type="number"
          min={1}
          max={100}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={won}
          placeholder="Your guess"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:bg-slate-50"
        />
        {won ? (
          <button type="button" onClick={newGame} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
            New Game
          </button>
        ) : (
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            Submit
          </button>
        )}
      </form>

      {feedback && (
        <div
          key={animKey}
          className={`text-center text-xl font-bold mb-4 ${feedback.color} animate-bounce`}
        >
          {feedback.text}
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">Attempts</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
          {history.length}
        </span>
      </div>

      {history.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {history.map((g, i) => (
            <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${resultBadge(g.result)}`}>
              {g.value} {g.result === 'high' ? '⬆️' : g.result === 'low' ? '⬇️' : '🎉'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
