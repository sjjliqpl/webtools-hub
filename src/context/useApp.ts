import { createContext, useContext } from 'react'
import type { Lang } from '../i18n/translations'

export interface AppContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
  favorites: string[]
  toggleFavorite: (id: string) => void
  recent: string[]
  recordVisit: (id: string) => void
}

export const AppContext = createContext<AppContextValue>(null!)
export const useApp = () => useContext(AppContext)
