import { useState } from 'react';

const MORSE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/',
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k])
);
REVERSE_MORSE['/'] = ' ';

function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(ch => {
    if (ch === ' ') return '/';
    return MORSE[ch] || '?';
  }).join(' ');
}

function morseToText(morse: string): string {
  return morse.split(' ').map(code => {
    if (code === '/') return ' ';
    if (code === '') return '';
    return REVERSE_MORSE[code] || '?';
  }).join('');
}

export default function MorseCode() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const output = mode === 'encode' ? textToMorse(input) : morseToText(input);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">摩尔斯电码</h2>
      <p className="text-sm text-slate-500 mb-4">文本与摩尔斯电码双向转换</p>

      {/* Mode Toggle */}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-4">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setInput(''); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            {m === 'encode' ? '文本 → 电码' : '电码 → 文本'}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? '请输入文本（支持字母、数字、标点）…' : '请输入摩尔斯电码（点和短线，用空格分隔字符，用 / 分隔单词）…'}
        rows={3}
        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-mono resize-y mb-3"
      />

      <div className="relative">
        <div className="rounded-xl border border-slate-200 p-4 text-sm font-mono bg-slate-50 break-words min-h-[72px] text-slate-700 pr-20 leading-relaxed">
          {output || <span className="text-slate-300">结果将显示在此…</span>}
        </div>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="absolute right-3 top-3 px-3 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors disabled:opacity-40"
        >
          {copied ? '已复制 ✓' : '复制'}
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-400">提示：摩尔斯电码中，字符之间用空格分隔，单词之间用 / 分隔</p>
    </div>
  );
}
