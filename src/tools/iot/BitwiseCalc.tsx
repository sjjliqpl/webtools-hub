import { useState } from 'react'

type Op = 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSHIFT' | 'RSHIFT'

const OPS: { key: Op; label: string; symbol: string; needsB: boolean }[] = [
  { key: 'AND', label: '按位与', symbol: 'A & B', needsB: true },
  { key: 'OR', label: '按位或', symbol: 'A | B', needsB: true },
  { key: 'XOR', label: '按位异或', symbol: 'A ^ B', needsB: true },
  { key: 'NOT', label: '按位非', symbol: '~A', needsB: false },
  { key: 'LSHIFT', label: '左移', symbol: 'A << n', needsB: true },
  { key: 'RSHIFT', label: '右移', symbol: 'A >> n', needsB: true },
]

type DisplayBase = 'dec' | 'hex' | 'bin'

function parseNum(s: string): number | null {
  const clean = s.trim()
  if (!clean) return null
  let n: number
  if (clean.startsWith('0x') || clean.startsWith('0X')) n = parseInt(clean.slice(2), 16)
  else if (clean.startsWith('0b') || clean.startsWith('0B')) n = parseInt(clean.slice(2), 2)
  else n = parseInt(clean, 10)
  return isNaN(n) ? null : n
}

function toBin32(n: number): string {
  const bits = (n >>> 0).toString(2).padStart(32, '0')
  return bits.match(/.{4}/g)!.join(' ')
}

function displayNum(n: number, base: DisplayBase): string {
  const u = n >>> 0
  if (base === 'hex') return '0x' + u.toString(16).toUpperCase().padStart(8, '0')
  if (base === 'bin') return '0b' + u.toString(2).padStart(32, '0')
  return String(u) + ' (unsigned) / ' + n.toString() + ' (signed)'
}

export default function BitwiseCalc() {
  const [op, setOp] = useState<Op>('AND')
  const [aStr, setAStr] = useState('')
  const [bStr, setBStr] = useState('')
  const [displayBase, setDisplayBase] = useState<DisplayBase>('hex')
  const [bits, setBits] = useState(32)

  const currentOp = OPS.find(o => o.key === op)!
  const a = parseNum(aStr)
  const b = parseNum(bStr)

  const compute = (): number | null => {
    if (a === null) return null
    const mask = bits === 32 ? 0xffffffff : (1 << bits) - 1
    switch (op) {
      case 'AND': return b !== null ? (a & b) : null
      case 'OR': return b !== null ? (a | b) : null
      case 'XOR': return b !== null ? (a ^ b) : null
      case 'NOT': return (~a) & mask
      case 'LSHIFT': return b !== null ? (a << (b & 31)) & mask : null
      case 'RSHIFT': return b !== null ? (a >>> (b & 31)) & mask : null
      default: return null
    }
  }

  const result = compute()

  const BASES: { key: DisplayBase; label: string }[] = [
    { key: 'hex', label: '十六进制' },
    { key: 'dec', label: '十进制' },
    { key: 'bin', label: '二进制' },
  ]

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">位运算计算器</h2>
        <p className="text-sm text-slate-500 mb-4">对整数进行按位运算，常用于 IoT 寄存器解析与标志位操作</p>

        {/* Operation Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {OPS.map(o => (
            <button
              key={o.key}
              onClick={() => setOp(o.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${op === o.key ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {o.label} ({o.symbol})
            </button>
          ))}
        </div>

        {/* Bit Width */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-slate-500">位宽：</span>
          {[8, 16, 32].map(b => (
            <button
              key={b}
              onClick={() => setBits(b)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${bits === b ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {b} 位
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">操作数 A</label>
            <input
              type="text"
              value={aStr}
              onChange={e => setAStr(e.target.value)}
              placeholder="支持 0x.., 0b.., 十进制"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
            {a !== null && (
              <p className="text-xs text-slate-400 mt-1 font-mono">{toBin32(a)}</p>
            )}
          </div>
          {currentOp.needsB && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {op === 'LSHIFT' || op === 'RSHIFT' ? '位移量 n' : '操作数 B'}
              </label>
              <input
                type="text"
                value={bStr}
                onChange={e => setBStr(e.target.value)}
                placeholder={op === 'LSHIFT' || op === 'RSHIFT' ? '位移量（0-31）' : '支持 0x.., 0b.., 十进制'}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
              {b !== null && op !== 'LSHIFT' && op !== 'RSHIFT' && (
                <p className="text-xs text-slate-400 mt-1 font-mono">{toBin32(b)}</p>
              )}
            </div>
          )}
        </div>

        {/* Display base */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">结果显示：</span>
          {BASES.map(base => (
            <button
              key={base.key}
              onClick={() => setDisplayBase(base.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${displayBase === base.key ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {base.label}
            </button>
          ))}
        </div>
      </div>

      {result !== null && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">运算结果</p>
          <div className="bg-teal-50 rounded-xl px-4 py-3 mb-3">
            <p className="text-xs text-teal-600 mb-1">{currentOp.symbol}</p>
            <p className="text-lg font-mono font-bold text-teal-800 break-all">{displayNum(result, displayBase)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-500 mb-1">32 位二进制表示（每 4 位一组）</p>
            <p className="text-sm font-mono text-slate-700 break-all">{toBin32(result)}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-slate-50 rounded-xl px-3 py-2">
              <p className="text-xs text-slate-400 mb-0.5">十六进制</p>
              <p className="text-sm font-mono text-slate-700">0x{(result >>> 0).toString(16).toUpperCase().padStart(8, '0')}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2">
              <p className="text-xs text-slate-400 mb-0.5">无符号十进制</p>
              <p className="text-sm font-mono text-slate-700">{result >>> 0}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2">
              <p className="text-xs text-slate-400 mb-0.5">有符号十进制</p>
              <p className="text-sm font-mono text-slate-700">{result | 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
