import { useState } from 'react';

function textToBinary(text: string): string {
  // Use 16-bit encoding to support Unicode characters (including CJK)
  return text.split('').map(ch => {
    const code = ch.charCodeAt(0);
    return code.toString(2).padStart(code > 255 ? 16 : 8, '0');
  }).join(' ');
}

function binaryToText(binary: string): string {
  const parts = binary.trim().split(/\s+/);
  return parts.map(part => {
    if (!/^[01]+$/.test(part)) return '?';
    return String.fromCharCode(parseInt(part, 2));
  }).join('');
}

export default function TextBinary() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const output = mode === 'encode' ? textToBinary(input) : binaryToText(input);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">文本转二进制</h2>
      <p className="text-sm text-slate-500 mb-4">文本与 8 位二进制编码双向转换</p>

      {/* Mode Toggle */}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-4">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setInput(''); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            {m === 'encode' ? '文本 → 二进制' : '二进制 → 文本'}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? '请输入文本…' : '请输入二进制编码（8 位一组，空格分隔）…'}
        rows={3}
        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-mono resize-y mb-3"
      />

      <div className="relative">
        <div className="rounded-xl border border-slate-200 p-4 text-sm font-mono bg-slate-50 break-all min-h-[72px] text-slate-700 pr-20 leading-relaxed">
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

      <p className="mt-3 text-xs text-slate-400">每个字符使用 8 位二进制（ASCII/Unicode 编码）表示</p>
    </div>
  );
}
