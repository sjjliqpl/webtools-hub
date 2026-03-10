import { useState } from 'react';

function rot13(text: string): string {
  return text.replace(/[A-Za-z]/g, ch => {
    const base = ch >= 'a' ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
  });
}

export default function Rot13() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const output = rot13(input);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    setInput(output);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">ROT13 编解码</h2>
      <p className="text-sm text-slate-500 mb-4">ROT13 是自逆的，加密即解密</p>

      {/* Input */}
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">输入</label>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="请输入文本…"
        rows={4}
        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-mono resize-y mb-3"
      />

      {/* Swap Button */}
      <div className="flex items-center justify-center mb-3">
        <button
          onClick={swap}
          disabled={!output}
          className="px-4 py-1.5 rounded-full text-sm font-medium bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors disabled:opacity-40"
        >
          ↕ 用结果替换输入
        </button>
      </div>

      {/* Output */}
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">ROT13 结果</label>
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

      <p className="mt-3 text-xs text-slate-400 text-center">
        ROT13 将每个英文字母向后位移 13 位，非字母字符保持不变
      </p>
    </div>
  );
}
