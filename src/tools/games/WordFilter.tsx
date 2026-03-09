import { useState, useMemo } from "react";

interface FilterResult {
  segments: { text: string; replaced: boolean }[];
  count: number;
}

function filterText(
  input: string,
  words: string[],
  caseInsensitive: boolean
): FilterResult {
  if (!input || words.length === 0) {
    return { segments: [{ text: input, replaced: false }], count: 0 };
  }

  const escaped = words
    .filter((w) => w.trim())
    .map((w) => w.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) {
    return { segments: [{ text: input, replaced: false }], count: 0 };
  }

  const flags = caseInsensitive ? "gi" : "g";
  const regex = new RegExp(`(${escaped.join("|")})`, flags);

  const segments: FilterResult["segments"] = [];
  let count = 0;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: input.slice(lastIndex, match.index), replaced: false });
    }
    segments.push({ text: "***", replaced: true });
    count++;
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < input.length) {
    segments.push({ text: input.slice(lastIndex), replaced: false });
  }

  return { segments, count };
}

export default function WordFilter() {
  const [input, setInput] = useState("");
  const [keywords, setKeywords] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [filtered, setFiltered] = useState<FilterResult | null>(null);

  const wordList = useMemo(
    () => keywords.split(",").filter((w) => w.trim()),
    [keywords]
  );

  const handleFilter = () => {
    setFiltered(filterText(input, wordList, caseInsensitive));
  };

  const copyResult = () => {
    if (!filtered) return;
    const text = filtered.segments.map((s) => s.text).join("");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">敏感词过滤</h2>

      <div className="mb-3">
        <label className="block text-xs text-slate-500 mb-1">输入文本</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder="请输入需要过滤的文本..."
          className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs text-slate-500 mb-1">
          敏感词（逗号分隔）
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="例如: 词1,词2,词3"
          className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={caseInsensitive}
            onChange={(e) => setCaseInsensitive(e.target.checked)}
            className="rounded accent-indigo-600"
          />
          忽略大小写
        </label>

        <button
          onClick={handleFilter}
          disabled={!input.trim() || wordList.length === 0}
          className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          过滤
        </button>
      </div>

      {filtered && (
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">
              共替换 <strong className="text-indigo-600">{filtered.count}</strong> 处
            </span>
            <button
              onClick={copyResult}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              复制结果
            </button>
          </div>
          <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
            {filtered.segments.map((seg, i) =>
              seg.replaced ? (
                <span key={i} className="bg-red-100 text-red-700 px-0.5 rounded">
                  {seg.text}
                </span>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
