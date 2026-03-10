import { useState } from 'react'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function formatDateTime(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

function formatDateTimeUTC(d: Date) {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())} ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())} UTC`
}

function parseLocalDatetime(s: string): Date | null {
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

const COMMON_TIMESTAMPS = [
  { label: '当前时间', value: () => Math.floor(Date.now() / 1000) },
  { label: '当前时间 (ms)', value: () => Date.now() },
  { label: '2000-01-01 00:00:00', value: () => 946684800 },
  { label: '2024-01-01 00:00:00', value: () => 1704067200 },
]

export default function UnixTimestamp() {
  const [tsInput, setTsInput] = useState('')
  const [dtInput, setDtInput] = useState('')

  const now = () => {
    setTsInput(String(Math.floor(Date.now() / 1000)))
    setDtInput('')
  }

  const tsResult = (() => {
    const raw = tsInput.trim()
    if (!raw) return null
    const num = Number(raw)
    if (isNaN(num)) return null
    // auto-detect ms vs s
    const isMs = raw.length >= 13
    const ms = isMs ? num : num * 1000
    const d = new Date(ms)
    if (isNaN(d.getTime())) return null
    return { d, isMs }
  })()

  const dtResult = (() => {
    if (!dtInput) return null
    const d = parseLocalDatetime(dtInput)
    if (!d) return null
    return { sec: Math.floor(d.getTime() / 1000), ms: d.getTime(), d }
  })()

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Timestamp → Date */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Unix 时间戳转换</h2>
        <p className="text-sm text-slate-500 mb-4">Unix 时间戳与本地时间互转，支持秒 / 毫秒自动识别</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">时间戳 → 日期时间</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tsInput}
              onChange={e => setTsInput(e.target.value)}
              placeholder="输入 Unix 时间戳（秒或毫秒）"
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
            <button
              onClick={now}
              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs hover:bg-teal-50 hover:text-teal-700 transition-colors"
            >
              现在
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {COMMON_TIMESTAMPS.map(ct => (
              <button
                key={ct.label}
                onClick={() => setTsInput(String(ct.value()))}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-700 font-mono transition-colors"
              >
                {ct.label}
              </button>
            ))}
          </div>

          {tsResult && (
            <div className="mt-3 space-y-2">
              <div className="bg-teal-50 rounded-xl px-4 py-3">
                <p className="text-xs text-teal-600 mb-0.5">本地时间</p>
                <p className="text-base font-mono font-semibold text-teal-800">{formatDateTime(tsResult.d)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-slate-500 mb-0.5">UTC 时间</p>
                  <p className="text-sm font-mono text-slate-700">{formatDateTimeUTC(tsResult.d)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-slate-500 mb-0.5">ISO 8601</p>
                  <p className="text-sm font-mono text-slate-700 truncate">{tsResult.d.toISOString()}</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-slate-500 mb-0.5">星期</p>
                  <p className="text-sm font-mono text-slate-700">{['周日','周一','周二','周三','周四','周五','周六'][tsResult.d.getDay()]}</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-slate-500 mb-0.5">输入识别为</p>
                  <p className="text-sm font-mono text-slate-700">{tsResult.isMs ? '毫秒级时间戳' : '秒级时间戳'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">日期时间 → 时间戳</label>
          <input
            type="datetime-local"
            value={dtInput}
            onChange={e => setDtInput(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />

          {dtResult && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-teal-50 rounded-xl px-4 py-3">
                <p className="text-xs text-teal-600 mb-0.5">Unix 时间戳（秒）</p>
                <p className="text-base font-mono font-bold text-teal-800">{dtResult.sec}</p>
              </div>
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-xs text-slate-500 mb-0.5">Unix 时间戳（毫秒）</p>
                <p className="text-base font-mono font-semibold text-slate-700">{dtResult.ms}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">关于 Unix 时间戳</p>
        <p className="text-xs text-slate-500">Unix 时间戳是从 1970-01-01 00:00:00 UTC（Unix 纪元）起经过的秒数，广泛用于 IoT 设备时间同步、数据记录和 NTP 协议。</p>
      </div>
    </div>
  )
}
