import { useState } from 'react'
import Icon from './Icon'
export default function CopyButton({ text }: { text: string }) {
  const [message,setMessage] = useState('')
  async function copy() {
    try { await navigator.clipboard.writeText(text); setMessage('已复制') } catch { setMessage('复制失败，请选择文本复制') }
  }
  return <button className="secondary-button" disabled={!text} onClick={copy}><Icon name={message==='已复制' ? 'check' : 'copy'} size={14} /><span role="status">{message || '复制结果'}</span></button>
}
