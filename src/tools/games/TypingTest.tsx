import { useState, useRef, useCallback, useEffect } from 'react';

const PARAGRAPHS = [
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly at dawn.',
  'Technology is best when it brings people together. Innovation distinguishes between a leader and a follower. The advance of technology is based on making it fit in so that you do not really even notice it.',
  'In the middle of difficulty lies opportunity. Life is what happens when you are busy making other plans. The purpose of our lives is to be happy. Get busy living or get busy dying.',
  'A journey of a thousand miles begins with a single step. It does not matter how slowly you go as long as you do not stop. The only way to do great work is to love what you do.',
];

type Status = 'idle' | 'running' | 'finished';

export default function TypingTest() {
  const [sampleText, setSampleText] = useState(() => PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]);
  const [typed, setTyped] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    stopTimer();
    setStatus('finished');
  }, [stopTimer]);

  useEffect(() => stopTimer, [stopTimer]);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setStatus('running');
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) { stopTimer(); setStatus('finished'); }
    }, 200);
  }, [stopTimer]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (status === 'finished') return;
    const val = e.target.value;
    if (status === 'idle') startTimer();
    setTyped(val);
    if (startTimeRef.current) setTimeLeft(Math.max(0, 60 - (Date.now() - startTimeRef.current) / 1000));
    if (val.length >= sampleText.length) finish();
  };

  const reset = () => {
    stopTimer();
    setSampleText(PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]);
    setTyped('');
    setStatus('idle');
    setTimeLeft(60);
    inputRef.current?.focus();
  };

  const correctChars = typed.split('').filter((ch, i) => ch === sampleText[i]).length;
  const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 0;
  const elapsedSeconds = status === 'idle' ? 0 : 60 - timeLeft;
  const wpm = elapsedSeconds > 0 ? Math.round((correctChars / 5) / (elapsedSeconds / 60)) : 0;

  return (
    <div className="tool-surface max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${timeLeft <= 10 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
            {Math.ceil(timeLeft)}s
          </span>
          <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            {status === 'idle' ? '开始' : '重新开始'}
          </button>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 px-4 py-3 mb-4 text-sm leading-relaxed font-mono bg-slate-50 min-h-[100px]">
        {sampleText.split('').map((ch, i) => {
          let color = 'text-slate-400';
          if (i < typed.length) {
            color = typed[i] === ch ? 'text-green-600' : 'text-red-500 bg-red-50';
          }
          return (
            <span key={i} className={color}>
              {ch}
            </span>
          );
        })}
      </div>

      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleInput}
        disabled={status === 'finished'}
        placeholder={status === 'idle' ? '在此开始输入…' : ''}
        className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none h-28 font-mono disabled:bg-slate-50 disabled:text-slate-400"
      />

      {status === 'finished' && (
        <div className="mt-4 flex gap-4">
          <div className="flex-1 rounded-md bg-blue-50 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{wpm}</div>
            <div className="text-xs text-slate-500 mt-1">WPM</div>
          </div>
          <div className="flex-1 rounded-md bg-emerald-50 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{accuracy}%</div>
            <div className="text-xs text-slate-500 mt-1">准确率</div>
          </div>
          <div className="flex-1 rounded-md bg-slate-50 p-4 text-center">
            <div className="text-2xl font-bold text-slate-700">{correctChars}/{typed.length}</div>
            <div className="text-xs text-slate-500 mt-1">正确字符</div>
          </div>
        </div>
      )}
    </div>
  );
}
