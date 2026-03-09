import { useState, useCallback } from 'react';

type Player = 'X' | 'O';
type Cell = Player | null;

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: Cell[]): { winner: Player; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line };
    }
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });

  const result = checkWinner(board);
  const isDraw = !result && board.every((c) => c !== null);

  const handleClick = useCallback(
    (index: number) => {
      if (board[index] || result || isDraw) return;
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const win = checkWinner(newBoard);
      if (win) {
        setScore((s) => ({ ...s, [win.winner]: s[win.winner as keyof typeof s] + 1 }));
      } else if (newBoard.every((c) => c !== null)) {
        setScore((s) => ({ ...s, draw: s.draw + 1 }));
      } else {
        setCurrentPlayer((p) => (p === 'X' ? 'O' : 'X'));
      }
    },
    [board, currentPlayer, result, isDraw],
  );

  const newGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
  };

  const resetScore = () => {
    newGame();
    setScore({ X: 0, O: 0, draw: 0 });
  };

  const winningCells = result ? new Set(result.line) : new Set<number>();

  const cellColor = (player: Player | null) => {
    if (player === 'X') return 'text-indigo-600';
    if (player === 'O') return 'text-pink-500';
    return '';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Tic Tac Toe</h2>

      {/* Score */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 rounded-xl bg-indigo-50 p-3 text-center">
          <div className="text-xl font-bold text-indigo-600">{score.X}</div>
          <div className="text-xs text-slate-500">X Wins</div>
        </div>
        <div className="flex-1 rounded-xl bg-slate-50 p-3 text-center">
          <div className="text-xl font-bold text-slate-600">{score.draw}</div>
          <div className="text-xs text-slate-500">Draws</div>
        </div>
        <div className="flex-1 rounded-xl bg-pink-50 p-3 text-center">
          <div className="text-xl font-bold text-pink-500">{score.O}</div>
          <div className="text-xs text-slate-500">O Wins</div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        {result ? (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${result.winner === 'X' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>
            {result.winner} wins! 🎉
          </span>
        ) : isDraw ? (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            Draw! 🤝
          </span>
        ) : (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentPlayer === 'X' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>
            {currentPlayer}&apos;s turn
          </span>
        )}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 w-fit mx-auto mb-4">
        {board.map((cell, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            className={`w-20 h-20 border border-slate-200 flex items-center justify-center text-3xl font-bold cursor-pointer hover:bg-slate-50 transition-colors ${cellColor(cell)} ${winningCells.has(i) ? 'bg-emerald-50' : ''}`}
          >
            {cell}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={newGame}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          New Game
        </button>
        <button
          onClick={resetScore}
          className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-300 transition-colors"
        >
          Reset Score
        </button>
      </div>
    </div>
  );
}
