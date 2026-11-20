import { marked } from 'marked'
import { useApp } from '../context/useApp'
export default function MarkdownFrame({ text }: { text: string }) {
  const { theme } = useApp()
  const dark = theme === 'dark'
  const html = marked.parse(text) as string
  const document = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; base-uri 'none'; form-action 'none'"><style>*{box-sizing:border-box}body{margin:0;padding:16px;font:14px/1.8 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;overflow-wrap:anywhere;color:${dark ? '#e2e8f0' : '#172b46'};background:${dark ? '#172234' : '#fff'}}h1{font-size:24px}h2{font-size:20px}h3{font-size:17px}h1,h2,h3{line-height:1.5}pre{padding:12px;border-radius:6px;background:${dark ? '#101827' : '#f8f9fc'};overflow:auto}code{font-family:ui-monospace,monospace}a{color:#2563eb}blockquote{margin-left:0;padding-left:16px;border-left:3px solid #93c5fd}table{border-collapse:collapse;max-width:100%}td,th{padding:6px 10px;border:1px solid #94a3b8}img{max-width:100%}</style></head><body>${html}</body></html>`
  return <iframe title="Markdown 预览内容" sandbox="" referrerPolicy="no-referrer" srcDoc={document} style={{ width: '100%', minHeight: 420, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)' }} />
}
