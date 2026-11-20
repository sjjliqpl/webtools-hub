import { useEffect,useRef,useState } from 'react'
export default function Countdown() {
  const [hours,setHours]=useState('0'),[minutes,setMinutes]=useState('0'),[seconds,setSeconds]=useState('30')
  const [remaining,setRemaining]=useState(0),[total,setTotal]=useState(0)
  const [running,setRunning]=useState(false),[finished,setFinished]=useState(false),[error,setError]=useState('')
  const deadline=useRef(0)
  const audio=useRef<AudioContext|null>(null)
  useEffect(()=>()=>{void audio.current?.close()},[])
  useEffect(()=>{
    if(!running)return
    const timer=setInterval(()=>{
      const left=Math.max(0,deadline.current-Date.now())
      setRemaining(left)
      if(!left){
        setRunning(false);setFinished(true)
        const context=audio.current
        if(context&&context.state==='running') {const oscillator=context.createOscillator(),gain=context.createGain();oscillator.frequency.value=880;gain.gain.value=.15;oscillator.connect(gain);gain.connect(context.destination);oscillator.start();oscillator.stop(context.currentTime+.3)}
      }
    },100)
    return()=>clearInterval(timer)
  },[running])
  function start(){
    let value=remaining
    if(value<=0){
      const parts=[hours,minutes,seconds].map(Number)
      if(parts.some(part=>!Number.isInteger(part)||part<0)||parts[0]>99||parts[1]>59||parts[2]>59){setError('小时为 0–99，分钟和秒为 0–59 的整数');return}
      value=(parts[0]*3600+parts[1]*60+parts[2])*1000
      if(value<=0){setError('请设置大于 0 的时间');return}
      setTotal(value)
    }
    setError('');setFinished(false);setRemaining(value);deadline.current=Date.now()+value;setRunning(true)
    try {if(!audio.current)audio.current=new AudioContext();void audio.current.resume().catch(()=>{})}catch{/* Visual completion still works if audio is unavailable. */}
  }
  function reset(){setRunning(false);setRemaining(0);setTotal(0);setFinished(false);setError('')}
  const value=Math.ceil(remaining/1000),pad=(n:number)=>String(n).padStart(2,'0')
  return <div className="tool-surface" style={{maxWidth:700,margin:'0 auto'}}><div className="utility-grid" style={{gridTemplateColumns:'repeat(3,minmax(0,1fr))'}}>{[{label:'小时',value:hours,set:setHours,max:99},{label:'分钟',value:minutes,set:setMinutes,max:59},{label:'秒',value:seconds,set:setSeconds,max:59}].map(field=><label key={field.label}><span className="field-label">{field.label}</span><input className="utility-field" type="number" min={0} max={field.max} disabled={running||remaining>0} value={field.value} onChange={event=>field.set(event.target.value)} /></label>)}</div><div className="training-stage" style={{marginTop:20,minHeight:270}}><strong style={{font:'600 clamp(30px,8vw,58px) var(--font-mono)'}}>{pad(Math.floor(value/3600))}:{pad(Math.floor(value%3600/60))}:{pad(value%60)}</strong><div style={{width:'80%',height:5,borderRadius:4,background:'var(--border)'}}><div style={{width:`${total ? remaining/total*100 : 0}%`,height:'100%',borderRadius:4,background:'var(--primary)'}} /></div><p role="status">{finished ? '时间到！' : running ? '倒计时进行中' : remaining ? '已暂停' : '设置时间，开始倒计时'}</p></div>{error&&<p className="error-message" role="alert">{error}</p>}<div className="training-actions"><button className="primary-button" onClick={()=>running ? (setRemaining(Math.max(0,deadline.current-Date.now())),setRunning(false)) : start()}>{running ? '暂停' : remaining ? '继续' : '开始'}</button><button className="secondary-button" onClick={reset}>重置</button></div></div>
}
