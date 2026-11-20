import { useEffect,useRef,useState } from 'react'
function size(bytes:number) { return bytes<1024*1024 ? `${(bytes/1024).toFixed(1)} KB` : `${(bytes/1024/1024).toFixed(2)} MB` }
export default function ImageCompressor() {
  const [file,setFile]=useState<File|null>(null)
  const [quality,setQuality]=useState(80)
  const [width,setWidth]=useState(1920)
  const [format,setFormat]=useState('image/webp')
  const [result,setResult]=useState<{url:string;size:number;width:number;height:number;type:string}|null>(null)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const generation=useRef(0)
  useEffect(()=>()=>{generation.current++},[])
  useEffect(()=>()=>{if(result)URL.revokeObjectURL(result.url)},[result])
  async function compress() {
    if(!file || busy)return
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>20*1024*1024) {setError('请选择 20 MB 以内的 JPG、PNG 或 WebP 图片');return}
    const request=++generation.current
    setBusy(true);setError('');setResult(null)
    try {
      const image=await createImageBitmap(file)
      if(image.width*image.height>40_000_000) {image.close();throw new Error('图片超过 4000 万像素，请先缩小尺寸')}
      const scale=Math.min(1,width/image.width)
      const canvas=document.createElement('canvas')
      canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale))
      const context=canvas.getContext('2d')!
      if(format==='image/jpeg'){context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height)}
      context.drawImage(image,0,0,canvas.width,canvas.height);image.close()
      const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value ? resolve(value) : reject(new Error('图片转换失败')),format,quality/100))
      if(request===generation.current)setResult({url:URL.createObjectURL(blob),size:blob.size,width:canvas.width,height:canvas.height,type:blob.type})
    }catch(cause){if(request===generation.current)setError((cause as Error).message)}finally{if(request===generation.current)setBusy(false)}
  }
  function clearResult(){generation.current++;setBusy(false);setResult(null);setError('')}
  return <div className="tool-surface"><label className="field-label" htmlFor="compress-file">选择图片（JPG / PNG / WebP，最大 20 MB）</label><input id="compress-file" type="file" accept="image/jpeg,image/png,image/webp" className="utility-field" onChange={event=>{clearResult();setFile(event.target.files?.[0]||null)}} /><div className="utility-grid" style={{marginTop:20}}><div><label className="field-label" htmlFor="compress-quality">质量 {quality}%</label><input id="compress-quality" type="range" min={10} max={100} value={quality} onChange={event=>{clearResult();setQuality(Number(event.target.value))}} /></div><div><label className="field-label" htmlFor="compress-width">最大宽度（不放大原图）</label><input id="compress-width" className="utility-field" type="number" min={64} max={4096} value={width} onChange={event=>{clearResult();setWidth(Math.max(64,Math.min(4096,Number(event.target.value)||64)))}} /></div></div><div className="training-actions"><select className="utility-field" style={{width:140}} value={format} onChange={event=>{clearResult();setFormat(event.target.value)}} aria-label="输出格式"><option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option></select><button className="primary-button" disabled={!file||busy} onClick={compress}>{busy ? '正在处理…' : '压缩图片'}</button></div>{error&&<p className="error-message" role="alert">{error}</p>}{file&&<p className="status-message">{file.name} · 原图 {size(file.size)}</p>}{result&&<><p className="status-message" role="status">压缩后 {size(result.size)} · {result.width} × {result.height} · {file&&result.size<file.size ? `减少 ${Math.round((1-result.size/file.size)*100)}%` : '体积未减少，可降低质量或尺寸'}</p><img src={result.url} alt="压缩结果预览" style={{maxWidth:'100%',maxHeight:350,marginTop:16,objectFit:'contain',borderRadius:6}} /><a className="primary-button" style={{marginTop:16}} href={result.url} download={`compressed-${file?.name.replace(/\.[^.]+$/,'')}.${result.type==='image/webp' ? 'webp' : result.type==='image/jpeg' ? 'jpg' : 'png'}`}>下载图片</a></>}</div>
}
