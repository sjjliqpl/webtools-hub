import type { ReactNode } from 'react'
export function TrainingStats({ items }: { items: { label: string; value: ReactNode }[] }) {
  return <div className="training-stats">{items.map(item => <div className="training-stat" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>
}
export function Options({ label, values, value, onChange, disabled = false }: { label: string; values: { label: string; value: number }[]; value: number; onChange: (value: number) => void; disabled?: boolean }) {
  return <div><span className="field-label">{label}</span><div className="option-group">{values.map(item => <button key={item.value} className="option-button" aria-pressed={value === item.value} disabled={disabled} onClick={() => onChange(item.value)}>{item.label}</button>)}</div></div>
}
export function TrainingLayout({ children, settings }: { children: ReactNode; settings: ReactNode }) {
  return <div className="training-layout"><div className="training-main">{children}</div><aside className="training-settings">{settings}</aside></div>
}
