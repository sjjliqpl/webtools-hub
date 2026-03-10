import { useState } from 'react';

type TokenFormat = 'hex' | 'base64' | 'alphanumeric';

function generateToken(length: number, format: TokenFormat): string {
  if (format === 'hex') {
    // 2 hex chars per byte, no bias
    const bytes = new Uint8Array(Math.ceil(length / 2));
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, length);
  }

  if (format === 'base64') {
    // Produce base64 chars from groups of 3 bytes → 4 chars (no modulo bias)
    const bytesNeeded = Math.ceil((length * 3) / 4) + 3;
    const bytes = new Uint8Array(bytesNeeded);
    crypto.getRandomValues(bytes);
    const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < bytes.length - 2 && result.length < length; i += 3) {
      const b0 = bytes[i], b1 = bytes[i + 1], b2 = bytes[i + 2];
      result += TABLE[b0 >> 2];
      result += TABLE[((b0 & 3) << 4) | (b1 >> 4)];
      result += TABLE[((b1 & 15) << 2) | (b2 >> 6)];
      result += TABLE[b2 & 63];
    }
    return result.slice(0, length);
  }

  // alphanumeric: rejection sampling to avoid modulo bias
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const max = 256 - (256 % CHARS.length); // largest multiple of 62 within byte range
  let result = '';
  while (result.length < length) {
    const buf = new Uint8Array(length * 2);
    crypto.getRandomValues(buf);
    for (const b of buf) {
      if (b < max) {
        result += CHARS[b % CHARS.length];
        if (result.length === length) break;
      }
    }
  }
  return result;
}

const FORMATS: { id: TokenFormat; label: string }[] = [
  { id: 'hex', label: '十六进制 (hex)' },
  { id: 'base64', label: 'Base64 字母表' },
  { id: 'alphanumeric', label: '字母数字' },
];

export default function RandomToken() {
  const [length, setLength] = useState(32);
  const [format, setFormat] = useState<TokenFormat>('hex');
  const [tokens, setTokens] = useState<string[]>([generateToken(32, 'hex')]);
  const [count, setCount] = useState(3);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    setTokens(Array.from({ length: count }, () => generateToken(length, format)));
  };

  const handleCopy = async (token: string, index: number) => {
    await navigator.clipboard.writeText(token);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-xl mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">随机令牌生成</h2>
      <p className="text-sm text-slate-500 mb-4">生成随机 API 密钥 / 安全令牌</p>

      {/* Format */}
      <div className="mb-4">
        <label className="block text-sm text-slate-600 mb-2">格式</label>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map(f => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${format === f.id ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Length */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-slate-600">长度</label>
          <span className="text-sm font-semibold text-violet-600">{length} 字符</span>
        </div>
        <input
          type="range"
          min={8}
          max={128}
          step={8}
          value={length}
          onChange={e => setLength(Number(e.target.value))}
          className="w-full accent-violet-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-0.5">
          <span>8</span><span>128</span>
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-slate-600 flex-shrink-0">生成数量：</label>
        <input
          type="number"
          min={1}
          max={10}
          value={count}
          onChange={e => setCount(Math.min(10, Math.max(1, Number(e.target.value))))}
          className="w-20 rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        />
      </div>

      <button
        onClick={generate}
        className="w-full px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors mb-4"
      >
        生成令牌
      </button>

      <div className="space-y-2">
        {tokens.map((token, i) => (
          <div key={i} className="flex items-center gap-2">
            <code className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono bg-slate-50 text-slate-700 break-all">
              {token}
            </code>
            <button
              onClick={() => handleCopy(token, i)}
              className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
            >
              {copied === i ? '✓' : '复制'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
