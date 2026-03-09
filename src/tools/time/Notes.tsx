import { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';

const STORAGE_KEY = 'notes-tool-content';

export default function Notes() {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setText(stored);
  }, []);

  const save = useCallback((value: string) => {
    localStorage.setItem(STORAGE_KEY, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, []);

  const handleChange = (value: string) => {
    setText(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(value), 300);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">📝 Notes</h2>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-green-600 font-medium animate-pulse">已保存</span>
          )}
          <button
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {preview ? (
        <div
          className="prose prose-sm max-w-none min-h-[300px] rounded-xl border border-slate-200 px-4 py-3"
          dangerouslySetInnerHTML={{ __html: marked(text) as string }}
        />
      ) : (
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Start typing your notes... (Markdown supported)"
          className="w-full min-h-[300px] rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-y"
        />
      )}

      <div className="text-xs text-slate-400 text-right">
        {wordCount} {wordCount === 1 ? 'word' : 'words'}
      </div>
    </div>
  );
}
