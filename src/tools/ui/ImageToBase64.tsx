import { useEffect, useRef, useState } from 'react'
import CopyButton from '../../components/CopyButton'
export default function ImageToBase64(){
  const [result,setResult]=useState<{data:string;name:string;size:number}|null>(null)
  const [error,setError]=useState(''),[busy,setBusy]=useState(false),[dragging,setDragging]=useState(false)
  const reader=useRef<FileReader|null>(null)
  useEffect(()=>()=>{reader.current?.abort()},[])
  function process(file:File){
    reader.current?.abort();setResult(null);setError('');setBusy(false)
    if(!['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','image/avif','image/bmp'].includes(file.type)){setError('请选择 PNG、JPG、WebP、GIF、SVG、AVIF 或 BMP 图片');return}
    if(file.size>10*1024*1024){setError('图片不能超过 10 MB');return}
    const next=new FileReader();reader.current=next;setBusy(true)
    next.onload=()=>{setResult({data:String(next.result),name:file.name,size:file.size});setBusy(false)}
    next.onerror=()=>{setError('无法读取此图片，请重新选择');setBusy(false)}
    next.readAsDataURL(file)
  }
  return <div className="tool-surface space-y-5"><div className={`relative grid justify-items-center gap-2 rounded-md border-2 border-dashed p-8 ${dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50'}`} onDragOver={event=>{event.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={event=>{event.preventDefault();setDragging(false);const file=event.dataTransfer.files[0];if(file)process(file)}}><p>拖入图片或点击选择</p><span className="training-note">最大 10 MB · 在本地转换</span><input type="file" accept="image/*" aria-label="选择图片" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={event=>{const file=event.target.files?.[0];if(file)process(file);event.target.value=''}} /></div>{busy&&<p role="status">正在读取…</p>}{error&&<p role="alert" className="error-message">{error}</p>}{result&&<><div className="flex flex-col sm:flex-row items-start gap-4"><img src={result.data} alt="图片预览" className="max-w-full sm:max-w-[50%] max-h-48 rounded-md border border-slate-200 object-contain" /><div className="text-sm break-all min-w-0"><p>{result.name}</p><p>{(result.size/1024).toFixed(1)} KB</p><p>{result.data.length.toLocaleString()} 字符（含 Data URL 前缀）</p></div></div><div className="flex items-center justify-between"><label htmlFor="base64-output" className="field-label">Data URL</label><CopyButton key={result.data} text={result.data} /></div><textarea id="base64-output" readOnly value={result.data} rows={6} className="utility-field font-mono" /></>}</div>
}
