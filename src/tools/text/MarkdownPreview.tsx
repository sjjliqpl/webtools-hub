import { useState } from 'react';
import { marked } from 'marked';

const defaultMarkdown = `# Hello Markdown

## Features

- **Bold** and *italic* text
- [Links](https://example.com)
- Inline \`code\` snippets

### Code Block

\`\`\`js
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};
\`\`\`

> Blockquote example

1. First item
2. Second item
3. Third item
`;

export default function MarkdownPreview() {
  const [text, setText] = useState(defaultMarkdown);

  const html = marked.parse(text) as string;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Markdown Preview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={20}
          className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono resize-none"
          placeholder="Enter markdown..."
        />
        <div
          className="rounded-xl border border-slate-200 p-4 text-sm overflow-auto prose-preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <style>{`
        .prose-preview h1 { font-size: 1.5rem; font-weight: 700; margin: 0.5rem 0; color: #1e293b; }
        .prose-preview h2 { font-size: 1.25rem; font-weight: 600; margin: 0.5rem 0; color: #334155; }
        .prose-preview h3 { font-size: 1.1rem; font-weight: 600; margin: 0.5rem 0; color: #475569; }
        .prose-preview p { margin: 0.5rem 0; line-height: 1.6; color: #334155; }
        .prose-preview ul, .prose-preview ol { padding-left: 1.5rem; margin: 0.5rem 0; color: #334155; }
        .prose-preview ul { list-style-type: disc; }
        .prose-preview ol { list-style-type: decimal; }
        .prose-preview li { margin: 0.25rem 0; }
        .prose-preview code { background: #f1f5f9; padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-size: 0.85em; font-family: monospace; }
        .prose-preview pre { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.5rem 0; }
        .prose-preview pre code { background: none; padding: 0; color: inherit; }
        .prose-preview blockquote { border-left: 3px solid #6366f1; padding-left: 1rem; margin: 0.5rem 0; color: #64748b; font-style: italic; }
        .prose-preview a { color: #6366f1; text-decoration: underline; }
        .prose-preview strong { font-weight: 600; }
        .prose-preview em { font-style: italic; }
      `}</style>
    </div>
  );
}
