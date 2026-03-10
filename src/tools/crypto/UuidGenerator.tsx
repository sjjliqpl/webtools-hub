import { useState } from 'react';

function uuidv4(): string {
  if (crypto.randomUUID) return crypto.randomUUID();
  // Fallback
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => {
    setUuids(Array.from({ length: count }, () => uuidv4()));
  };

  const handleCopy = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-xl mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">UUID 生成器</h2>
      <p className="text-sm text-slate-500 mb-4">生成符合 v4 标准的随机 UUID</p>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-slate-600">生成数量</label>
            <span className="text-sm font-semibold text-violet-600">{count}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-violet-600"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={generate}
          className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors"
        >
          生成 UUID
        </button>
        <button
          onClick={handleCopyAll}
          disabled={uuids.length === 0}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-40"
        >
          {copiedAll ? '已复制 ✓' : '复制全部'}
        </button>
      </div>

      <div className="space-y-2">
        {uuids.map((uuid, i) => (
          <div key={i} className="flex items-center gap-2">
            <code className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono bg-slate-50 text-slate-700 break-all">
              {uuid}
            </code>
            <button
              onClick={() => handleCopy(uuid, i)}
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
