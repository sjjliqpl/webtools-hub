import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { categories, tools } from '../data/tools'
import { categoryNames } from '../i18n/translations'
import { useApp } from '../context/useApp'
import Icon from './Icon'

interface Props { children: ReactNode; title: string; description: string; category?: string; actions?: ReactNode; count?: number }
export default function AppShell({ children, title, description, category, actions, count }: Props) {
  const { lang, setLang, theme, toggleTheme, favorites } = useApp()
  const zh = lang === 'zh'
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const [notice, setNotice] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState(params.get('q') || '')
  const searchRef = useRef<HTMLInputElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const isTool = location.pathname.startsWith('/tool/')
  const active = category || params.get('category') || 'all'
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchRef.current?.focus() }
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); toggleRef.current?.focus() }
      if (menuOpen && event.key === 'Tab') {
        const nodes = sidebarRef.current?.querySelectorAll<HTMLElement>('a,button')
        if (!nodes?.length) return
        const first = nodes[0], last = nodes[nodes.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [menuOpen])
  useEffect(() => {
    if (menuOpen) sidebarRef.current?.querySelector<HTMLElement>('a')?.focus()
  }, [menuOpen])
  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const resize = () => { if (!media.matches) setMenuOpen(false) }
    media.addEventListener('change', resize)
    return () => media.removeEventListener('change', resize)
  }, [])
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    function show(event: Event) { setNotice((event as CustomEvent<string>).detail); clearTimeout(timer); timer = setTimeout(() => setNotice(''), 4000) }
    window.addEventListener('webtools-notice', show)
    return () => { clearTimeout(timer); window.removeEventListener('webtools-notice', show) }
  }, [])
  function search(value: string) {
    setQuery(value)
    const next = new URLSearchParams()
    if (!isTool && active !== 'all') next.set('category', active)
    if (value) next.set('q', value)
    navigate({ pathname: '/', search: next.toString() }, { replace: !isTool })
  }
  const links = [
    { id: 'all', name: zh ? '全部工具' : 'All tools', icon: 'grid', count: tools.length },
    { id: 'favorites', name: zh ? '我的收藏' : 'Favorites', icon: 'star', count: favorites.length },
    { id: 'recent', name: zh ? '最近使用' : 'Recent', icon: 'time' },
  ]
  return <div className={`app-shell ${collapsed ? 'is-collapsed' : ''} ${menuOpen ? 'is-menu-open' : ''}`}>
    {notice && <div className="app-toast" role="status">{notice}</div>}
    <a className="skip-link" href="#page-content">{zh ? '跳转到主要内容' : 'Skip to content'}</a>
    <aside ref={sidebarRef} className="sidebar" aria-label={zh ? '工具导航' : 'Tool navigation'} role={menuOpen ? 'dialog' : undefined} aria-modal={menuOpen || undefined}>
      <Link className="brand" to="/" onClick={() => { setQuery(''); setMenuOpen(false) }} title="WebTools Hub"><span className="brand-mark"><Icon name="grid" size={19} /></span><span className="brand-name">WebTools Hub</span></Link>
      <button className="icon-button mobile-close" aria-label="关闭导航" onClick={() => { setMenuOpen(false); toggleRef.current?.focus() }}><Icon name="close" /></button>
      <nav className="navigation">
        <p className="nav-label">{zh ? '工作空间' : 'WORKSPACE'}</p>
        {links.map(item => <Link key={item.id} className="nav-link" to={item.id === 'all' ? '/' : `/?category=${item.id}`} aria-current={active === item.id ? 'page' : undefined} title={item.name} onClick={() => { setQuery(''); setMenuOpen(false) }}><Icon name={item.icon} /><span className="nav-text">{item.name}</span>{item.count !== undefined && <span className="nav-count">{item.count}</span>}</Link>)}
        <p className="nav-label system">{zh ? '工具分类' : 'CATEGORIES'}</p>
        {categories.map(item => <Link key={item.id} className="nav-link" to={`/?category=${item.id}`} title={categoryNames[item.id]?.[lang] || item.name} aria-current={active === item.id ? 'page' : undefined} onClick={() => { setQuery(''); setMenuOpen(false) }}><Icon name={item.id} /><span className="nav-text">{categoryNames[item.id]?.[lang] || item.name}</span><span className="nav-count">{tools.filter(tool => tool.category === item.id).length}</span></Link>)}
      </nav>
      <div className="sidebar-footer"><Icon name="shield" size={16} /><span>{zh ? '本地处理 · 即开即用' : 'Local processing'}</span></div>
    </aside>
    {menuOpen && <button className="menu-backdrop" aria-label="关闭导航" onClick={() => { setMenuOpen(false); toggleRef.current?.focus() }} tabIndex={-1} />}
    <header className="app-header" inert={menuOpen}>
      <div className="header-start"><button ref={toggleRef} className="icon-button" aria-label={zh ? '切换导航' : 'Toggle navigation'} aria-expanded={menuOpen || !collapsed} onClick={() => { if (window.matchMedia('(max-width: 640px)').matches) setMenuOpen(!menuOpen); else setCollapsed(!collapsed) }}><Icon name="menu" /></button><span className="workspace-title">{zh ? '工具工作台' : 'Workspace'}</span></div>
      <form className="global-search" role="search" onSubmit={e => { e.preventDefault(); search(searchRef.current?.value || "") }}><Icon name="search" size={17} /><input ref={searchRef} aria-label={zh ? '搜索工具' : 'Search tools'} type="search" value={isTool ? query : (params.get('q') || '')} onChange={e => search(e.target.value)} placeholder={zh ? '搜索工具、功能或关键词…' : 'Search tools or keywords…'} /><kbd>⌘ K</kbd></form>
      <div className="header-actions"><button className="language-button" onClick={() => setLang(zh ? 'en' : 'zh')}>{zh ? 'EN' : '中文'}</button><button className="icon-button" aria-label={zh ? '切换深浅主题' : 'Toggle theme'} onClick={toggleTheme}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} /></button><a className="icon-button github-link" href="https://github.com/sjjliqpl/webtools-hub" target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github" size={17} /></a></div>
    </header>
    <main className="app-main" inert={menuOpen}>
      <nav className="breadcrumb" aria-label={zh ? '面包屑' : 'Breadcrumb'}><Link to="/">{zh ? '首页' : 'Home'}</Link><Icon name="chevron" size={12} /><span>{isTool ? (categoryNames[active]?.[lang] || (zh ? '工具' : 'Tools')) : (zh ? '工作空间' : 'Workspace')}</span>{isTool && <><Icon name="chevron" size={12} /><span>{zh ? '工具详情' : 'Tool detail'}</span></>}</nav>
      <section className="content-panel" aria-labelledby="page-title"><div className="panel-heading"><div><h1 id="page-title">{title}</h1><p className="page-description">{description}</p></div><div className="panel-actions">{actions}{count !== undefined && <span className="page-badge">{count} {zh ? '个工具' : 'tools'}</span>}</div></div>
        <div className="page-content" id="page-content" tabIndex={-1}>{children}</div>
        <footer className="panel-footer"><span>WebTools Hub</span><span>{zh ? '无需安装，打开即用' : 'Ready when you are'}</span></footer>
      </section>
    </main>
  </div>
}
