import { useState } from 'react'

interface PowerResult {
  batteryLife: number // hours
  batteryLifeDays: number
  chargeCycles: number
  avgCurrentMa: number
  powerMw: number
}

function calculate(
  capacityMah: number,
  voltage: number,
  activeCurrentMa: number,
  sleepCurrentUa: number,
  activeDutyPct: number,
): PowerResult {
  const activePct = activeDutyPct / 100
  const sleepPct = 1 - activePct

  const avgCurrentMa = activeCurrentMa * activePct + (sleepCurrentUa / 1000) * sleepPct
  const powerMw = avgCurrentMa * voltage
  const batteryLife = capacityMah / avgCurrentMa
  const batteryLifeDays = batteryLife / 24
  const chargeCycles = Math.floor(batteryLifeDays / 365)

  return { batteryLife, batteryLifeDays, chargeCycles, avgCurrentMa, powerMw }
}

const PRESETS: { name: string; activeCurrentMa: number; sleepCurrentUa: number; activeDutyPct: number }[] = [
  { name: 'ESP32 典型', activeCurrentMa: 160, sleepCurrentUa: 10, activeDutyPct: 5 },
  { name: 'LoRa 节点', activeCurrentMa: 45, sleepCurrentUa: 2, activeDutyPct: 1 },
  { name: '蓝牙低功耗', activeCurrentMa: 15, sleepCurrentUa: 3, activeDutyPct: 10 },
  { name: 'Zigbee 传感器', activeCurrentMa: 30, sleepCurrentUa: 5, activeDutyPct: 2 },
]

export default function IotPower() {
  const [capacityMah, setCapacityMah] = useState('2000')
  const [voltage, setVoltage] = useState('3.7')
  const [activeCurrent, setActiveCurrent] = useState('160')
  const [sleepCurrent, setSleepCurrent] = useState('10')
  const [activeDuty, setActiveDuty] = useState('5')

  const applyPreset = (p: typeof PRESETS[number]) => {
    setActiveCurrent(String(p.activeCurrentMa))
    setSleepCurrent(String(p.sleepCurrentUa))
    setActiveDuty(String(p.activeDutyPct))
  }

  const result = (() => {
    const cap = parseFloat(capacityMah)
    const v = parseFloat(voltage)
    const ac = parseFloat(activeCurrent)
    const sc = parseFloat(sleepCurrent)
    const duty = parseFloat(activeDuty)
    if ([cap, v, ac, sc, duty].some(isNaN) || cap <= 0 || v <= 0 || ac <= 0 || sc < 0 || duty < 0 || duty > 100) return null
    return calculate(cap, v, ac, sc, duty)
  })()

  const formatHours = (h: number) => {
    if (h < 24) return `${h.toFixed(1)} 小时`
    if (h < 24 * 30) return `${(h / 24).toFixed(1)} 天`
    if (h < 24 * 365) return `${(h / 24 / 30).toFixed(1)} 个月`
    return `${(h / 24 / 365).toFixed(2)} 年`
  }

  const inputClass = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30'

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">物联网功耗计算器</h2>
        <p className="text-sm text-slate-500 mb-4">估算 IoT 设备在工作/休眠模式下的电池续航时间</p>

        <p className="text-xs font-medium text-slate-500 mb-2">快速预设</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">电池容量 (mAh)</label>
            <input type="number" value={capacityMah} onChange={e => setCapacityMah(e.target.value)} min="1" placeholder="例: 2000" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">额定电压 (V)</label>
            <input type="number" value={voltage} onChange={e => setVoltage(e.target.value)} min="0.1" step="0.1" placeholder="例: 3.7" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">工作电流 (mA)</label>
            <input type="number" value={activeCurrent} onChange={e => setActiveCurrent(e.target.value)} min="0.001" placeholder="例: 160" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">休眠电流 (μA)</label>
            <input type="number" value={sleepCurrent} onChange={e => setSleepCurrent(e.target.value)} min="0" placeholder="例: 10" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">工作占空比 (%) <span className="text-slate-400 font-normal">— 工作时间比例</span></label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                value={activeDuty}
                onChange={e => setActiveDuty(e.target.value)}
                min="0" max="100" step="1"
                className="flex-1 accent-teal-600"
              />
              <input
                type="number"
                value={activeDuty}
                onChange={e => setActiveDuty(e.target.value)}
                min="0" max="100"
                className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
              <span className="text-sm text-slate-500">%</span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">估算结果</p>

          <div className="bg-teal-50 rounded-xl px-4 py-4 mb-3 text-center">
            <p className="text-xs text-teal-600 mb-1">预计电池续航</p>
            <p className="text-2xl font-bold text-teal-700">{formatHours(result.batteryLife)}</p>
            <p className="text-sm text-teal-600 mt-0.5">≈ {result.batteryLifeDays.toFixed(1)} 天</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500 mb-0.5">平均工作电流</p>
              <p className="text-sm font-mono font-semibold text-slate-700">{result.avgCurrentMa.toFixed(3)} mA</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500 mb-0.5">平均功耗</p>
              <p className="text-sm font-mono font-semibold text-slate-700">{result.powerMw.toFixed(2)} mW</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500 mb-0.5">充电频率</p>
              <p className="text-sm font-mono font-semibold text-slate-700">{result.batteryLifeDays >= 365 ? `${result.chargeCycles} 年不用充电` : `约每 ${result.batteryLifeDays.toFixed(0)} 天`}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500 mb-0.5">节能建议</p>
              <p className="text-xs text-slate-600">{parseFloat(activeDuty) > 20 ? '建议降低工作占空比以延长续航' : '占空比已较低，可考虑降低工作电流'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
