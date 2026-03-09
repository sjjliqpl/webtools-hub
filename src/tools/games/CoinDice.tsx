import { useState } from 'react';

type CoinResult = '正' | '反';
type DiceResult = 1 | 2 | 3 | 4 | 5 | 6;
type HistoryEntry = { type: 'coin'; value: CoinResult } | { type: 'dice'; value: DiceResult };

const DOT_POSITIONS: Record<number, string[]> = {
  1: ['top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'],
  2: ['top-2 right-2', 'bottom-2 left-2'],
  3: ['top-2 right-2', 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', 'bottom-2 left-2'],
  4: ['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'],
  5: ['top-2 left-2', 'top-2 right-2', 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', 'bottom-2 left-2', 'bottom-2 right-2'],
  6: ['top-2 left-2', 'top-2 right-2', 'top-1/2 left-2 -translate-y-1/2', 'top-1/2 right-2 -translate-y-1/2', 'bottom-2 left-2', 'bottom-2 right-2'],
};

export default function CoinDice() {
  const [coinResult, setCoinResult] = useState<CoinResult | null>(null);
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addHistory = (entry: HistoryEntry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 10));
  };

  const flipCoin = () => {
    if (coinFlipping) return;
    setCoinFlipping(true);
    setTimeout(() => {
      const result: CoinResult = Math.random() < 0.5 ? '正' : '反';
      setCoinResult(result);
      setCoinFlipping(false);
      addHistory({ type: 'coin', value: result });
    }, 600);
  };

  const rollDice = () => {
    if (diceRolling) return;
    setDiceRolling(true);
    setTimeout(() => {
      const result = (Math.floor(Math.random() * 6) + 1) as DiceResult;
      setDiceResult(result);
      setDiceRolling(false);
      addHistory({ type: 'dice', value: result });
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Coin Flip & Dice Roll</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Coin */}
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-sm font-medium text-slate-600">Coin</h3>
          <div style={{ perspective: '400px' }}>
            <div
              onClick={flipCoin}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-4 border-amber-600 flex items-center justify-center cursor-pointer select-none shadow-lg"
              style={{
                transition: 'transform 0.6s ease-in-out',
                transform: coinFlipping ? 'rotateY(540deg)' : 'rotateY(0deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              <span className="text-2xl font-bold text-amber-900">
                {coinResult ?? '?'}
              </span>
            </div>
          </div>
          <button
            onClick={flipCoin}
            disabled={coinFlipping}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {coinFlipping ? 'Flipping...' : 'Flip'}
          </button>
        </div>

        {/* Dice */}
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-sm font-medium text-slate-600">Dice</h3>
          <div style={{ perspective: '400px' }}>
            <div
              onClick={rollDice}
              className="w-24 h-24 rounded-2xl bg-white border-2 border-slate-300 relative cursor-pointer select-none shadow-lg"
              style={{
                transition: 'transform 0.6s ease-in-out',
                transform: diceRolling ? 'rotateX(360deg) rotateY(360deg)' : 'rotateX(0deg) rotateY(0deg)',
              }}
            >
              {diceResult && !diceRolling && DOT_POSITIONS[diceResult].map((pos, i) => (
                <div
                  key={i}
                  className={`absolute w-4 h-4 rounded-full bg-slate-800 ${pos}`}
                />
              ))}
              {!diceResult && !diceRolling && (
                <span className="absolute inset-0 flex items-center justify-center text-2xl text-slate-400">?</span>
              )}
            </div>
          </div>
          <button
            onClick={rollDice}
            disabled={diceRolling}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {diceRolling ? 'Rolling...' : 'Roll'}
          </button>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">History (last 10)</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((entry, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  entry.type === 'coin'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {entry.type === 'coin' ? `🪙 ${entry.value}` : `🎲 ${entry.value}`}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
