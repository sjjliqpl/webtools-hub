import type { CSSProperties } from 'react'
const paths: Record<string, string> = {
  github: 'M9 19c-4 1-4-2-5-2 M9 22v-4a3.5 3.5 0 0 1 1-2.7c-3.3-.4-6.8-1.6-6.8-7.3A5.7 5.7 0 0 1 4.7 4a5.2 5.2 0 0 1 .1-3s1.3-.4 4.2 1.5a14.4 14.4 0 0 1 6 0C17.9.6 19.2 1 19.2 1a5.2 5.2 0 0 1 .1 3 5.7 5.7 0 0 1 1.5 4c0 5.7-3.5 6.9-6.8 7.3a3.5 3.5 0 0 1 1 2.7v4',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  text: 'M4 5h16 M12 5v15 M8 20h8',
  math: 'M5 4h14v16H5z M8 8h8 M8 12h2 M14 12h2 M8 16h2 M14 16h2',
  ui: 'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h4a5 5 0 0 0 0-10z M7 9h.01 M10 6h.01 M15 6h.01 M6 13h.01',
  time: 'M12 8v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  games: 'M7 7h10a3 3 0 0 1 3 3l1 7a2 2 0 0 1-3 2l-3-3H9l-3 3a2 2 0 0 1-3-2l1-7a3 3 0 0 1 3-3z M6 11h4 M8 9v4 M16 10h.01 M18 12h.01',
  crypto: 'M5 10h14v11H5z M8 10V7a4 4 0 0 1 8 0v3 M12 14v3',
  iot: 'M8 8h8v8H8z M9 3v5 M15 3v5 M9 16v5 M15 16v5 M3 9h5 M3 15h5 M16 9h5 M16 15h5',
  test: 'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0 M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  web: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z',
  search: 'M16 16l5 5 M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0',
  menu: 'M3 4h18v16H3z M9 4v16 M13 9h4 M13 14h4',
  close: 'm6 6 12 12 M6 18 18 6',
  arrow: 'M4 12h16 m-6-6 6 6-6 6',
  chevron: 'm9 5 7 7-7 7',
  sun: 'M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1.5 1.5 M17.5 17.5 19 19 M5 19l1.5-1.5 M17.5 6.5 19 5 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon: 'M20 14A8.5 8.5 0 0 1 10 4a8.5 8.5 0 1 0 10 10',
  shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z m-4 9 3 3 5-6',
  copy: 'M9 9h12v12H9z M15 9V3H3v12h6',
  check: 'm5 12 4 4L19 6',
}
export default function Icon({ name, size = 20, style }: { name: string; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}><path d={paths[name] || paths.grid} /></svg>
}
