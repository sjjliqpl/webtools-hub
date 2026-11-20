export function readStored<T>(key: string, fallback: T): T {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || 'null')
    if (Array.isArray(fallback)) return (Array.isArray(value) ? value.filter(item => typeof item === 'string') : fallback) as T
    return value === null ? fallback : value as T
  } catch { return fallback }
}

export function saveStored(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* Keep the current session usable when browser storage is full. */ }
}
