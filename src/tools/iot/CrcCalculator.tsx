import { useState } from 'react'

function crc8(data: number[]): number {
  let crc = 0x00
  for (const byte of data) {
    crc ^= byte
    for (let i = 0; i < 8; i++) {
      if (crc & 0x80) crc = ((crc << 1) ^ 0x07) & 0xff
      else crc = (crc << 1) & 0xff
    }
  }
  return crc
}

function crc16Modbus(data: number[]): number {
  let crc = 0xffff
  for (const byte of data) {
    crc ^= byte
    for (let i = 0; i < 8; i++) {
      if (crc & 0x0001) crc = ((crc >> 1) ^ 0xa001) & 0xffff
      else crc = (crc >> 1) & 0xffff
    }
  }
  return crc
}

function crc16Ccitt(data: number[]): number {
  let crc = 0xffff
  for (const byte of data) {
    crc ^= byte << 8
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) crc = ((crc << 1) ^ 0x1021) & 0xffff
      else crc = (crc << 1) & 0xffff
    }
  }
  return crc
}

function crc32(data: number[]): number {
  let crc = 0xffffffff
  for (const byte of data) {
    crc ^= byte
    for (let i = 0; i < 8; i++) {
      if (crc & 1) crc = ((crc >>> 1) ^ 0xedb88320) >>> 0
      else crc = (crc >>> 1) >>> 0
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function hexToBytes(hex: string): number[] | null {
  const clean = hex.replace(/\s+/g, '')
  if (!/^[0-9a-fA-F]*$/.test(clean) || clean.length % 2 !== 0) return null
  const bytes = []
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16))
  }
  return bytes
}

function textToBytes(text: string): number[] {
  return Array.from(new TextEncoder().encode(text))
}

const INPUT_MODES = [
  { key: 'text', label: '文本输入' },
  { key: 'hex', label: '十六进制输入' },
] as const

type InputMode = typeof INPUT_MODES[number]['key']

interface CrcResult {
  name: string
  value: number
  hex: string
  bytes: string
  desc: string
}

export default function CrcCalculator() {
  const [mode, setMode] = useState<InputMode>('text')
  const [input, setInput] = useState('')
  const [results, setResults] = useState<CrcResult[] | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const calculate = () => {
    setError('')
    let bytes: number[] | null

    if (mode === 'hex') {
      bytes = hexToBytes(input)
      if (!bytes) {
        setError('无效的十六进制输入（请输入偶数位的十六进制字符，用空格分隔可选）')
        return
      }
    } else {
      bytes = textToBytes(input)
    }

    if (bytes.length === 0) {
      setError('输入数据不能为空')
      return
    }

    const crc8Val = crc8(bytes)
    const crc16ModbusVal = crc16Modbus(bytes)
    const crc16CcittVal = crc16Ccitt(bytes)
    const crc32Val = crc32(bytes)

    setResults([
      {
        name: 'CRC-8',
        value: crc8Val,
        hex: crc8Val.toString(16).toUpperCase().padStart(2, '0'),
        bytes: `0x${crc8Val.toString(16).toUpperCase().padStart(2, '0')}`,
        desc: '8 位 CRC，多项式 0x07',
      },
      {
        name: 'CRC-16/Modbus',
        value: crc16ModbusVal,
        hex: crc16ModbusVal.toString(16).toUpperCase().padStart(4, '0'),
        bytes: `0x${crc16ModbusVal.toString(16).toUpperCase().padStart(4, '0')} (低字节在前: ${(crc16ModbusVal & 0xff).toString(16).toUpperCase().padStart(2, '0')} ${(crc16ModbusVal >> 8).toString(16).toUpperCase().padStart(2, '0')})`,
        desc: 'Modbus RTU 协议标准 CRC',
      },
      {
        name: 'CRC-16/CCITT',
        value: crc16CcittVal,
        hex: crc16CcittVal.toString(16).toUpperCase().padStart(4, '0'),
        bytes: `0x${crc16CcittVal.toString(16).toUpperCase().padStart(4, '0')}`,
        desc: 'X.25、蓝牙、SD 卡等协议',
      },
      {
        name: 'CRC-32',
        value: crc32Val,
        hex: crc32Val.toString(16).toUpperCase().padStart(8, '0'),
        bytes: `0x${crc32Val.toString(16).toUpperCase().padStart(8, '0')}`,
        desc: 'ZIP、PNG、以太网帧校验',
      },
    ])
  }

  const handleCopy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(val)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">CRC 校验计算器</h2>
        <p className="text-sm text-slate-500 mb-4">计算 CRC-8、CRC-16/Modbus、CRC-16/CCITT、CRC-32 校验值</p>

        <div className="flex gap-2 mb-3">
          {INPUT_MODES.map(m => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setInput(''); setResults(null); setError('') }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === m.key ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'hex' ? '输入十六进制字节，如: 01 02 03 FF 或 010203FF' : '输入要计算 CRC 的文本内容'}
          rows={3}
          className="w-full rounded-xl border border-slate-200 p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 resize-y mb-3"
        />

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</div>
        )}

        <button
          onClick={calculate}
          disabled={!input.trim()}
          className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          计算 CRC
        </button>
      </div>

      {results && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">计算结果</p>
          <div className="space-y-3">
            {results.map(r => (
              <div key={r.name} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-sm font-semibold text-slate-700">{r.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{r.desc}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(r.hex, r.name)}
                    className="text-xs text-teal-600 hover:text-teal-800 shrink-0"
                  >
                    {copied === r.name ? '已复制 ✓' : '复制'}
                  </button>
                </div>
                <div className="font-mono text-base font-bold text-teal-700">0x{r.hex}</div>
                <div className="text-xs text-slate-500 mt-0.5">{r.bytes} &nbsp;|&nbsp; 十进制: {r.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
