import { useState } from 'react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
  'nesciunt', 'neque', 'porro', 'quisquam', 'numquam', 'corporis', 'suscipit',
  'laboriosam', 'nihil', 'impedit', 'quo', 'minus', 'quod', 'maxime', 'placeat',
];

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function generateSentence(): string {
  const len = 8 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: len }, () => pick(LOREM_WORDS));
  return capitalize(words.join(' ')) + '.';
}

function generateParagraph(): string {
  const count = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, generateSentence).join(' ');
}

type GenType = 'paragraphs' | 'sentences' | 'words';

export default function LoremIpsum() {
  const [type, setType] = useState<GenType>('paragraphs');
  const [quantity, setQuantity] = useState(3);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = '';
    switch (type) {
      case 'paragraphs':
        result = Array.from({ length: quantity }, generateParagraph).join('\n\n');
        break;
      case 'sentences':
        result = Array.from({ length: quantity }, generateSentence).join(' ');
        break;
      case 'words':
        result = Array.from({ length: quantity }, () => pick(LOREM_WORDS)).join(' ');
        result = capitalize(result) + '.';
        break;
    }
    setOutput(result);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Lorem Ipsum 生成器</h2>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as GenType)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
          <option value="paragraphs">段落</option>
          <option value="sentences">句子</option>
          <option value="words">单词</option>
        </select>
        <input
          type="number"
          min={1}
          max={100}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <button
          onClick={generate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          生成
        </button>
        {output && (
          <button
            onClick={copy}
            className="px-3 py-2 text-sm font-medium rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {copied ? '已复制 ✓' : '复制'}
          </button>
        )}
      </div>

      <textarea
        value={output}
        readOnly
        rows={14}
        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono bg-slate-50 resize-none"
        placeholder="点击生成按钮..."
      />
    </div>
  );
}
