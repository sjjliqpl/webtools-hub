import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = () => {
    setError("");
    setOutput("");
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">JSON Formatter</h2>

      <label className="text-sm font-medium text-slate-700 mb-1 block">Input</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste JSON here…'
        rows={8}
        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-y"
      />

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={format}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Format
        </button>

        <label className="text-sm font-medium text-slate-700">Indent</label>
        <select
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value))}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>
      )}

      {output && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">Output</label>
            <button
              onClick={copy}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={12}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-y bg-slate-50"
          />
        </div>
      )}
    </div>
  );
}
