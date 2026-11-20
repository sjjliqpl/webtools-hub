import { copyText } from '../../lib/clipboard';
import { useState } from 'react';
import { textToBinary, binaryToText } from '../../lib/toolMath';

export default function TextBinary() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  let output = '', error = '';
  try { output = mode === 'encode' ? textToBinary(input) : binaryToText(input); } catch { error = '请输入有效的 UTF-8 二进制字节，每组 8 位，以空格分隔'; }

  const handleCopy = async () => {
    if (!output) return;
    if (!await copyText(output)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tool-surface max-w-lg mx-auto">
      <p className="text-sm text-slate-500 mb-4">文本与 8 位二进制编码双向转换</p>

      {/* Mode Toggle */}
      <div className="flex rounded-md border border-slate-200 overflow-hidden mb-4">
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
        className="w-full rounded-md border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-mono resize-y mb-3"
      />

      {error && <p className="error-message" role="alert">{error}</p>}
      <div className="relative">
        <div className="rounded-md border border-slate-200 p-4 text-sm font-mono bg-slate-50 break-all min-h-[72px] text-slate-700 pr-20 leading-relaxed">
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

      <p className="mt-3 text-xs text-slate-400">使用 UTF-8 编码，每个字节 8 位，支持中文与 Emoji</p>
    </div>
  );
}
