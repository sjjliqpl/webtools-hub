import { useRef,useState } from 'react'
import { Options,TrainingStats } from './Training'
import { useTimedSession } from '../hooks/useTimedSession'
const DIFFICULTIES=[{label:'简单',size:64,min:28,dots:1},{label:'普通',size:48,min:22,dots:1},{label:'困难',size:36,min:16,dots:2},{label:'极难',size:28,min:12,dots:3}]
type Target={id:number;x:number;y:number}
function positions(count:number):Target[] {
  const result:Target[]=[]
  for(let id=0;id<count;id++) {
    let point={id,x:50,y:50}
    for(let trial=0;trial<100;trial++) {
      point={id,x:16+Math.random()*68,y:14+Math.random()*72}
      if(result.every(other=>Math.hypot(other.x-point.x,other.y-point.y)>24))break
    }
    result.push(point)
  }
  return result
}
export default function TargetPractice({mode}:{mode:'aim'|'precision'}) {
  const timed=mode==='aim'
  const session=useTimedSession(30)
  const [playing,setPlaying]=useState(false)
  const [finished,setFinished]=useState(false)
  const [difficulty,setDifficulty]=useState(1)
  const [hits,setHits]=useState(0)
  const [misses,setMisses]=useState(0)
  const [times,setTimes]=useState<number[]>([])
  const [targets,setTargets]=useState<Target[]>([])
  const [message,setMessage]=useState('')
  const startTime=useRef(0)
  const diff=DIFFICULTIES[difficulty]
  const active=timed ? session.running : playing
  const done=timed ? session.finished : finished
  const size=timed ? diff.size : Math.max(diff.min,diff.size-hits*3)
  function start(){setHits(0);setMisses(0);setTimes([]);setTargets(positions(timed ? 1 : diff.dots));setMessage('');startTime.current=performance.now();if(timed)session.start();else{setPlaying(true);setFinished(false)}}
  function hit(id:number, now:number){
    if(!active||(timed&&!session.isLive()))return
    setTimes(prev=>[...prev,Math.round(now-startTime.current)]);startTime.current=now;setHits(prev=>prev+1);setMessage('')
    if(!timed&&hits+1>=10){setPlaying(false);setFinished(true);return}
    const remaining=targets.filter(target=>target.id!==id)
    setTargets(remaining.length ? remaining : positions(timed ? 1 : diff.dots))
  }
  function reset(){session.reset();setPlaying(false);setFinished(false);setHits(0);setMisses(0);setTimes([]);setMessage('')}
  const accuracy=hits+misses ? Math.round(hits/(hits+misses)*100) : 0
  const average=times.length ? Math.round(times.reduce((a,b)=>a+b,0)/times.length) : 0
  return <div className="tool-surface"><TrainingStats items={[{label:'命中次数',value:timed ? hits : `${hits}/10`},{label:timed ? '剩余时间' : '平均用时',value:timed ? `${Math.ceil(session.remaining)}s` : average ? `${average}ms` : '—'},{label:'准确率',value:hits+misses ? `${accuracy}%` : '—'}]} /><Options label="训练难度" value={difficulty} values={DIFFICULTIES.map((item,index)=>({value:index,label:item.label}))} disabled={active} onChange={value=>{setDifficulty(value);reset()}} />
    <div className="training-stage target-stage" style={{marginTop:16,height:380,cursor:active ? 'crosshair' : 'default',touchAction:'none'}} onPointerDown={event=>{if(active&&event.button===0&&(!timed||session.isLive())){setMisses(prev=>prev+1);setMessage('未命中，继续瞄准')}}}>
      {active ? targets.map(target=><button key={target.id} className="training-target" aria-label="训练目标" style={{width:size,height:size,left:`${target.x}%`,top:`${target.y}%`}} onPointerDown={event=>{event.stopPropagation();if(event.button===0){event.preventDefault();hit(target.id,event.timeStamp)}}} />) : <><h2>{done ? '训练完成' : timed ? '瞄准目标，快速点击' : '让每一次点击更准确'}</h2><p>{done ? `命中 ${hits} 次 · 未命中 ${misses} 次 · 平均 ${average} 毫秒` : timed ? '30 秒内尽可能快地点击出现的目标。' : `完成 10 次命中，目标会逐渐缩小，同时显示 ${diff.dots} 个。`}</p><button className="primary-button" onClick={start}>{done ? '再练一次' : '开始训练'}</button></>}
    </div><div className="training-actions"><button className="secondary-button" onClick={reset}>重置</button><span className="training-note" role="status">{message||'漏点计入准确率，命中后目标会切换位置。'}</span></div></div>
}
