import { useState, useRef } from 'react';

const ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

const SHIFT_MAP: Record<string, string> = {
  '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
  '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
  '-': '_', '=': '+', '[': '{', ']': '}', ';': ':',
  "'": '"', ',': '<', '.': '>', '/': '?',
};

export default function VirtualKeyboard() {
  const [text, setText] = useState('');
  const [shift, setShift] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKey = (key: string) => {
    let char = key;
    if (shift) {
      char = SHIFT_MAP[key] ?? key.toUpperCase();
    }
    setText((prev) => prev + char);
  };

  const handleBackspace = () => setText((prev) => prev.slice(0, -1));
  const handleSpace = () => setText((prev) => prev + ' ');
  const handleEnter = () => setText((prev) => prev + '\n');

  const keyClass =
    'min-w-[2.5rem] h-10 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium flex items-center justify-center transition-all active:scale-95 cursor-pointer select-none';

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">⌨️ Virtual Keyboard</h2>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Click the keys below to type..."
        className="w-full min-h-[120px] rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-y"
      />

      <div className="space-y-2">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1 justify-center">
            {ri === 3 && (
              <button
                onClick={() => setShift(!shift)}
                className={`${keyClass} px-3 ${shift ? 'bg-indigo-200 text-indigo-700' : ''}`}
              >
                Shift
              </button>
            )}
            {row.map((key) => (
              <button key={key} onClick={() => handleKey(key)} className={keyClass}>
                {shift ? (SHIFT_MAP[key] ?? key.toUpperCase()) : key}
              </button>
            ))}
            {ri === 3 && (
              <button onClick={handleBackspace} className={`${keyClass} px-3`}>
                ⌫
              </button>
            )}
          </div>
        ))}

        <div className="flex gap-1 justify-center">
          <button onClick={handleEnter} className={`${keyClass} px-4`}>
            Enter
          </button>
          <button onClick={handleSpace} className={`${keyClass} flex-1 max-w-[300px]`}>
            Space
          </button>
        </div>
      </div>
    </div>
  );
}
