import { useState } from 'react'

interface TopicAnalysis {
  valid: boolean
  levels: string[]
  hasWildcard: boolean
  hasSingleWildcard: boolean
  hasMultiWildcard: boolean
  wildcardPosition: string
  errors: string[]
}

function analyzeTopic(topic: string, isSubscribe = false): TopicAnalysis {
  const errors: string[] = []
  const levels = topic.split('/')

  const hasMultiWildcard = topic.includes('#')
  const hasSingleWildcard = topic.includes('+')
  const hasWildcard = hasMultiWildcard || hasSingleWildcard

  if (topic === '') {
    errors.push('主题不能为空')
  }

  if (topic.includes(' ')) {
    errors.push('主题不能包含空格')
  }

  if (topic.includes('\0')) {
    errors.push('主题不能包含 NULL 字符')
  }

  if (!isSubscribe && hasWildcard) {
    errors.push('发布主题不能包含通配符 (# 或 +)')
  }

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i]
    if (level.includes('#')) {
      if (level !== '#') {
        errors.push(`层级 ${i + 1}: "#" 必须单独占一个层级`)
      }
      if (i !== levels.length - 1) {
        errors.push('"#" 通配符必须位于主题末尾')
      }
    }
    if (level.includes('+') && level !== '+') {
      errors.push(`层级 ${i + 1}: "+" 必须单独占一个层级`)
    }
  }

  let wildcardPosition = ''
  if (hasMultiWildcard && hasSingleWildcard) {
    wildcardPosition = '多级通配符 (#) + 单级通配符 (+)'
  } else if (hasMultiWildcard) {
    wildcardPosition = '多级通配符 (#)'
  } else if (hasSingleWildcard) {
    wildcardPosition = `单级通配符 (+) × ${levels.filter(l => l === '+').length}`
  }

  return {
    valid: errors.length === 0,
    levels,
    hasWildcard,
    hasSingleWildcard,
    hasMultiWildcard,
    wildcardPosition,
    errors,
  }
}

const EXAMPLES = [
  'home/living-room/temperature',
  'sensors/+/temperature',
  'devices/#',
  'factory/line1/machine2/status',
  '$SYS/broker/clients/connected',
]

export default function MqttTopic() {
  const [topic, setTopic] = useState('')
  const [isSubscribe, setIsSubscribe] = useState(false)

  const analysis = topic ? analyzeTopic(topic, isSubscribe) : null

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">MQTT 主题验证器</h2>
        <p className="text-sm text-slate-500 mb-4">验证 MQTT 主题格式，解析主题层级与通配符</p>

        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm text-slate-600 font-medium">模式：</label>
          <button
            onClick={() => setIsSubscribe(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!isSubscribe ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            发布 (Publish)
          </button>
          <button
            onClick={() => setIsSubscribe(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isSubscribe ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            订阅 (Subscribe)
          </button>
        </div>

        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="输入 MQTT 主题，如 home/room/sensor"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 mb-3"
        />

        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => setTopic(ex)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700 font-mono transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {analysis && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className={`flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl text-sm font-medium ${analysis.valid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            <span>{analysis.valid ? '✅' : '❌'}</span>
            <span>{analysis.valid ? '主题格式有效' : '主题格式无效'}</span>
          </div>

          {analysis.errors.length > 0 && (
            <div className="mb-4 space-y-1.5">
              {analysis.errors.map((err, i) => (
                <div key={i} className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">⚠️ {err}</div>
              ))}
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">主题层级</p>
            <div className="flex flex-wrap gap-2">
              {analysis.levels.map((level, i) => (
                <div key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-slate-300 text-xs">/</span>}
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium ${
                    level === '#' ? 'bg-purple-100 text-purple-700' :
                    level === '+' ? 'bg-blue-100 text-blue-700' :
                    level.startsWith('$') ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {level || '(空)'}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">共 {analysis.levels.length} 个层级</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">通配符</p>
              <p className="text-sm font-medium text-slate-700">
                {analysis.hasWildcard ? analysis.wildcardPosition : '无通配符'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">系统主题</p>
              <p className="text-sm font-medium text-slate-700">
                {topic.startsWith('$') ? '是 ($SYS 等)' : '否'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">通配符说明</p>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex gap-2"><span className="font-mono bg-blue-100 text-blue-700 px-1.5 rounded">+</span><span>单级通配符，匹配单个层级，如 <code className="font-mono">sensors/+/temp</code></span></div>
          <div className="flex gap-2"><span className="font-mono bg-purple-100 text-purple-700 px-1.5 rounded">#</span><span>多级通配符，匹配后续所有层级，必须在末尾，如 <code className="font-mono">home/#</code></span></div>
          <div className="flex gap-2"><span className="font-mono bg-amber-100 text-amber-700 px-1.5 rounded">$</span><span>系统主题前缀，如 <code className="font-mono">$SYS/broker/uptime</code></span></div>
        </div>
      </div>
    </div>
  )
}
