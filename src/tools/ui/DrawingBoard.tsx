import { useEffect, useRef, useState, type PointerEvent } from 'react'
const COLORS=['#000000','#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899']
export default function DrawingBoard(){
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const drawing=useRef(false)
  const [color,setColor]=useState('#000000'),[brush,setBrush]=useState(4)
  useEffect(()=>{
    const canvas=canvasRef.current!
    const ratio=Math.min(window.devicePixelRatio||1,3)
    canvas.width=Math.round(canvas.clientWidth*ratio);canvas.height=Math.round(canvas.clientHeight*ratio)
    const context=canvas.getContext('2d')!
    context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height)
  },[])
  function position(event:PointerEvent<HTMLCanvasElement>){
    const canvas=event.currentTarget,rect=canvas.getBoundingClientRect()
    return {x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height,scale:canvas.width/rect.width}
  }
  function start(event:PointerEvent<HTMLCanvasElement>){
    if(event.button!==0)return
    const canvas=event.currentTarget,context=canvas.getContext('2d')!,point=position(event)
    canvas.setPointerCapture(event.pointerId);drawing.current=true
    context.fillStyle=color;context.beginPath();context.arc(point.x,point.y,brush*point.scale/2,0,Math.PI*2);context.fill()
    context.beginPath();context.moveTo(point.x,point.y)
  }
  function move(event:PointerEvent<HTMLCanvasElement>){
    if(!drawing.current)return
    const context=event.currentTarget.getContext('2d')!,point=position(event)
    context.strokeStyle=color;context.lineWidth=brush*point.scale;context.lineCap='round';context.lineJoin='round';context.lineTo(point.x,point.y);context.stroke()
  }
  function clear(){const canvas=canvasRef.current!,context=canvas.getContext('2d')!;drawing.current=false;context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height)}
  function save(){const link=document.createElement('a');link.download='drawing.png';link.href=canvasRef.current!.toDataURL('image/png');link.click()}
  return <div className="tool-surface space-y-4"><div className="flex flex-wrap items-center gap-4"><div className="flex flex-wrap items-center gap-1.5">{COLORS.map(value=><button key={value} className="color-swatch h-7 w-7 rounded-full border-2" style={{background:value,borderColor:color===value ? 'var(--text)' : 'transparent'}} aria-label={`画笔颜色 ${value}`} aria-pressed={color===value} onClick={()=>setColor(value)} />)}<input aria-label="自选画笔颜色" type="color" value={color} onChange={event=>setColor(event.target.value)} className="h-7 w-7 cursor-pointer" /></div><label className="flex items-center gap-2 text-xs">粗细<input type="range" min={1} max={20} value={brush} onChange={event=>setBrush(Number(event.target.value))} className="w-24" />{brush}px</label><div className="flex gap-2 ml-auto"><button className="secondary-button" onClick={clear}>清空</button><button className="primary-button" onClick={save}>保存 PNG</button></div></div><canvas ref={canvasRef} aria-label="绘画区域" className="w-full h-80 rounded-md border border-slate-200 cursor-crosshair touch-none" style={{background:'#fff'}} onPointerDown={start} onPointerMove={move} onPointerUp={()=>{drawing.current=false}} onPointerCancel={()=>{drawing.current=false}} onLostPointerCapture={()=>{drawing.current=false}} /></div>
}
