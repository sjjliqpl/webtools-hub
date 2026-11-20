import { useEffect, useRef, useState } from 'react'
import { TrainingStats } from '../../components/Training'
type Phase = 'idle' | 'show' | 'input' | 'passed' | 'failed'
export default function SequenceMemory() {
  const [phase,setPhase] = useState<Phase>('idle')
  const [sequence,setSequence] = useState<number[]>([])
  const [lit,setLit] = useState(-1)
  const [step,setStep] = useState(0)
  const [best,setBest] = useState(0)
  const lock = useRef(false)
  useEffect(() => {
    if (phase !== 'show') return
    const timers: ReturnType<typeof setTimeout>[] = []
    sequence.forEach((cell,index) => {
      timers.push(setTimeout(() => setLit(cell),400+index*700))
      timers.push(setTimeout(() => setLit(-1),850+index*700))
    })
    timers.push(setTimeout(() => { lock.current=false; setPhase('input') },400+sequence.length*700))
    return () => timers.forEach(clearTimeout)
  }, [phase,sequence])
  function play(next: number[]) { lock.current=true; setSequence(next);setStep(0);setLit(-1);setPhase('show') }
  function choose(cell:number) {
    if (phase !== 'input' || lock.current) return
    if (sequence[step] !== cell) { lock.current=true;setPhase('failed');return }
    if (step+1 === sequence.length) { lock.current=true;setBest(prev=>Math.max(prev,sequence.length));setPhase('passed') }
    setStep(prev=>prev+1)
  }
  return <div className="tool-surface"><TrainingStats items={[{ label:'当前长度',value:sequence.length || '—' },{ label:'已输入',value:step },{ label:'本次最佳',value:best }]} /><div className="training-stage"><h2>{phase === 'show' ? '记住闪烁顺序' : phase === 'input' ? '按顺序点击方格' : phase === 'passed' ? '顺序正确' : phase === 'failed' ? '顺序不对，再试一次' : '记住位置，也记住顺序'}</h2>
    {(phase === 'show' || phase === 'input') ? <div className="training-grid">{Array.from({ length:9 },(_,cell)=><button key={cell} aria-label={`方格 ${cell+1}`} className={`training-cell ${lit===cell ? 'is-lit' : ''}`} disabled={phase!=='input'} onClick={()=>choose(cell)}>{cell+1}</button>)}</div> : <><p>{phase==='failed' ? `正确顺序：${sequence.map(cell=>cell+1).join(' → ')}` : '从一个位置开始，每轮增加一步。'}</p><button className="primary-button" onClick={()=>play(phase==='passed' ? [...sequence,Math.floor(Math.random()*9)] : [Math.floor(Math.random()*9)])}>{phase==='passed' ? '下一关' : '开始训练'}</button></>}
  </div><div className="training-actions"><button className="secondary-button" onClick={()=>{setPhase('idle');setSequence([]);setStep(0);setLit(-1)}}>重新开始</button></div></div>
}
