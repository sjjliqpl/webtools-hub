import { useState } from 'react'
import CopyButton from '../../components/CopyButton'
export default function UrlParser() {
  const [input,setInput]=useState('https://example.com:8080/search?q=WebTools&lang=zh#results')
  let parsed:URL|null=null,error=''
  try { if(input.trim()) parsed=new URL(input) } catch { error='请输入完整的 URL，例如 https://example.com/path?a=1' }
  const parts=parsed ? [['协议',parsed.protocol],['主机名',parsed.hostname],['端口',parsed.port || '默认端口'],['路径',parsed.pathname],['查询字符串',parsed.search],['片段',parsed.hash],['来源',parsed.origin]] : []
  return <div className="tool-surface"><label className="field-label" htmlFor="parse-url">URL 地址</label><textarea id="parse-url" rows={3} className="utility-field font-mono" value={input} onChange={event=>setInput(event.target.value)} />{error && <p className="error-message" role="alert">{error}</p>}{parsed && <><div className="training-actions"><CopyButton key={parsed.href} text={parsed.href} /></div><div className="utility-grid" style={{marginTop:20}}><div><h2 style={{fontWeight:600,marginBottom:8}}>地址结构</h2>{parts.map(([label,value])=><div key={label} className="result-row"><span>{label}</span><strong style={{overflowWrap:'anywhere',textAlign:'right',maxWidth:'75%'}}>{value || '—'}</strong></div>)}</div><div><h2 style={{fontWeight:600,marginBottom:8}}>查询参数</h2>{Array.from(parsed.searchParams).length ? Array.from(parsed.searchParams).map(([key,value],index)=><div className="result-row" key={index}><span style={{overflowWrap:'anywhere',maxWidth:'45%'}}>{key}</span><strong style={{overflowWrap:'anywhere',textAlign:'right',maxWidth:'50%'}}>{value || '（空值）'}</strong></div>) : <p className="training-note">没有查询参数</p>}</div></div></>}</div>
}
