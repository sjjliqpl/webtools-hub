import { useState } from "react";

export default function UrlCodec() {
  const [decoded, setDecoded] = useState("");
  const [encoded, setEncoded] = useState("");
  const [error, setError] = useState("");
  const [copiedSide, setCopiedSide] = useState<"left" | "right" | null>(null);

  const handleDecodedChange = (value: string) => {
    setDecoded(value);
    setError("");
    try {
      setEncoded(value ? encodeURIComponent(value) : "");
    } catch {
      setError("Failed to encode text.");
    }
  };

  const handleEncodedChange = (value: string) => {
    setEncoded(value);
    setError("");
    try {
      setDecoded(value ? decodeURIComponent(value) : "");
    } catch {
      setError("Invalid URL-encoded string.");
    }
  };

  const copy = async (text: string, side: "left" | "right") => {
    await navigator.clipboard.writeText(text);
    setCopiedSide(side);
    setTimeout(() => setCopiedSide(null), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">URL Encode / Decode</h2>

      {error && (
        <p className="mb-3 text-sm text-red-600 font-medium">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">Decoded</label>
            <button
              onClick={() => copy(decoded, "left")}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              {copiedSide === "left" ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            value={decoded}
            onChange={(e) => handleDecodedChange(e.target.value)}
            placeholder="Enter decoded text…"
            rows={8}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-y"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">Encoded</label>
            <button
              onClick={() => copy(encoded, "right")}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              {copiedSide === "right" ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            value={encoded}
            onChange={(e) => handleEncodedChange(e.target.value)}
            placeholder="Enter URL-encoded text…"
            rows={8}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-y"
          />
        </div>
      </div>
    </div>
  );
}
