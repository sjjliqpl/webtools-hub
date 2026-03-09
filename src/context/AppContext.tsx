import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Lang } from '../i18n/translations'

type Theme = 'light' | 'dark'

interface AppContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  theme: Theme
  toggleTheme: () => void
}

const AppContext = createContext<AppContextValue>({
  lang: 'zh',
  setLang: () => {},
  theme: 'light',
  toggleTheme: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    (localStorage.getItem('webtools-lang') as Lang) || 'zh'
  )
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('webtools-theme') as Theme) || 'light'
  )

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('webtools-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('webtools-lang', lang)
  }, [lang])

  const setLang = (l: Lang) => setLangState(l)
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <AppContext.Provider value={{ lang, setLang, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
