import { useState } from 'react'

interface BaudResult {
  bitsPerSecond: number
  bytesPerSecond: number
  timePerByteMicros: number
  frameSize: number
  timePerFrameMicros: number
  framesPerSecond: number
  payloadEfficiency: number
}

const DATA_BITS = [5, 6, 7, 8] as const
const PARITY = [
  { key: 'none', label: '无校验 (None)', bits: 0 },
  { key: 'even', label: '偶校验 (Even)', bits: 1 },
  { key: 'odd', label: '奇校验 (Odd)', bits: 1 },
  { key: 'mark', label: 'Mark', bits: 1 },
  { key: 'space', label: 'Space', bits: 1 },
] as const

const STOP_BITS = [
  { key: '1', label: '1', bits: 1 },
  { key: '1.5', label: '1.5', bits: 1.5 },
  { key: '2', label: '2', bits: 2 },
] as const

type ParityKey = typeof PARITY[number]['key']
type StopKey = typeof STOP_BITS[number]['key']

const COMMON_BAUDS = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600]

const SCENARIOS = [
  { label: 'Arduino 默认', baud: 9600, data: 8 as const, parity: 'none' as const, stop: '1' as const },
  { label: 'Modbus RTU', baud: 9600, data: 8 as const, parity: 'even' as const, stop: '1' as const },
  { label: 'GPS 模块', baud: 4800, data: 8 as const, parity: 'none' as const, stop: '1' as const },
  { label: 'RS-485 高速', baud: 115200, data: 8 as const, parity: 'none' as const, stop: '1' as const },
]

function calculateSerialParams(baud: number, dataBits: number, parityBits: number, stopBits: number): BaudResult {
  const frameSize = 1 + dataBits + parityBits + stopBits // start + data + parity + stop
  const timePerBitMicros = 1_000_000 / baud
  const timePerByteMicros = timePerBitMicros * frameSize
  const bytesPerSecond = baud / frameSize
  const framesPerSecond = baud / frameSize
  const payloadEfficiency = (dataBits / frameSize) * 100

  return {
    bitsPerSecond: baud,
    bytesPerSecond,
    timePerByteMicros,
    frameSize,
    timePerFrameMicros: timePerByteMicros,
    framesPerSecond,
    payloadEfficiency,
  }
}

export default function BaudRate() {
  const [baudInput, setBaudInput] = useState('9600')
  const [dataBits, setDataBits] = useState<typeof DATA_BITS[number]>(8)
  const [parity, setParity] = useState<ParityKey>('none')
  const [stopBits, setStopBits] = useState<StopKey>('1')
  const [payloadBytes, setPayloadBytes] = useState('10')

  const baud = parseInt(baudInput) || 0
  const parityBits = PARITY.find(p => p.key === parity)!.bits
  const stopBitsNum = parseFloat(stopBits)

  const result = baud > 0 ? calculateSerialParams(baud, dataBits, parityBits, stopBitsNum) : null

  const payloadNum = parseInt(payloadBytes) || 0
  const transmitTimeMicros = result ? result.timePerByteMicros * payloadNum : 0

  const formatTime = (us: number) => {
    if (us < 1000) return `${us.toFixed(1)} μs`
    if (us < 1_000_000) return `${(us / 1000).toFixed(2)} ms`
    return `${(us / 1_000_000).toFixed(3)} s`
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">串口波特率计算器</h2>
        <p className="text-sm text-slate-500 mb-4">计算串行通信（UART/RS-232/RS-485）参数与数据传输时间</p>

        {/* Preset Scenarios */}
        <p className="text-xs font-medium text-slate-500 mb-2">常见场景</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {SCENARIOS.map(s => (
            <button
              key={s.label}
              onClick={() => {
                setBaudInput(String(s.baud))
                setDataBits(s.data)
                setParity(s.parity)
                setStopBits(s.stop)
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Baud Rate */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-600 mb-1">波特率 (bps)</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {COMMON_BAUDS.map(b => (
              <button
                key={b}
                onClick={() => setBaudInput(String(b))}
                className={`text-xs px-2.5 py-1 rounded-lg font-mono transition-colors ${baudInput === String(b) ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {b.toLocaleString()}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={baudInput}
            onChange={e => setBaudInput(e.target.value)}
            min="1"
            placeholder="自定义波特率"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        {/* Frame Format */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">数据位</label>
            <div className="flex gap-1">
              {DATA_BITS.map(b => (
                <button
                  key={b}
                  onClick={() => setDataBits(b)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${dataBits === b ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">停止位</label>
            <div className="flex gap-1">
              {STOP_BITS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setStopBits(s.key)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${stopBits === s.key ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">校验位</label>
            <select
              value={parity}
              onChange={e => setParity(e.target.value as ParityKey)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            >
              {PARITY.map(p => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">传输数据量（字节）</label>
          <input
            type="number"
            value={payloadBytes}
            onChange={e => setPayloadBytes(e.target.value)}
            min="1"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">计算结果</p>

          {/* Frame visualization */}
          <div className="mb-4 p-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500 mb-2">帧格式（1 帧 = {result.frameSize} 位）</p>
            <div className="flex gap-1 text-[10px] font-mono">
              <div className="bg-amber-100 text-amber-700 rounded px-2 py-1">START(1)</div>
              <div className="bg-teal-100 text-teal-700 rounded px-2 py-1">DATA({dataBits})</div>
              {parityBits > 0 && <div className="bg-blue-100 text-blue-700 rounded px-2 py-1">PARITY(1)</div>}
              <div className="bg-slate-200 text-slate-600 rounded px-2 py-1">STOP({stopBits})</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-teal-50 rounded-xl px-4 py-3">
              <p className="text-xs text-teal-600 mb-0.5">有效字节率</p>
              <p className="text-base font-mono font-bold text-teal-700">{result.bytesPerSecond.toFixed(1)} B/s</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500 mb-0.5">每字节传输时间</p>
              <p className="text-base font-mono font-semibold text-slate-700">{formatTime(result.timePerByteMicros)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500 mb-0.5">有效载荷效率</p>
              <p className="text-base font-mono font-semibold text-slate-700">{result.payloadEfficiency.toFixed(1)}%</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500 mb-0.5">每秒帧数</p>
              <p className="text-base font-mono font-semibold text-slate-700">{result.framesPerSecond.toFixed(0)} fps</p>
            </div>
          </div>

          {payloadNum > 0 && (
            <div className="bg-indigo-50 rounded-xl px-4 py-3">
              <p className="text-xs text-indigo-600 mb-0.5">传输 {payloadNum} 字节所需时间</p>
              <p className="text-lg font-mono font-bold text-indigo-700">{formatTime(transmitTimeMicros)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
