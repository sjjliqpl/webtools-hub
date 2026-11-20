import { useRef,useState } from 'react'
import { TrainingStats } from '../../components/Training'
const COLORS = [{ name:'红色',color:'#dc2626' },{ name:'蓝色',color:'#2563eb' },{ name:'绿色',color:'#16a34a' },{ name:'紫色',color:'#9333ea' }]
function createPrompt() { const ink=Math.floor(Math.random()*4); return { ink,word:(ink+1+Math.floor(Math.random()*3))%4 } }
export default function StroopTest() {
  const [active,setActive]=useState(false)
  const [prompt,setPrompt]=useState({ word:0,ink:1 })
  const [answers,setAnswers]=useState<{ correct:boolean;ms:number }[]>([])
  const started=useRef(0)
  function handleNext(timestamp:number) { setPrompt(createPrompt());started.current=timestamp }
  function start(event:React.MouseEvent<HTMLButtonElement>) { setAnswers([]);setActive(true);handleNext(event.timeStamp) }
  const correct=answers.filter(answer=>answer.correct).length
  const average=answers.length ? Math.round(answers.reduce((sum,answer)=>sum+answer.ms,0)/answers.length) : 0
  function choose(index:number,timestamp:number) { if(!active)return;setAnswers(prev=>[...prev,{correct:index===prompt.ink,ms:Math.round(timestamp-started.current)}]);if(answers.length===19)setActive(false);else handleNext(timestamp) }
  return <div className="tool-surface"><TrainingStats items={[{label:'完成题数',value:`${answers.length}/20`},{label:'正确题数',value:correct},{label:'平均用时',value:average ? `${average}ms` : '—'}]} /><div className="training-stage">
    {active ? <><p>选择文字的墨水颜色</p><strong style={{fontSize:58,fontWeight:650,color:COLORS[prompt.ink].color}}>{COLORS[prompt.word].name}</strong><div className="option-group">{COLORS.map((color,index)=><button className="secondary-button" key={color.name} onClick={event=>choose(index,event.timeStamp)}>{color.name}</button>)}</div></> : <><h2>{answers.length ? '训练完成' : '颜色干扰训练'}</h2><p>{answers.length ? `20 题答对 ${correct} 题，正确率 ${Math.round(correct/20*100)}%` : '忽略文字含义，选择文字实际显示的颜色，共 20 题。'}</p><button className="primary-button" onClick={start}>{answers.length ? '再练一次' : '开始训练'}</button></>}
  </div><div className="training-actions"><button className="secondary-button" onClick={()=>{setActive(false);setAnswers([])}}>重置</button></div></div>
}
