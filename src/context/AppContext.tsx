import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lang } from '../i18n/translations'
import { AppContext } from './useApp'
import { readStored, saveStored } from '../lib/storage'

function preference(key: string, allowed: string[], fallback: string) {
  try { const value = localStorage.getItem(key); return value && allowed.includes(value) ? value : fallback } catch { return fallback }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => preference('webtools-lang', ['zh', 'en'], 'zh') as Lang)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => preference('webtools-theme', ['light', 'dark'], 'light') as 'light' | 'dark')
  const [favorites, setFavorites] = useState<string[]>(() => readStored('webtools-favorites', []))
  const [recent, setRecent] = useState<string[]>(() => readStored('webtools-recent', []))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    try { localStorage.setItem('webtools-theme', theme) } catch { /* Session preference still applies. */ }
  }, [theme])
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    try { localStorage.setItem('webtools-lang', lang) } catch { /* Session preference still applies. */ }
  }, [lang])
  useEffect(() => saveStored('webtools-favorites', favorites), [favorites])
  useEffect(() => saveStored('webtools-recent', recent), [recent])
  const toggleFavorite = useCallback((id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]), [])
  const recordVisit = useCallback((id: string) => setRecent(prev => [id, ...prev.filter(item => item !== id)].slice(0, 12)), [])
  const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), [])

  return <AppContext.Provider value={{ lang, setLang, theme, toggleTheme, favorites, toggleFavorite, recent, recordVisit }}>{children}</AppContext.Provider>
}
