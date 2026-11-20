import { useEffect, useRef, useState } from 'react'
import { Options, TrainingLayout, TrainingStats } from '../../components/Training'
import Icon from '../../components/Icon'

const TIMES = [50, 100, 200, 300, 500, 1000, 2000, 3000]
const formatTime = (ms: number) => ms < 1000 ? `${ms} 毫秒` : `${ms / 1000} 秒`
type Phase = 'idle' | 'show' | 'input' | 'result'

export default function NumberMemory() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [digits, setDigits] = useState(5)
  const [displayMs, setDisplayMs] = useState(3000)
  const [number, setNumber] = useState('')
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState<boolean[]>([])
  const [notice, setNotice] = useState('')
  const nextRef = useRef<HTMLButtonElement>(null)
  const submitted = useRef(false)
  useEffect(() => {
    if (phase !== 'show') return
    let timer: ReturnType<typeof setTimeout>
    // Start the exposure clock at the next paint, after the number is in the DOM.
    const frame = requestAnimationFrame(() => { timer = setTimeout(() => setPhase('input'), displayMs) })
    function onHidden() {
      if (document.hidden) { clearTimeout(timer); cancelAnimationFrame(frame); setPhase('idle'); setNotice('页面切换已取消本题，成绩不受影响。') }
    }
    document.addEventListener('visibilitychange', onHidden)
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', onHidden) }
  }, [phase, displayMs])
  useEffect(() => { if (phase === 'result') nextRef.current?.focus() }, [phase])
  function start() {
    const bytes = crypto.getRandomValues(new Uint8Array(digits))
    setNumber(Array.from(bytes, (byte, index) => String(index === 0 ? byte % 9 + 1 : byte % 10)).join(''))
    submitted.current = false; setAnswer(''); setNotice(''); setPhase('show')
  }
  function config(nextDigits: number, nextMs: number) {
    setDigits(nextDigits); setDisplayMs(nextMs); setPhase('idle'); setResults([]); setNumber(''); setAnswer(''); setNotice('')
  }
  function submit() {
    if (phase !== 'input' || answer.length !== digits || submitted.current) return
    submitted.current = true; setResults(prev => [...prev, answer === number]); setPhase('result')
  }
  const correct = results.filter(Boolean).length
  return <TrainingLayout settings={<><div><h2>训练设置</h2><Options label="显示时长" values={TIMES.map(value => ({ value, label: formatTime(value) }))} value={displayMs} onChange={value => config(digits, value)} /></div><Options label="数字位数" values={[3,4,5,6,7,8,9,10].map(value => ({ value, label: `${value} 位` }))} value={digits} onChange={value => config(value, displayMs)} /><div className="training-note">记住闪现的数字，消失后输入。按 Enter 提交，下一题可继续按 Enter。修改设置会重新统计成绩。<p style={{ marginTop: 8 }}>50 毫秒接近屏幕的数个刷新帧，实际显示受设备刷新率与浏览器调度影响。</p></div></>}>
    <TrainingStats items={[{ label: '答对题数', value: correct }, { label: '已完成', value: results.length }, { label: '正确率', value: results.length ? `${Math.round(correct / results.length * 100)}%` : '—' }]} />
    <div className="training-stage">
      {phase === 'idle' && <><span className="stage-icon"><Icon name="math" size={27} /></span><h2>准备好记住数字了吗？</h2><p>{digits} 位数字 · 显示 {formatTime(displayMs)}</p><button className="primary-button" onClick={start}>开始训练<Icon name="arrow" size={15} /></button></>}
      {phase === 'show' && <><div className="stage-number" data-testid="memory-number">{number}</div><p>记住这个数字</p></>}
      {phase === 'input' && <form style={{ width: '100%', display: 'grid', justifyItems: 'center', gap: 16 }} onSubmit={event => { event.preventDefault(); submit() }}><label htmlFor="memory-answer">输入你记住的 {digits} 位数字</label><input id="memory-answer" className="stage-input utility-field" inputMode="numeric" autoComplete="off" maxLength={digits} value={answer} onChange={event => setAnswer(event.target.value.replace(/\D/g, ''))} autoFocus /><button className="primary-button" disabled={answer.length !== digits}>确认答案</button></form>}
      {phase === 'result' && <><span className="stage-icon" style={{ color: results.at(-1) ? '#16a34a' : '#dc2626' }}><Icon name={results.at(-1) ? 'check' : 'close'} size={27} /></span><h2>{results.at(-1) ? '回答正确' : '再接再厉'}</h2><p>正确答案</p><div className="stage-number">{number}</div>{!results.at(-1) && <p>你的答案：{answer}</p>}<button ref={nextRef} className="primary-button" onClick={start}>下一题<Icon name="arrow" size={15} /></button></>}
    </div>
    <div className="training-actions"><button className="secondary-button" onClick={() => config(digits, displayMs)}>重新开始</button><span className="training-note" role="status">{notice || `${formatTime(displayMs)} · ${digits} 位数字`}</span></div>
  </TrainingLayout>
}
