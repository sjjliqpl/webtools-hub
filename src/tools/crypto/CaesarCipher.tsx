import { useState } from 'react';

function caesar(text: string, shift: number, decrypt: boolean): string {
  const s = decrypt ? (26 - (shift % 26)) % 26 : shift % 26;
  return text.replace(/[A-Za-z]/g, ch => {
    const base = ch >= 'a' ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + s) % 26) + base);
  });
}

export default function CaesarCipher() {
  const [input, setInput] = useState('');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [copied, setCopied] = useState(false);

  const output = caesar(input, shift, mode === 'decrypt');

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">凯撒密码</h2>
      <p className="text-sm text-slate-500 mb-4">字母位移加密 / 解密</p>

      {/* Mode Toggle */}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-4">
        {(['encrypt', 'decrypt'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            {m === 'encrypt' ? '加密' : '解密'}
          </button>
        ))}
      </div>

      {/* Shift Control */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-slate-600">位移量</label>
          <span className="text-sm font-semibold text-violet-600">{shift}</span>
        </div>
        <input
          type="range"
          min={1}
          max={25}
          value={shift}
          onChange={e => setShift(Number(e.target.value))}
          className="w-full accent-violet-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-0.5">
          <span>1</span><span>25</span>
        </div>
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encrypt' ? '请输入明文…' : '请输入密文…'}
        rows={3}
        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-mono resize-y mb-3"
      />

      {/* Output */}
      <div className="relative">
        <div className="rounded-xl border border-slate-200 p-4 text-sm font-mono bg-slate-50 break-words min-h-[72px] text-slate-700 pr-20">
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
    </div>
  );
}
