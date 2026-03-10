import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { tools, categories } from '../data/tools'
import { useApp } from '../context/AppContext'
import { translations, categoryNames, toolTranslations } from '../i18n/translations'

export default function Home() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('webtools-favorites') || '[]') } catch { return [] }
  })
  const navigate = useNavigate()
  const location = useLocation()
  const { lang, setLang, theme, toggleTheme } = useApp()
  const t = translations[lang]

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const cat = params.get('category')
    if (cat) setActiveCategory(cat)
  }, [location.search])

  useEffect(() => {
    localStorage.setItem('webtools-favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const getToolName = (id: string, zhName: string) =>
    lang === 'en' ? (toolTranslations[id]?.name || zhName) : zhName
  const getToolDesc = (id: string, zhDesc: string) =>
    lang === 'en' ? (toolTranslations[id]?.description || zhDesc) : zhDesc
  const getCategoryName = (id: string, zhName: string) =>
    lang === 'en' ? (categoryNames[id]?.[lang] || zhName) : zhName

  const filteredFlat = tools.filter(t => {
    const name = getToolName(t.id, t.name)
    const desc = getToolDesc(t.id, t.description)
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !activeCategory || (activeCategory === 'favorites' ? favorites.includes(t.id) : t.category === activeCategory)
    return matchSearch && matchCategory
  })

  // Group by category when showing all (no search, no category filter)
  const showGrouped = !search && !activeCategory

  // Scroll to hash on initial load when in grouped view
  const didScrollToHash = useRef(false)
  useEffect(() => {
    if (!showGrouped || didScrollToHash.current) return
    const hash = window.location.hash
    if (hash) {
      didScrollToHash.current = true
      const el = document.getElementById(hash.slice(1))
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      }
    }
  }, [showGrouped])

  // Track scroll position and update URL hash with current category
  useEffect(() => {
    if (!showGrouped) {
      // Clear hash when not in grouped view
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
      return
    }

    // Offset from top of viewport at which a section is considered "active"
    const CATEGORY_VISIBILITY_OFFSET = 120
    let lastUpdate = 0

    const handleScroll = () => {
      const now = Date.now()
      if (now - lastUpdate < 100) return
      lastUpdate = now

      const sectionIds = categories.map(c => `category-${c.id}`)
      let currentId = ''
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= CATEGORY_VISIBILITY_OFFSET) {
            currentId = id
          }
        }
      }
      const newHash = currentId ? `#${currentId}` : ''
      const currentHash = window.location.hash
      if (newHash !== currentHash) {
        history.replaceState(null, '', window.location.pathname + window.location.search + newHash)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showGrouped])

  const groupedByCategory = showGrouped
    ? categories.map(cat => ({
        cat,
        tools: tools.filter(t => t.category === cat.id),
      }))
    : []

  const isDark = theme === 'dark'

  const cardClass = `group relative rounded-2xl p-5 border cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
    isDark
      ? 'bg-slate-800 border-slate-700 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-900/40'
      : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50'
  }`

  const renderToolCard = (tool: typeof tools[0]) => {
    const cat = categories.find(c => c.id === tool.category)
    const isFav = favorites.includes(tool.id)
    return (
      <div
        key={tool.id}
        onClick={() => navigate(`/tool/${tool.id}`)}
        className={cardClass}
      >
        <button
          onClick={e => toggleFavorite(tool.id, e)}
          className={`absolute top-3 right-3 text-lg transition-all ${isFav ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100'}`}
          title={isFav ? t.removeFavorite : t.addFavorite}
        >
          {isFav ? '⭐' : '☆'}
        </button>
        <div className="text-3xl mb-3">{tool.icon}</div>
        <h3 className={`font-semibold mb-1 text-sm font-[var(--font-display)] ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          {getToolName(tool.id, tool.name)}
        </h3>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {getToolDesc(tool.id, tool.description)}
        </p>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color }} />
          <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {getCategoryName(cat?.id || '', cat?.name || '')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/70 border-slate-200/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-bold font-[var(--font-display)] bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent cursor-pointer"
              onClick={() => { setActiveCategory(null); setSearch('') }}
            >
              {t.siteTitle}
            </h1>
            <div className="flex items-center gap-2">
              <span className={`text-xs hidden sm:block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {tools.length} {t.toolCount}
              </span>
              {/* Lang toggle */}
              <button
                onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {lang === 'zh' ? t.langEn : t.langZh}
              </button>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={isDark ? t.lightMode : t.darkMode}
              >
                {isDark ? '☀️' : '🌙'}
                <span className="hidden sm:inline">{isDark ? t.lightMode : t.darkMode}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-400 text-lg">🔍</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border shadow-lg text-base transition-all font-[var(--font-body)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 shadow-slate-900/50'
                : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 shadow-indigo-100/50 focus:border-indigo-300'
            }`}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
            >✕</button>
          )}
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !activeCategory
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.all}
          </button>
          <button
            onClick={() => setActiveCategory('favorites')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'favorites'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.favorites} {favorites.length > 0 && `(${favorites.length})`}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'text-white shadow-md'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
              style={activeCategory === cat.id ? { backgroundColor: cat.color, boxShadow: `0 4px 14px ${cat.color}40` } : {}}
            >
              {cat.icon} {getCategoryName(cat.id, cat.name)}
            </button>
          ))}
        </div>

        {/* Search result count */}
        {search && (
          <p className={`text-center text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.searchResultCount(filteredFlat.length)}
          </p>
        )}

        {/* GROUPED view (no search, no filter) */}
        {showGrouped && (
          <div className="space-y-12">
            {groupedByCategory.map(({ cat, tools: catTools }) => (
              <section key={cat.id} id={`category-${cat.id}`}>
                {/* Category Section Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm"
                    style={{ backgroundColor: cat.color + '20', color: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold font-[var(--font-display)] ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                      {getCategoryName(cat.id, cat.name)}
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {catTools.length} {lang === 'zh' ? '个工具' : 'tools'}
                    </p>
                  </div>
                  <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(to right, ${cat.color}40, transparent)` }} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {catTools.map(renderToolCard)}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* FLAT view (search or category active) */}
        {!showGrouped && (
          <>
            {/* Category title when single category selected */}
            {activeCategory && activeCategory !== 'favorites' && (() => {
              const cat = categories.find(c => c.id === activeCategory)
              if (!cat) return null
              return (
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: cat.color + '20', color: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <h2 className={`text-lg font-bold font-[var(--font-display)] ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                    {getCategoryName(cat.id, cat.name)}
                  </h2>
                  <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(to right, ${cat.color}40, transparent)` }} />
                </div>
              )
            })()}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFlat.map(renderToolCard)}
            </div>
          </>
        )}

        {/* Empty state */}
        {filteredFlat.length === 0 && !showGrouped && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>{t.noTools}</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory(null) }}
              className="mt-4 text-indigo-500 text-sm hover:underline"
            >
              {t.clearFilter}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 mt-12 ${isDark ? 'border-slate-800' : 'border-slate-200/50'}`}>
        <p className={`text-center text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{t.footerText}</p>
      </footer>
    </div>
  )
}

