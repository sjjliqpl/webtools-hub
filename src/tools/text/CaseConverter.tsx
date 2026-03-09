import { useState } from "react";

function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  );
}

function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^\s*|[.!?]\s+)(\w)/g, (_, sep, ch) => sep + ch.toUpperCase());
}

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const apply = (fn: (s: string) => string) => setOutput(fn(input));

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const buttons: { label: string; fn: (s: string) => string }[] = [
    { label: "UPPERCASE", fn: (s) => s.toUpperCase() },
    { label: "lowercase", fn: (s) => s.toLowerCase() },
    { label: "Title Case", fn: toTitleCase },
    { label: "Sentence case", fn: toSentenceCase },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Case Converter</h2>

      <label className="text-sm font-medium text-slate-700 mb-1 block">Input</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to convert…"
        rows={5}
        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-y"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        {buttons.map((b) => (
          <button
            key={b.label}
            onClick={() => apply(b.fn)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-slate-700">Output</label>
          {output && (
            <button
              onClick={copy}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
        <textarea
          value={output}
          readOnly
          rows={5}
          className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-y bg-slate-50"
        />
      </div>
    </div>
  );
}
