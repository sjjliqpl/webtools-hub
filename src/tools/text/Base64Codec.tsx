import { useState } from "react";

function textToBase64(text: string): string {
  return btoa(
    Array.from(new TextEncoder().encode(text), (b) =>
      String.fromCodePoint(b)
    ).join("")
  );
}

function base64ToText(b64: string): string {
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.codePointAt(0)!);
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export default function Base64Codec() {
  const [plain, setPlain] = useState("");
  const [encoded, setEncoded] = useState("");
  const [error, setError] = useState("");

  const handlePlainChange = (value: string) => {
    setPlain(value);
    setError("");
    try {
      setEncoded(value ? textToBase64(value) : "");
    } catch {
      setEncoded(""); setError("无法编码文本");
    }
  };

  const handleEncodedChange = (value: string) => {
    setEncoded(value);
    setError("");
    try {
      setPlain(value ? base64ToText(value) : "");
    } catch {
      setPlain(""); setError("无效的 Base64 或 UTF-8 文本");
    }
  };

  return (
    <div className="tool-surface">
      {error && (
        <p className="mb-3 text-sm text-red-600 font-medium">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">原文</label>
          <textarea
            value={plain}
            onChange={(e) => handlePlainChange(e.target.value)}
            placeholder="输入原文…"
            rows={8}
            className="w-full rounded-md border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono resize-y"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Base64</label>
          <textarea
            value={encoded}
            onChange={(e) => handleEncodedChange(e.target.value)}
            placeholder="输入 Base64 字符串…"
            rows={8}
            className="w-full rounded-md border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono resize-y"
          />
        </div>
      </div>
    </div>
  );
}
