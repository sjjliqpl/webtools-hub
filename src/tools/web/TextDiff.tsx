import { useState } from 'react'
import { diffLines } from '../../lib/toolMath'
import CopyButton from '../../components/CopyButton'
export default function TextDiff() {
  const [before,setBefore]=useState('第一行\n需要修改的内容\n最后一行')
  const [after,setAfter]=useState('第一行\n修改后的内容\n新增一行\n最后一行')
  let lines:ReturnType<typeof diffLines>=[],error=''
  try {lines=diffLines(before,after)} catch(cause) {error=(cause as Error).message}
  const output=lines.map(line=>`${line.type==='add' ? '+' : line.type==='remove' ? '-' : ' '} ${line.text}`).join('\n')
  return <div className="tool-surface"><div className="utility-grid"><div><label htmlFor="diff-before" className="field-label">原始文本</label><textarea id="diff-before" className="utility-field font-mono" rows={9} maxLength={100000} value={before} onChange={event=>setBefore(event.target.value)} /></div><div><label htmlFor="diff-after" className="field-label">修改后文本</label><textarea id="diff-after" className="utility-field font-mono" rows={9} maxLength={100000} value={after} onChange={event=>setAfter(event.target.value)} /></div></div>{error ? <p className="error-message" role="alert">{error}</p> : <><div className="training-actions" style={{justifyContent:'space-between'}}><span className="training-note">新增 {lines.filter(line=>line.type==='add').length} 行 · 删除 {lines.filter(line=>line.type==='remove').length} 行</span><CopyButton key={output} text={output}/></div><div className="utility-output" style={{marginTop:12,padding:0,overflow:'hidden'}}>{lines.map((line,index)=><div key={index} style={{padding:'5px 12px',background:line.type==='add' ? 'light-dark(#f0fdf4,#163a33)' : line.type==='remove' ? 'light-dark(#fef2f2,#452933)' : 'transparent'}}><span style={{display:'inline-block',width:24,color:line.type==='add' ? '#16a34a' : line.type==='remove' ? '#dc2626' : 'var(--muted)'}}>{line.type==='add' ? '+' : line.type==='remove' ? '−' : ' '}</span>{line.text || ' '}</div>)}</div></>}</div>
}
