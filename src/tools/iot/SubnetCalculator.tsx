import { useState } from 'react'

interface SubnetInfo {
  ip: string
  cidr: number
  networkAddress: string
  broadcastAddress: string
  subnetMask: string
  wildcardMask: string
  firstHost: string
  lastHost: string
  totalHosts: number
  usableHosts: number
  ipClass: string
  isPrivate: boolean
}

function ipToLong(ip: string): number {
  const parts = ip.split('.').map(Number)
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
}

function longToIp(long: number): string {
  return [
    (long >>> 24) & 0xff,
    (long >>> 16) & 0xff,
    (long >>> 8) & 0xff,
    long & 0xff,
  ].join('.')
}

function getIpClass(ip: string): string {
  const first = parseInt(ip.split('.')[0])
  if (first < 128) return 'A'
  if (first < 192) return 'B'
  if (first < 224) return 'C'
  if (first < 240) return 'D (多播)'
  return 'E (保留)'
}

function isPrivateIp(ip: string): boolean {
  const parts = ip.split('.').map(Number)
  const [a, b] = parts
  return (
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a === 127
  )
}

function calculateSubnet(ipCidr: string): SubnetInfo | null {
  const match = ipCidr.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/)
  if (!match) return null

  const ip = match[1]
  const cidr = parseInt(match[2])

  if (cidr < 0 || cidr > 32) return null

  const ipParts = ip.split('.').map(Number)
  if (ipParts.some(p => isNaN(p) || p < 0 || p > 255)) return null

  const maskLong = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0
  const ipLong = ipToLong(ip)
  const networkLong = (ipLong & maskLong) >>> 0
  const broadcastLong = (networkLong | (~maskLong >>> 0)) >>> 0
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = cidr >= 31 ? totalHosts : Math.max(0, totalHosts - 2)

  return {
    ip,
    cidr,
    networkAddress: longToIp(networkLong),
    broadcastAddress: longToIp(broadcastLong),
    subnetMask: longToIp(maskLong),
    wildcardMask: longToIp(~maskLong >>> 0),
    firstHost: cidr >= 31 ? longToIp(networkLong) : longToIp(networkLong + 1),
    lastHost: cidr >= 31 ? longToIp(broadcastLong) : longToIp(broadcastLong - 1),
    totalHosts,
    usableHosts,
    ipClass: getIpClass(ip),
    isPrivate: isPrivateIp(ip),
  }
}

const EXAMPLES = ['192.168.1.1/24', '10.0.0.1/8', '172.16.0.1/16', '192.168.10.50/28']

export default function SubnetCalculator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<SubnetInfo | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    const info = calculateSubnet(input.trim())
    if (!info) {
      setError('输入格式无效，请使用 CIDR 格式，如 192.168.1.1/24')
      setResult(null)
      return
    }
    setResult(info)
  }

  const rows = result ? [
    { label: '输入 IP 地址', value: result.ip, highlight: false },
    { label: 'CIDR 前缀长度', value: `/${result.cidr}`, highlight: false },
    { label: '子网掩码', value: result.subnetMask, highlight: false },
    { label: '通配符掩码', value: result.wildcardMask, highlight: false },
    { label: '网络地址', value: result.networkAddress, highlight: true },
    { label: '广播地址', value: result.broadcastAddress, highlight: true },
    { label: '首个可用主机', value: result.firstHost, highlight: false },
    { label: '最后可用主机', value: result.lastHost, highlight: false },
    { label: '总地址数', value: result.totalHosts.toLocaleString(), highlight: false },
    { label: '可用主机数', value: result.usableHosts.toLocaleString(), highlight: false },
    { label: 'IP 类别', value: result.ipClass + ' 类', highlight: false },
    { label: '私有/内网地址', value: result.isPrivate ? '是 ✓' : '否', highlight: false },
  ] : []

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">IP 子网计算器</h2>
        <p className="text-sm text-slate-500 mb-4">输入 CIDR 格式的 IP 地址，计算子网信息</p>

        <input
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && calculate()}
          placeholder="例: 192.168.1.1/24"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 mb-3"
        />

        <div className="flex flex-wrap gap-2 mb-3">
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => { setInput(ex); setError('') }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700 font-mono transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</div>
        )}

        <button
          onClick={calculate}
          disabled={!input.trim()}
          className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          计算子网
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">子网信息</p>
          <div className="space-y-2">
            {rows.map(row => (
              <div
                key={row.label}
                className={`flex justify-between items-center rounded-xl px-4 py-2.5 ${row.highlight ? 'bg-teal-50' : 'bg-slate-50'}`}
              >
                <span className="text-sm text-slate-600">{row.label}</span>
                <span className={`text-sm font-mono font-semibold ${row.highlight ? 'text-teal-700' : 'text-slate-700'}`}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Visual mask */}
          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500 mb-2">子网掩码位图（/{result.cidr}）</p>
            <div className="flex flex-wrap gap-0.5">
              {Array.from({ length: 32 }, (_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded text-[9px] flex items-center justify-center font-mono ${i < result.cidr ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'} ${i % 8 === 7 ? 'mr-1.5' : ''}`}
                >
                  {i < result.cidr ? '1' : '0'}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-2">
              <span className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-3 h-3 bg-teal-500 rounded inline-block" /> 网络位 ({result.cidr})</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-3 h-3 bg-slate-200 rounded inline-block" /> 主机位 ({32 - result.cidr})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
