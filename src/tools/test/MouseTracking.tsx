import { useEffect, useRef, useState } from 'react'
import { TrainingStats } from '../../components/Training'
import { useTimedSession } from '../../hooks/useTimedSession'
export default function MouseTracking() {
  const session = useTimedSession(20)
  const [position, setPosition] = useState({ x: 50, y: 50, on: false })
  const [accuracy, setAccuracy] = useState(0)
  const area = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: -1000, y: -1000 })
  useEffect(() => {
    if (!session.running) return
    const started = performance.now()
    let frame = 0, previous = started, inside = 0, total = 0
    function tick(now: number) {
      const element = area.current
      if (!element) return
      const t = (now - started) / 1000
      const x = 50 + 35 * Math.sin(t * 1.1), y = 50 + 30 * Math.sin(t * 1.7)
      const bounds = element.getBoundingClientRect()
      const on = Math.hypot(pointer.current.x - x / 100 * bounds.width, pointer.current.y - y / 100 * bounds.height) <= 35
      const delta = now - previous
      total += delta; if (on) inside += delta
      previous = now
      setPosition({ x, y, on }); setAccuracy(total ? Math.round(inside / total * 100) : 0)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [session.running])
  return <div className="tool-surface"><TrainingStats items={[{ label: '追踪准确率', value: `${accuracy}%` }, { label: '剩余时间', value: `${Math.ceil(session.remaining)}s` }, { label: '目标直径', value: '70px' }]} />
    <div ref={area} className="training-stage" style={{ height: 380, touchAction: 'none', cursor: session.running ? 'crosshair' : 'default' }} onPointerMove={event => { const bounds = event.currentTarget.getBoundingClientRect(); pointer.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top } }} onPointerLeave={() => { pointer.current = { x: -1000, y: -1000 } }}>
      {session.running ? <div className={`training-track-target ${position.on ? 'is-on' : ''}`} style={{ left: `${position.x}%`, top: `${position.y}%` }} /> : <><h2>{session.finished ? '追踪完成' : '让指针跟上目标'}</h2><p>{session.finished ? `20 秒追踪准确率 ${accuracy}%` : '将鼠标指针或手指保持在移动圆圈内，持续 20 秒。'}</p><button className="primary-button" onClick={() => { setAccuracy(0); session.start() }}>{session.finished ? '再练一次' : '开始训练'}</button></>}
    </div><div className="training-actions"><button className="secondary-button" onClick={() => { session.reset(); setAccuracy(0) }}>重置</button><span className="training-note">命中时圆圈变绿，准确率按停留时长计算。</span></div>
  </div>
}
