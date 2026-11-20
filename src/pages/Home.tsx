import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { tools, categories } from '../data/tools'
import { categoryNames, toolTranslations } from '../i18n/translations'
import { useApp } from '../context/useApp'
import AppShell from '../components/AppShell'
import Icon from '../components/Icon'

export default function Home() {
  const [params, setParams] = useSearchParams()
  const { lang, favorites, toggleFavorite, recent } = useApp()
  useEffect(() => { document.title = 'WebTools Hub · 在线工具与训练工作台' }, [])
  const zh = lang === 'zh'
  const category = params.get('category') || 'all'
  const query = (params.get('q') || '').trim().toLocaleLowerCase()
  const title = category === 'favorites' ? (zh ? '我的收藏' : 'Favorites') : category === 'recent' ? (zh ? '最近使用' : 'Recently used') : categoryNames[category]?.[lang] || (zh ? '全部工具' : 'All tools')
  const ids = category === 'recent' ? recent : null
  const filtered = (ids ? ids.map(id => tools.find(tool => tool.id === id)).filter((tool): tool is typeof tools[number] => !!tool) : tools).filter(tool => {
    const inCategory = category === 'all' || category === 'recent' || tool.category === category || (category === 'favorites' && favorites.includes(tool.id))
    const text = `${tool.id} ${tool.name} ${tool.description} ${toolTranslations[tool.id]?.name || ''} ${toolTranslations[tool.id]?.description || ''}`.toLocaleLowerCase()
    return inCategory && query.split(/\s+/).every(part => text.includes(part))
  })
  const groups = category === 'recent' ? [{ id:'recent', name:title, icon:'', color:'#2563eb', items:filtered }] : categories.map(cat => ({ ...cat, items: filtered.filter(tool => tool.category === cat.id) })).filter(cat => cat.items.length)
  return <AppShell key={category} title={title} description={zh ? '让琐碎更简单，让练习更专注。' : 'Everyday tasks, a little simpler.'} count={filtered.length}>
    {filtered.length ? <div className="tool-directory">{groups.map(cat => <section className="directory-section" key={cat.id}>{groups.length > 1 && <div className="section-heading"><span className="section-icon" style={{ color: cat.color }}><Icon name={cat.id} size={18} /></span><h2>{categoryNames[cat.id]?.[lang] || cat.name}</h2><span className="section-count">{cat.items.length}</span></div>}<div className="tool-grid">{cat.items.map(tool => {
      const name = zh ? tool.name : toolTranslations[tool.id]?.name || tool.name
      const description = zh ? tool.description : toolTranslations[tool.id]?.description || tool.description
      return <article className="tool-card" key={tool.id}><Link to={`/tool/${tool.id}`} className="tool-card-link"><span className="tool-glyph">{tool.icon}</span><div className="tool-card-copy"><h3>{name}</h3><p>{description}</p></div><span className="tool-card-arrow"><Icon name="arrow" size={16} /></span></Link><button className={`favorite-button ${favorites.includes(tool.id) ? 'is-favorite' : ''}`} aria-label={`${favorites.includes(tool.id) ? (zh ? '取消收藏' : 'Unfavorite') : (zh ? '收藏' : 'Favorite')} ${name}`} aria-pressed={favorites.includes(tool.id)} onClick={() => toggleFavorite(tool.id)}><Icon name="star" size={15} /></button></article>
    })}</div></section>)}</div> : <div className="empty-state"><Icon name={category === 'favorites' ? 'star' : 'search'} size={36} /><h2>{zh ? (category === 'favorites' ? '还没有收藏的工具' : category === 'recent' ? '还没有使用记录' : '没有找到匹配的工具') : 'No tools here yet'}</h2><p>{zh ? '试试其他关键词，或从全部工具中选择。' : 'Try another search or browse all tools.'}</p><button className="primary-button" onClick={() => setParams({})}>{zh ? '浏览全部工具' : 'Browse all tools'}</button></div>}
  </AppShell>
}
