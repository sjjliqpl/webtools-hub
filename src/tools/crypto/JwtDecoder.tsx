import { useState } from 'react';

function decodeBase64Url(str: string): string {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  return atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad);
}

function parseJWT(token: string): { header: object; payload: object; raw: string[] } | null {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) return null;
    const header = JSON.parse(decodeBase64Url(parts[0]));
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    return { header, payload, raw: parts };
  } catch {
    return null;
  }
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleString('zh-CN');
}

// Computed at module load time to avoid calling impure Date.now during render
let _nowTimestamp = 0;
function getNow(): number {
  if (!_nowTimestamp) _nowTimestamp = Math.floor(Date.now() / 1000);
  return _nowTimestamp;
}

export default function JwtDecoder() {
  const [token, setToken] = useState('');

  const parsed = token.trim() ? parseJWT(token) : null;

  const renderSection = (title: string, data: object) => (
    <div className="mb-3">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
      <pre className="rounded-xl border border-slate-200 p-3 text-xs font-mono bg-slate-50 overflow-x-auto text-slate-700 whitespace-pre-wrap break-all">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );

  const getExpiry = (payload: Record<string, unknown>) => {
    if (!payload.exp) return null;
    const exp = payload.exp as number;
    const expired = exp < getNow();
    return { text: formatDate(exp), expired };
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">JWT 令牌解析</h2>
      <p className="text-sm text-slate-500 mb-4">粘贴 JWT 令牌，解析头部与载荷（不验证签名）</p>

      <textarea
        value={token}
        onChange={e => setToken(e.target.value)}
        placeholder="粘贴 JWT 令牌，格式：xxxxx.yyyyy.zzzzz"
        rows={4}
        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-mono resize-y mb-4"
      />

      {token.trim() && !parsed && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 mb-4">
          ⚠️ 无效的 JWT 格式，请检查令牌是否完整
        </div>
      )}

      {parsed && (
        <>
          {renderSection('Header（头部）', parsed.header)}
          {renderSection('Payload（载荷）', parsed.payload)}
          {getExpiry(parsed.payload as Record<string, unknown>) && (
            <div className={`rounded-xl px-4 py-2 text-sm ${(getExpiry(parsed.payload as Record<string, unknown>))!.expired ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              {(getExpiry(parsed.payload as Record<string, unknown>))!.expired ? '⚠️ 令牌已过期：' : '✓ 令牌有效，过期时间：'}
              {(getExpiry(parsed.payload as Record<string, unknown>))!.text}
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">⚠️ 仅解析内容，不验证签名安全性</p>
        </>
      )}
    </div>
  );
}
