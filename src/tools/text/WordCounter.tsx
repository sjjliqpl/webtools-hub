import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const lines = text === "" ? 0 : text.split(/\n/).length;

  const stats = [
    { label: "Characters", value: chars },
    { label: "Characters (no spaces)", value: charsNoSpaces },
    { label: "Words", value: words },
    { label: "Lines", value: lines },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Word Counter</h2>
        <button
          onClick={() => setText("")}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          Clear
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        rows={8}
        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-y"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{s.value}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
