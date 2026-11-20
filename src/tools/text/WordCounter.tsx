import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const chars = Array.from(text).length;
  const charsNoSpaces = Array.from(text.replace(/\s/g, "")).length;
  const words = Array.from(new Intl.Segmenter('zh', { granularity: 'word' }).segment(text)).filter(segment => segment.isWordLike).length;
  const lines = text === "" ? 0 : text.split(/\n/).length;

  const stats = [
    { label: "字符", value: chars },
    { label: "字符（不含空格）", value: charsNoSpaces },
    { label: "词数", value: words },
    { label: "行数", value: lines },
  ];

  return (
    <div className="tool-surface">
      <div className="flex items-center justify-between mb-4">

        <button
          onClick={() => setText("")}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          清空
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="在此输入或粘贴文本…"
        rows={8}
        className="w-full rounded-md border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono resize-y"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-50 rounded-md p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{s.value}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
