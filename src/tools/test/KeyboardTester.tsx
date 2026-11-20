import { useState } from 'react'
const ROWS = [
 ['Escape','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12'],
 ['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','Backspace'],
 ['Tab','KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash'],
 ['CapsLock','KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Enter'],
 ['ShiftLeft','KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash','ShiftRight'],
 ['ControlLeft','AltLeft','MetaLeft','Space','MetaRight','AltRight','ControlRight','ArrowLeft','ArrowUp','ArrowDown','ArrowRight'],
]
const LABELS: Record<string,string> = { Backquote:'`',Minus:'−',Equal:'=',BracketLeft:'[',BracketRight:']',Backslash:'\\',Semicolon:';',Quote:"'",Comma:',',Period:'.',Slash:'/',ShiftLeft:'Shift L',ShiftRight:'Shift R',ControlLeft:'Ctrl L',ControlRight:'Ctrl R',AltLeft:'Alt L',AltRight:'Alt R',MetaLeft:'Meta L',MetaRight:'Meta R',ArrowLeft:'←',ArrowRight:'→',ArrowUp:'↑',ArrowDown:'↓' }
export default function KeyboardTester() {
  const [pressed, setPressed] = useState<string[]>([])
  const [tested, setTested] = useState<string[]>([])
  const [last, setLast] = useState({ key:'—', code:'—', repeat:false })
  return <div className="tool-surface"><div className="training-stage" tabIndex={0} aria-label="键盘检测区域" onBlur={() => setPressed([])} onKeyDown={event => {
    if (event.key === 'Tab') return
    if (!event.metaKey && !event.ctrlKey) event.preventDefault()
    setLast({ key: event.key === ' ' ? 'Space' : event.key, code:event.code, repeat:event.repeat })
    setPressed(prev => [...new Set([...prev,event.code])]); setTested(prev => [...new Set([...prev,event.code])])
  }} onKeyUp={event => setPressed(prev => prev.filter(key => key !== event.code))}>
    <h2>点击此区域，开始检测键盘</h2><p>已测试 {tested.length} 个按键 · Tab 可离开检测区</p>
    <div style={{ width:'100%',overflowX:'auto' }}>{ROWS.map((row,i) => <div className="key-board" style={{ margin:'0 auto 6px', flexWrap:'nowrap', minWidth:620 }} key={i}>{row.map(code => <span key={code} className={`key-cap ${pressed.includes(code) ? 'pressed' : tested.includes(code) ? 'tested' : ''}`} style={code === 'Space' ? { flex:1 } : undefined}>{LABELS[code] || code.replace(/^(Key|Digit)/,'')}</span>)}</div>)}</div>
    <div className="option-group"><span>key: <strong>{last.key}</strong></span><span>code: <strong>{last.code}</strong></span><span>{last.repeat ? '长按重复' : '单次按键'}</span></div>
  </div><div className="training-actions"><button className="secondary-button" onClick={() => { setPressed([]); setTested([]); setLast({ key:'—',code:'—',repeat:false }) }}>清空记录</button><span className="training-note">系统或浏览器保留的快捷键可能无法检测，记录仅在本次页面保留。</span></div></div>
}
