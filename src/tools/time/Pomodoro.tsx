import { useEffect,useRef,useState } from 'react'
export default function Pomodoro() {
  const [mode,setMode]=useState<'work'|'break'>('work')
  const [work,setWork]=useState(25),[rest,setRest]=useState(5)
  const [remaining,setRemaining]=useState(25*60000),[running,setRunning]=useState(false),[sessions,setSessions]=useState(0)
  const deadline=useRef(0),latest=useRef(25*60000)
  const total=(mode==='work' ? work : rest)*60000
  useEffect(()=>{
    if(!running)return
    const timer=setInterval(()=>{
      const left=Math.max(0,deadline.current-Date.now());latest.current=left;setRemaining(left)
      if(!left){
        if(mode==='work')setSessions(prev=>prev+1)
        const next=mode==='work' ? 'break' : 'work',duration=(next==='work' ? work : rest)*60000
        setMode(next);latest.current=duration;setRemaining(duration);deadline.current=Date.now()+duration
      }
    },200)
    return()=>clearInterval(timer)
  },[running,mode,work,rest])
  function toggle(){if(running){latest.current=Math.max(0,deadline.current-Date.now());setRemaining(latest.current);setRunning(false)}else{deadline.current=Date.now()+latest.current;setRunning(true)}}
  function reset(){setRunning(false);setMode('work');latest.current=work*60000;setRemaining(work*60000)}
  function change(value:number,kind:'work'|'break'){const valid=Math.max(1,Math.min(kind==='work' ? 120 : 60,Math.floor(value)||1));if(kind==='work')setWork(valid);else setRest(valid);setRunning(false);setMode('work');latest.current=(kind==='work' ? valid : work)*60000;setRemaining(latest.current)}
  const seconds=Math.ceil(remaining/1000),percent=Math.max(0,Math.min(100,remaining/total*100))
  return <div className="tool-surface" style={{maxWidth:700,margin:'0 auto'}}><div className="utility-grid"><label><span className="field-label">专注时长（分钟）</span><input className="utility-field" type="number" min={1} max={120} value={work} disabled={running} onChange={event=>change(Number(event.target.value),'work')} /></label><label><span className="field-label">休息时长（分钟）</span><input className="utility-field" type="number" min={1} max={60} value={rest} disabled={running} onChange={event=>change(Number(event.target.value),'break')} /></label></div><div className="training-stage" style={{marginTop:20}}><p role="status">{mode==='work' ? '专注时间' : '休息时间'}</p><div style={{width:220,height:220,borderRadius:'50%',background:`conic-gradient(${mode==='work' ? 'var(--primary)' : '#16a34a'} ${percent}%,var(--border) 0)`,padding:7}}><div style={{width:'100%',height:'100%',borderRadius:'50%',background:'var(--surface)',display:'grid',placeItems:'center'}}><strong style={{font:'600 42px var(--font-mono)'}}>{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</strong></div></div><p>已完成 {sessions} 个专注时段</p></div><div className="training-actions"><button className="primary-button" onClick={toggle}>{running ? '暂停' : '开始'}</button><button className="secondary-button" onClick={reset}>重置计时</button><button className="secondary-button" onClick={()=>{setRunning(false);const next=mode==='work' ? 'break' : 'work';setMode(next);latest.current=(next==='work' ? work : rest)*60000;setRemaining(latest.current)}}>切换到{mode==='work' ? '休息' : '专注'}</button></div></div>
}
