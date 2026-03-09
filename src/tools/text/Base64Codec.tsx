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
  return new TextDecoder().decode(bytes);
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
      setError("Failed to encode text.");
    }
  };

  const handleEncodedChange = (value: string) => {
    setEncoded(value);
    setError("");
    try {
      setPlain(value ? base64ToText(value) : "");
    } catch {
      setError("Invalid Base64 string.");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Base64 Encode / Decode</h2>

      {error && (
        <p className="mb-3 text-sm text-red-600 font-medium">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Plain Text</label>
          <textarea
            value={plain}
            onChange={(e) => handlePlainChange(e.target.value)}
            placeholder="Enter plain text…"
            rows={8}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-y"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Base64</label>
          <textarea
            value={encoded}
            onChange={(e) => handleEncodedChange(e.target.value)}
            placeholder="Enter Base64 string…"
            rows={8}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-y"
          />
        </div>
      </div>
    </div>
  );
}
