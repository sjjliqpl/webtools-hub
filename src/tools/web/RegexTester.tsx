import { useEffect,useState } from 'react'
import CopyButton from '../../components/CopyButton'
type Result={ matches:{value:string;index:number;groups:string[]}[];error:string }
export default function RegexTester() {
  const [pattern,setPattern]=useState('[a-z]+')
  const [flags,setFlags]=useState('gi')
  const [text,setText]=useState('Hello WebTools 2026')
  const [result,setResult]=useState<Result>({matches:[],error:''})
  useEffect(()=>{
    const worker=new Worker(new URL('./regex.worker.ts',import.meta.url),{type:'module'})
    const timer=setTimeout(()=>{worker.terminate();setResult({matches:[],error:'匹配超过 1 秒，已停止。请简化表达式或缩短文本。'})},1000)
    worker.onmessage=(event:MessageEvent<Result>)=>{clearTimeout(timer);setResult(event.data)}
    worker.onerror=()=>{clearTimeout(timer);setResult({matches:[],error:'无法运行正则测试，请重试。'})}
    worker.postMessage({pattern,flags,text})
    return()=>{clearTimeout(timer);worker.terminate()}
  },[pattern,flags,text])
  const output=result.matches.map(match=>`${match.index}: ${match.value}`).join('\n')
  return <div className="tool-surface"><div className="utility-grid"><div><label className="field-label" htmlFor="regex-pattern">正则表达式</label><input id="regex-pattern" className="utility-field font-mono" value={pattern} onChange={event=>setPattern(event.target.value)} placeholder="例如 [a-z]+" /></div><div><label className="field-label" htmlFor="regex-flags">匹配标志</label><input id="regex-flags" className="utility-field font-mono" value={flags} onChange={event=>setFlags(event.target.value)} placeholder="g i m s u y" /></div></div><label className="field-label" htmlFor="regex-text" style={{marginTop:20}}>测试文本</label><textarea id="regex-text" className="utility-field font-mono" rows={8} maxLength={100000} value={text} onChange={event=>setText(event.target.value)} />
    {result.error ? <p className="error-message" role="alert">{result.error}</p> : <><div className="training-actions" style={{justifyContent:'space-between'}}><span className="training-note" role="status">{result.matches.length} 个匹配{result.matches.length===1000 ? '（仅展示前 1000 个）' : ''}</span><CopyButton key={output} text={output} /></div><div className="utility-output" style={{marginTop:12}}>{result.matches.length ? result.matches.map((match,index)=><div className="result-row" key={index}><span>位置 {match.index}</span><strong>{match.value || '（空匹配）'}{match.groups.length ? ` · 分组 ${JSON.stringify(match.groups)}` : ''}</strong></div>) : '没有匹配结果'}</div></>}
  </div>
}
