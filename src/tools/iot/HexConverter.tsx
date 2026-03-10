import { useState } from 'react'

function toHex(n: number, pad = 2) {
  return n.toString(16).toUpperCase().padStart(pad, '0')
}

function toBin(n: number, pad = 8) {
  return n.toString(2).padStart(pad, '0')
}

function parseInput(input: string, base: 'hex' | 'dec' | 'bin'): number[] | null {
  const parts = input.trim().split(/[\s,]+/).filter(Boolean)
  const bytes: number[] = []
  for (const p of parts) {
    let val: number
    if (base === 'hex') val = parseInt(p.replace(/^0x/i, ''), 16)
    else if (base === 'bin') val = parseInt(p.replace(/^0b/i, ''), 2)
    else val = parseInt(p, 10)
    if (isNaN(val) || val < 0 || val > 255) return null
    bytes.push(val)
  }
  return bytes.length > 0 ? bytes : null
}

type InputBase = 'hex' | 'dec' | 'bin' | 'text'

export default function HexConverter() {
  const [inputBase, setInputBase] = useState<InputBase>('hex')
  const [input, setInput] = useState('')

  const getResult = (): { bytes: number[] | null; error: string } => {
    if (!input.trim()) return { bytes: null, error: '' }
    if (inputBase === 'text') {
      return { bytes: Array.from(new TextEncoder().encode(input)), error: '' }
    }
    const parsed = parseInput(input, inputBase as 'hex' | 'dec' | 'bin')
    if (!parsed) {
      return { bytes: null, error: '输入格式无效，请检查数值范围（每个字节 0-255）' }
    }
    return { bytes: parsed, error: '' }
  }

  const { bytes, error } = getResult()

  const BASES: { key: InputBase; label: string; placeholder: string }[] = [
    { key: 'hex', label: '十六进制', placeholder: '例: FF 00 1A 2B 或 FF001A2B' },
    { key: 'dec', label: '十进制', placeholder: '例: 255 0 26 43' },
    { key: 'bin', label: '二进制', placeholder: '例: 11111111 00000000 00011010' },
    { key: 'text', label: '文本/ASCII', placeholder: '例: Hello IoT' },
  ]

  const current = BASES.find(b => b.key === inputBase)!

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">字节与进制转换器</h2>
        <p className="text-sm text-slate-500 mb-4">在十六进制、十进制、二进制和 ASCII 文本之间互相转换</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {BASES.map(b => (
            <button
              key={b.key}
              onClick={() => { setInputBase(b.key); setInput('') }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${inputBase === b.key ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={current.placeholder}
          rows={3}
          className="w-full rounded-xl border border-slate-200 p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 resize-y"
        />
        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</div>
        )}
      </div>

      {bytes && bytes.length > 0 && (
        <div className="space-y-4">
          {/* Byte Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">字节详情（共 {bytes.length} 字节）</p>
            <div className="overflow-x-auto">
              <table className="text-xs font-mono w-full">
                <thead>
                  <tr className="text-slate-400">
                    <th className="text-left pb-2 pr-4">偏移</th>
                    <th className="text-left pb-2 pr-4">十六进制</th>
                    <th className="text-left pb-2 pr-4">十进制</th>
                    <th className="text-left pb-2 pr-4">二进制</th>
                    <th className="text-left pb-2">ASCII</th>
                  </tr>
                </thead>
                <tbody>
                  {bytes.map((b, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="py-1.5 pr-4 text-slate-400">{i.toString(16).toUpperCase().padStart(4, '0')}</td>
                      <td className="py-1.5 pr-4 text-teal-700 font-bold">{toHex(b)}</td>
                      <td className="py-1.5 pr-4 text-slate-700">{b.toString().padStart(3, ' ')}</td>
                      <td className="py-1.5 pr-4 text-slate-600">{toBin(b)}</td>
                      <td className="py-1.5 text-slate-500">{b >= 32 && b < 127 ? String.fromCharCode(b) : '·'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">汇总输出</p>
            <div className="space-y-2">
              {[
                { label: '十六进制流', value: bytes.map(b => toHex(b)).join(' ') },
                { label: '十六进制（紧凑）', value: bytes.map(b => toHex(b)).join('') },
                { label: '十进制数组', value: bytes.join(', ') },
                { label: 'C 字节数组', value: `{${bytes.map(b => '0x' + toHex(b)).join(', ')}}` },
                { label: 'ASCII 文本', value: bytes.map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : '.').join('') },
              ].map(row => (
                <div key={row.label} className="bg-slate-50 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-slate-400 block mb-0.5">{row.label}</span>
                  <span className="text-xs font-mono text-slate-700 break-all">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
