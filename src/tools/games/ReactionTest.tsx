import { useEffect,useRef,useState } from 'react'
import { TrainingStats } from '../../components/Training'
type Phase='idle'|'waiting'|'ready'|'early'|'result'
export default function ReactionTest() {
  const [phase,setPhase]=useState<Phase>('idle')
  const [attempts,setAttempts]=useState<number[]>([])
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const frame=useRef(0)
  const started=useRef(0)
  function clear(){if(timer.current)clearTimeout(timer.current);cancelAnimationFrame(frame.current)}
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);cancelAnimationFrame(frame.current)},[])
  function act(){
    if(phase==='waiting'){clear();setPhase('early');return}
    if(phase==='ready') {setAttempts(prev=>[...prev,Math.round(performance.now()-started.current)]);setPhase('result');return}
    clear();setPhase('waiting')
    timer.current=setTimeout(()=>{frame.current=requestAnimationFrame(()=>{started.current=performance.now();setPhase('ready')})},1200+Math.random()*2800)
  }
  useEffect(()=>{
    function hidden(){if(document.hidden){if(timer.current)clearTimeout(timer.current);cancelAnimationFrame(frame.current);setPhase('idle')}}
    document.addEventListener('visibilitychange',hidden);return()=>document.removeEventListener('visibilitychange',hidden)
  },[])
  const average=attempts.length ? Math.round(attempts.reduce((a,b)=>a+b,0)/attempts.length) : 0
  const labels={idle:'准备好了吗？',waiting:'等待变绿…',ready:'现在点击！',early:'抢跑了，点击重试',result:`${attempts.at(-1)} 毫秒`}
  return <div className="tool-surface"><TrainingStats items={[{label:'已完成',value:attempts.length},{label:'平均反应',value:average ? `${average}ms` : '—'},{label:'最快反应',value:attempts.length ? `${Math.min(...attempts)}ms` : '—'}]} />
    <button className="training-stage" style={{width:'100%',background:phase==='waiting' ? '#dc2626' : phase==='ready' ? '#16a34a' : 'var(--canvas)',color:phase==='waiting'||phase==='ready' ? 'white' : 'var(--text)',touchAction:'none'}} onPointerDown={event=>{if(event.button===0){event.preventDefault();event.currentTarget.focus();act()}}} onKeyDown={event=>{if(!event.repeat&&(event.code==='Space'||event.key==='Enter')){event.preventDefault();event.currentTarget.focus();act()}}}><strong style={{fontSize:28}}>{labels[phase]}</strong><span>{phase==='idle' ? '点击开始，变绿后立即点击，也支持空格或 Enter。' : phase==='result' ? '点击继续下一次测试' : phase==='early' ? '等到区域变成绿色再响应' : '集中注意力，准备响应'}</span></button>
    <div className="training-actions"><button className="secondary-button" onClick={()=>{clear();setPhase('idle');setAttempts([])}}>重置</button><span className="training-note">切换到后台会取消当前等待，避免污染成绩。</span></div>
  </div>
}
