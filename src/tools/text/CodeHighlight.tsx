import { useState, useMemo } from 'react';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML', grammar: 'markup' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
] as const;

const defaultCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

export default function CodeHighlight() {
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    const lang = LANGUAGES.find((l) => l.value === language);
    const grammarKey = (lang && 'grammar' in lang ? lang.grammar : language) as string;
    const grammar = Prism.languages[grammarKey];
    if (!grammar) return code;
    return Prism.highlight(code, grammar, grammarKey);
  }, [code, language]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">代码高亮</h2>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        <button
          onClick={copy}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {copied ? '已复制 ✓' : '复制代码'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">代码输入</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={16}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-none"
            placeholder="输入代码..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">高亮预览</label>
          <pre className="rounded-xl border border-slate-200 p-4 text-sm font-mono bg-slate-900 text-slate-100 overflow-auto code-highlight-preview"
               style={{ minHeight: '22rem' }}>
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        </div>
      </div>

      <style>{`
        .code-highlight-preview .token.comment,
        .code-highlight-preview .token.prolog,
        .code-highlight-preview .token.doctype,
        .code-highlight-preview .token.cdata { color: #6a9955; }
        .code-highlight-preview .token.punctuation { color: #d4d4d4; }
        .code-highlight-preview .token.property,
        .code-highlight-preview .token.tag,
        .code-highlight-preview .token.boolean,
        .code-highlight-preview .token.number,
        .code-highlight-preview .token.constant,
        .code-highlight-preview .token.symbol { color: #b5cea8; }
        .code-highlight-preview .token.selector,
        .code-highlight-preview .token.attr-name,
        .code-highlight-preview .token.string,
        .code-highlight-preview .token.char,
        .code-highlight-preview .token.builtin { color: #ce9178; }
        .code-highlight-preview .token.operator,
        .code-highlight-preview .token.entity,
        .code-highlight-preview .token.url { color: #d4d4d4; }
        .code-highlight-preview .token.atrule,
        .code-highlight-preview .token.attr-value,
        .code-highlight-preview .token.keyword { color: #569cd6; }
        .code-highlight-preview .token.function,
        .code-highlight-preview .token.class-name { color: #dcdcaa; }
        .code-highlight-preview .token.regex,
        .code-highlight-preview .token.important,
        .code-highlight-preview .token.variable { color: #d16969; }
      `}</style>
    </div>
  );
}
