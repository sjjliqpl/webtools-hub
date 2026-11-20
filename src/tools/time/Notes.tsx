import { useState } from 'react'
import MarkdownFrame from '../../components/MarkdownFrame'
const STORAGE_KEY = 'notes-tool-content'
export default function Notes() {
  const [text,setText] = useState(() => { try { return localStorage.getItem(STORAGE_KEY) || '' } catch { return '' } })
  const [preview,setPreview] = useState(false)
  const [message,setMessage] = useState('')
  function change(value:string) {
    setText(value)
    try { localStorage.setItem(STORAGE_KEY,value);setMessage('已保存到本地') } catch { setMessage('本地存储空间不足，请下载备份') }
  }
  function download() {
    const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}))
    const link=document.createElement('a');link.href=url;link.download='notes.md';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
  }
  return <div className="tool-surface"><div className="training-actions" style={{marginTop:0,marginBottom:16}}><button className="primary-button" onClick={()=>setPreview(!preview)}>{preview ? '继续编辑' : '预览 Markdown'}</button><button className="secondary-button" disabled={!text} onClick={download}>下载笔记</button><span className="training-note" role="status">{message}</span></div>{preview ? <MarkdownFrame text={text}/> : <textarea aria-label="笔记内容" className="utility-field font-mono" style={{minHeight:420}} value={text} onChange={event=>change(event.target.value)} placeholder="开始记录，支持 Markdown…"/>}<p className="status-message">{Array.from(text).length} 字符 · {text ? text.split('\n').length : 0} 行</p></div>
}
