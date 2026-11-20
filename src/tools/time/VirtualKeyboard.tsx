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

  const insert = (value: string, erase = false) => {
    const element = textareaRef.current;
    const start = element?.selectionStart ?? text.length;
    const end = element?.selectionEnd ?? text.length;
    const from = erase && start === end ? Math.max(0, start - (text.codePointAt(start - 2)! > 0xffff ? 2 : 1)) : start;
    setText(text.slice(0, from) + value + text.slice(end));
    requestAnimationFrame(() => { element?.focus(); element?.setSelectionRange(from + value.length, from + value.length); });
  };
  const handleKey = (key: string) => insert(shift ? SHIFT_MAP[key] ?? key.toUpperCase() : key);
  const handleBackspace = () => insert('', true);
  const handleSpace = () => insert(' ');
  const handleEnter = () => insert('\n');

  const keyClass =
    'min-w-[2.5rem] h-10 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium flex items-center justify-center transition-all active:scale-95 cursor-pointer select-none';

  return (
    <div className="tool-surface space-y-4">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="点击下方按键输入…"
        className="w-full min-h-[120px] rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-y"
      />

      <div className="space-y-2 overflow-x-auto w-full min-w-0" style={{ paddingBottom:8 }}>
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1 justify-center min-w-[560px]">
            {ri === 3 && (
              <button
                onClick={() => setShift(!shift)}
                className={`${keyClass} px-3 ${shift ? 'bg-blue-200 text-blue-700' : ''}`}
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

        <div className="flex gap-1 justify-center min-w-[560px]">
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
