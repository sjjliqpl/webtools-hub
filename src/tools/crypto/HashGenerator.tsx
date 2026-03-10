import { useState } from 'react';

async function sha(algorithm: string, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;
type Algo = typeof ALGOS[number];

export default function HashGenerator() {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState<Record<Algo, string>>({} as Record<Algo, string>);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const compute = async () => {
    if (!text) return;
    setLoading(true);
    const results = {} as Record<Algo, string>;
    for (const algo of ALGOS) {
      results[algo] = await sha(algo, text);
    }
    setHashes(results);
    setLoading(false);
  };

  const handleCopy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">哈希值计算</h2>
      <p className="text-sm text-slate-500 mb-4">输入文本，计算 SHA 系列哈希值</p>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="请输入要计算哈希的文本…"
        rows={3}
        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-mono resize-y mb-3"
      />

      <button
        onClick={compute}
        disabled={!text || loading}
        className="w-full px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 mb-4"
      >
        {loading ? '计算中…' : '计算哈希值'}
      </button>

      {ALGOS.map(algo => (
        <div key={algo} className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{algo}</span>
            {hashes[algo] && (
              <button
                onClick={() => handleCopy(hashes[algo], algo)}
                className="text-xs text-violet-600 hover:text-violet-800 transition-colors"
              >
                {copied === algo ? '已复制 ✓' : '复制'}
              </button>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-mono bg-slate-50 break-all text-slate-600 min-h-[36px]">
            {hashes[algo] || <span className="text-slate-300">—</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
