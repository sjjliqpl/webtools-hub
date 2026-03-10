import { useState } from 'react';

function xorEncrypt(text: string, key: string): string {
  if (!key) return text;
  const keyLen = key.length;
  return Array.from(text).map((ch, i) => {
    const charCode = ch.charCodeAt(0) ^ key.charCodeAt(i % keyLen);
    return charCode.toString(16).padStart(4, '0');
  }).join(' ');
}

function xorDecrypt(hex: string, key: string): string {
  if (!key) return hex;
  try {
    const keyLen = key.length;
    const parts = hex.trim().split(/\s+/);
    return parts.map((part, i) => {
      const code = parseInt(part, 16) ^ key.charCodeAt(i % keyLen);
      return String.fromCharCode(code);
    }).join('');
  } catch {
    return '解密失败，请检查输入格式';
  }
}

export default function XorCipher() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [copied, setCopied] = useState(false);

  const output = mode === 'encrypt' ? xorEncrypt(input, key) : xorDecrypt(input, key);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">XOR 异或加密</h2>
      <p className="text-sm text-slate-500 mb-4">使用密钥对文本进行 XOR 位运算加密</p>

      {/* Mode Toggle */}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-4">
        {(['encrypt', 'decrypt'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setInput(''); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            {m === 'encrypt' ? '加密' : '解密'}
          </button>
        ))}
      </div>

      {/* Key */}
      <div className="mb-4">
        <label className="block text-sm text-slate-600 mb-1">密钥</label>
        <input
          type="text"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="请输入密钥…"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-mono"
        />
      </div>

      {/* Input */}
      <div className="mb-3">
        <label className="block text-sm text-slate-600 mb-1">
          {mode === 'encrypt' ? '明文' : '密文（十六进制，空格分隔）'}
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? '请输入要加密的文本…' : '请输入加密后的十六进制字符串…'}
          rows={3}
          className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-mono resize-y"
        />
      </div>

      {/* Output */}
      <div className="relative mb-3">
        <label className="block text-sm text-slate-600 mb-1">结果</label>
        <div className="rounded-xl border border-slate-200 p-4 text-sm font-mono bg-slate-50 break-all min-h-[72px] text-slate-700 pr-20 leading-relaxed">
          {output || <span className="text-slate-300">结果将显示在此…</span>}
        </div>
        <button
          onClick={handleCopy}
          disabled={!output || !key}
          className="absolute right-3 bottom-3 px-3 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors disabled:opacity-40"
        >
          {copied ? '已复制 ✓' : '复制'}
        </button>
      </div>

      <p className="text-xs text-slate-400">⚠️ XOR 加密为简单演示，不建议用于生产环境安全场景</p>
    </div>
  );
}
