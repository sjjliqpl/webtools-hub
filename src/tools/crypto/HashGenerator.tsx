import { useEffect, useRef, useState } from 'react'
import CopyButton from '../../components/CopyButton'
const ALGOS=['SHA-1','SHA-256','SHA-384','SHA-512']
export default function HashGenerator(){
  const [text,setText]=useState(''),[hashes,setHashes]=useState<string[]>([]),[loading,setLoading]=useState(false),[error,setError]=useState('')
  const request=useRef(0)
  useEffect(()=>()=>{request.current++},[])
  async function compute(){
    const id=++request.current;setLoading(true);setError('');setHashes([])
    try {
      const data=new TextEncoder().encode(text)
      const results=await Promise.all(ALGOS.map(async algo=>Array.from(new Uint8Array(await crypto.subtle.digest(algo,data)),byte=>byte.toString(16).padStart(2,'0')).join('')))
      if(id===request.current)setHashes(results)
    }catch{if(id===request.current)setError('计算失败，请使用 HTTPS 或本地开发环境')}
    finally{if(id===request.current)setLoading(false)}
  }
  return <div className="tool-surface"><label className="field-label" htmlFor="hash-text">原始文本（支持空文本）</label><textarea id="hash-text" value={text} onChange={event=>{request.current++;setText(event.target.value);setHashes([]);setLoading(false);setError('')}} rows={4} className="utility-field font-mono" /><div className="training-actions"><button className="primary-button" disabled={loading} onClick={compute}>{loading ? '计算中…' : '计算哈希值'}</button></div>{error&&<p className="error-message" role="alert">{error}</p>}{ALGOS.map((algo,index)=><div key={algo} style={{marginTop:16}}><div className="flex items-center justify-between mb-2"><span className="field-label">{algo}</span>{hashes[index]&&<CopyButton key={hashes[index]} text={hashes[index]} />}</div><div className="utility-output font-mono break-all">{hashes[index]||'—'}</div></div>)}</div>
}
