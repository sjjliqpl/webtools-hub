import { useRef, useState } from 'react'
import { Options, TrainingStats } from '../../components/Training'
const POOLS = [['W','A','S','D'], ['↑','↓','←','→'], 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]
const ARROWS: Record<string,string> = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' }
export default function KeyboardReaction() {
  const [pool, setPool] = useState(0)
  const [active, setActive] = useState(false)
  const [target, setTarget] = useState('')
  const [times, setTimes] = useState<number[]>([])
  const [misses, setMisses] = useState(0)
  const [message, setMessage] = useState('')
  const stage = useRef<HTMLDivElement>(null)
  const started = useRef(0)
  function next() {
    const keys = POOLS[pool]
    const available = keys.filter(key => key !== target)
    setTarget(available[Math.floor(Math.random() * available.length)])
    started.current = performance.now()
  }
  function start() { setTimes([]); setMisses(0); setMessage(''); setActive(true); next(); stage.current?.focus() }
  const average = times.length ? Math.round(times.reduce((a,b) => a+b,0) / times.length) : 0
  return <div className="tool-surface"><TrainingStats items={[{ label: '训练进度', value: `${times.length}/20` }, { label: '平均反应', value: average ? `${average}ms` : '—' }, { label: '错误按键', value: misses }]} /><Options label="按键范围" values={[{ value:0,label:'WASD' },{ value:1,label:'方向键' },{ value:2,label:'字母键' }]} value={pool} disabled={active} onChange={value => { setPool(value); setTimes([]); setMisses(0) }} />
    <div ref={stage} tabIndex={0} className="training-stage" style={{ marginTop:16 }} onKeyDown={event => {
      if (!active || event.repeat || event.metaKey || event.ctrlKey || event.altKey || event.key === 'Tab') return
      event.preventDefault()
      if ((ARROWS[event.key] || event.key.toUpperCase()) !== target) { setMisses(value => value+1); setMessage('按错了，试试屏幕上显示的键'); return }
      const elapsed = Math.round(performance.now()-started.current)
      setTimes(prev => [...prev, elapsed]); setMessage(`${elapsed} 毫秒`)
      if (times.length + 1 >= 20) setActive(false); else next()
    }}>
      {active ? <><p>按下对应按键</p><strong className="stage-number">{target}</strong><p role="status">{message || '点击训练区可重新聚焦'}</p></> : <><h2>{times.length === 20 ? '训练完成' : '看见按键，立即响应'}</h2><p>{times.length === 20 ? `平均 ${average} 毫秒，错误 ${misses} 次` : '连续完成 20 次，记录反应速度与错误次数。'}</p><button className="primary-button" onClick={start}>{times.length ? '再练一次' : '开始训练'}</button></>}
    </div><div className="training-actions"><button className="secondary-button" onClick={() => { setActive(false); setTimes([]); setMisses(0) }}>重置</button><span className="training-note">需要实体键盘，长按不会重复计分。</span></div></div>
}
