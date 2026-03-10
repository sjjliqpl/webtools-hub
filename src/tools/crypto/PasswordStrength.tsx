import { useState } from 'react';

interface Criteria {
  label: string;
  met: boolean;
}

function analyzePassword(pwd: string): { score: number; criteria: Criteria[] } {
  const criteria: Criteria[] = [
    { label: '至少 8 位字符', met: pwd.length >= 8 },
    { label: '至少 12 位字符', met: pwd.length >= 12 },
    { label: '包含大写字母 (A-Z)', met: /[A-Z]/.test(pwd) },
    { label: '包含小写字母 (a-z)', met: /[a-z]/.test(pwd) },
    { label: '包含数字 (0-9)', met: /[0-9]/.test(pwd) },
    { label: '包含特殊符号 (!@#$…)', met: /[^A-Za-z0-9]/.test(pwd) },
    { label: '无连续重复字符 (aaa)', met: pwd.length > 0 && !/(.)\1{2,}/.test(pwd) },
  ];
  const score = criteria.filter(c => c.met).length;
  return { score, criteria };
}

function getStrengthInfo(score: number, length: number) {
  if (length === 0) return { label: '—', color: 'bg-slate-200', textColor: 'text-slate-400', width: 'w-0' };
  if (score <= 2) return { label: '非常弱', color: 'bg-red-500', textColor: 'text-red-600', width: 'w-1/5' };
  if (score <= 3) return { label: '弱', color: 'bg-orange-500', textColor: 'text-orange-600', width: 'w-2/5' };
  if (score <= 4) return { label: '一般', color: 'bg-yellow-500', textColor: 'text-yellow-600', width: 'w-3/5' };
  if (score <= 5) return { label: '强', color: 'bg-blue-500', textColor: 'text-blue-600', width: 'w-4/5' };
  return { label: '非常强', color: 'bg-emerald-500', textColor: 'text-emerald-600', width: 'w-full' };
}

export default function PasswordStrength() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const { score, criteria } = analyzePassword(password);
  const strength = getStrengthInfo(score, password.length);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">密码强度检测</h2>
      <p className="text-sm text-slate-500 mb-4">输入密码，实时分析安全强度</p>

      <div className="relative mb-4">
        <input
          type={show ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="请输入密码…"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-mono"
        />
        <button
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
        >
          {show ? '隐藏' : '显示'}
        </button>
      </div>

      {/* Strength Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500">强度</span>
          <span className={`text-xs font-semibold ${strength.textColor}`}>{strength.label}</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${strength.color} ${strength.width} rounded-full transition-all duration-500`} />
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-2">
        {criteria.map(c => (
          <div key={c.label} className="flex items-center gap-2">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${c.met ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              {c.met ? '✓' : '×'}
            </span>
            <span className={`text-sm ${c.met ? 'text-slate-700' : 'text-slate-400'}`}>{c.label}</span>
          </div>
        ))}
      </div>

      {password && (
        <p className="mt-4 text-xs text-slate-400 text-center">
          当前长度：{password.length} 位 · 满足 {score}/{criteria.length} 项规则
        </p>
      )}
    </div>
  );
}
