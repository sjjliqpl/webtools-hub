import { useState } from 'react'
import { Options, TrainingStats } from '../../components/Training'
import { useTimedSession } from '../../hooks/useTimedSession'
export default function ClickSpeed() {
  const [duration, setDuration] = useState(10)
  const [clicks, setClicks] = useState(0)
  const session = useTimedSession(duration)
  function start() { setClicks(0); session.start() }
  const elapsed = session.finished ? duration : duration - session.remaining
  return <div className="tool-surface"><TrainingStats items={[{ label: '点击次数', value: clicks }, { label: '剩余时间', value: `${Math.ceil(session.remaining)}s` }, { label: '每秒点击', value: elapsed > 0 ? (clicks / elapsed).toFixed(2) : '0.00' }]} />
    <Options label="训练时长" values={[5,10,30].map(value => ({ label: `${value} 秒`, value }))} value={duration} disabled={session.running} onChange={value => { setDuration(value); setClicks(0); session.reset() }} />
    <div style={{ marginTop: 16 }}><button className="training-stage" style={{ width: '100%', touchAction: 'none', userSelect: 'none' }} disabled={!session.running} onPointerDown={event => { if (event.button === 0 && session.running && session.isLive()) { event.preventDefault(); setClicks(prev => prev + 1) } }}><strong style={{ fontSize: 34, color: 'var(--primary)' }}>{session.finished ? `${(clicks / duration).toFixed(2)} CPS` : session.running ? clicks : '点击速度'}</strong><span>{session.running ? '在区域内连续点击或轻触' : session.finished ? `完成 ${duration} 秒训练，共 ${clicks} 次点击` : '开始后，在此区域尽可能快地点击'}</span></button></div>
    <div className="training-actions"><button className="primary-button" disabled={session.running} onClick={start}>{session.finished ? '再练一次' : '开始训练'}</button><button className="secondary-button" onClick={() => { session.reset(); setClicks(0) }}>重置</button></div>
  </div>
}
