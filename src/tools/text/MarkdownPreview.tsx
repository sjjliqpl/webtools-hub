import { useState } from 'react';
import MarkdownFrame from '../../components/MarkdownFrame';

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



  return (
    <div className="tool-surface">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={20}
          className="w-full rounded-md border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono resize-none"
          placeholder="输入 Markdown…"
        />
        <MarkdownFrame text={text} />
      </div>

    </div>
  );
}
