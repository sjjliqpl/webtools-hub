import { useState, useCallback, useEffect } from 'react';

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

type CharsetKey = keyof typeof CHARSETS;

function generatePassword(length: number, options: Record<CharsetKey, boolean>): string {
  let pool = '';
  for (const key of Object.keys(options) as CharsetKey[]) {
    if (options[key]) pool += CHARSETS[key];
  }
  if (!pool) return '';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += pool[Math.floor(Math.random() * pool.length)];
  }
  return pwd;
}

function getStrength(password: string, options: Record<CharsetKey, boolean>): { label: string; color: string; width: string } {
  const activeCount = (Object.values(options) as boolean[]).filter(Boolean).length;
  const len = password.length;
  let score = 0;
  if (len >= 8) score++;
  if (len >= 16) score++;
  if (len >= 24) score++;
  score += Math.min(activeCount, 4);
  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
  if (score <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/4' };
  if (score <= 5) return { label: 'Strong', color: 'bg-green-500', width: 'w-3/4' };
  return { label: 'Very Strong', color: 'bg-emerald-500', width: 'w-full' };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<Record<CharsetKey, boolean>>({
    uppercase: true,
    lowercase: true,
    digits: true,
    special: false,
  });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setPassword(generatePassword(length, options));
    setCopied(false);
  }, [length, options]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggleOption = (key: CharsetKey) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const strength = password ? getStrength(password, options) : null;

  const optionLabels: Record<CharsetKey, string> = {
    uppercase: 'A-Z',
    lowercase: 'a-z',
    digits: '0-9',
    special: '!@#$',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Password Generator</h2>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-slate-600">Length</label>
          <span className="text-sm font-medium text-indigo-600">{length}</span>
        </div>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {(Object.keys(options) as CharsetKey[]).map((key) => (
          <label key={key} className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() => toggleOption(key)}
              className="accent-indigo-600 w-4 h-4"
            />
            <span className="text-sm text-slate-700">{optionLabels[key]}</span>
          </label>
        ))}
      </div>

      <div className="relative mb-3">
        <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono bg-slate-50 break-all pr-20 min-h-[48px]">
          {password || <span className="text-slate-400">Select at least one option</span>}
        </div>
        <button
          onClick={handleCopy}
          disabled={!password}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors disabled:opacity-40"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {strength && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Strength</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${strength.color} text-white`}>
              {strength.label}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${strength.color} ${strength.width} rounded-full transition-all duration-300`} />
          </div>
        </div>
      )}

      <button
        onClick={generate}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        Generate Password
      </button>
    </div>
  );
}
