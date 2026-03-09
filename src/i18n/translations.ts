export type Lang = 'zh' | 'en'

export const translations = {
  zh: {
    // Header
    siteTitle: '⚡ WebTools',
    toolCount: '个在线工具',
    // Search
    searchPlaceholder: '搜索工具... 如 JSON、计算器、颜色',
    searchResultCount: (n: number) => `找到 ${n} 个工具`,
    clearFilter: '清除筛选',
    noTools: '没有找到匹配的工具',
    // Categories
    all: '全部',
    favorites: '⭐ 收藏夹',
    // Nav
    back: '← 返回',
    addFavorite: '添加收藏',
    removeFavorite: '取消收藏',
    // Misc
    notFound: '工具未找到',
    goHome: '返回首页',
    // Footer
    footerText: 'WebTools · 实用在线工具集',
    // Theme
    lightMode: '亮色',
    darkMode: '暗色',
    // Lang
    langZh: '中文',
    langEn: 'EN',
  },
  en: {
    siteTitle: '⚡ WebTools',
    toolCount: 'online tools',
    searchPlaceholder: 'Search tools... e.g. JSON, calculator, color',
    searchResultCount: (n: number) => `${n} tools found`,
    clearFilter: 'Clear filters',
    noTools: 'No matching tools found',
    all: 'All',
    favorites: '⭐ Favorites',
    back: '← Back',
    addFavorite: 'Add to favorites',
    removeFavorite: 'Remove from favorites',
    notFound: 'Tool not found',
    goHome: 'Back to Home',
    footerText: 'WebTools · A collection of handy online tools',
    lightMode: 'Light',
    darkMode: 'Dark',
    langZh: '中文',
    langEn: 'EN',
  },
}

export const categoryNames: Record<string, Record<Lang, string>> = {
  text: { zh: '文本处理', en: 'Text Tools' },
  math: { zh: '数学转换', en: 'Math & Converters' },
  ui: { zh: 'UI 设计', en: 'UI & Design' },
  time: { zh: '时间效率', en: 'Time & Productivity' },
  games: { zh: '游戏安全', en: 'Games & Security' },
}

export const toolTranslations: Record<string, { name: string; description: string }> = {
  // Text Tools
  'word-counter': { name: 'Word Counter', description: 'Count characters, words, and lines in real-time' },
  'case-converter': { name: 'Case Converter', description: 'UPPERCASE, lowercase, Title Case, Sentence case' },
  'json-formatter': { name: 'JSON Formatter', description: 'Format & validate JSON with syntax check' },
  'base64': { name: 'Base64 Codec', description: 'Bidirectional Base64 encode/decode with UTF-8' },
  'url-codec': { name: 'URL Encoder', description: 'URL encode/decode with encodeURIComponent' },
  'markdown-preview': { name: 'Markdown Preview', description: 'Live markdown editor with rendered preview' },
  'text-dedup': { name: 'Text Deduplicator', description: 'Remove duplicate lines from text' },
  'text-sort': { name: 'Text Sorter', description: 'Sort lines alphabetically, by length, or numerically' },
  'lorem-ipsum': { name: 'Lorem Ipsum', description: 'Generate placeholder text' },
  'code-highlight': { name: 'Code Highlighter', description: 'Syntax highlighting for multiple languages' },

  // Math & Converters
  'bmi-calculator': { name: 'BMI Calculator', description: 'Calculate BMI with health status indicator' },
  'tip-calculator': { name: 'Tip Calculator', description: 'Split bills and calculate tips' },
  'length-converter': { name: 'Length Converter', description: 'Convert m, km, cm, mm, inches, feet' },
  'weight-converter': { name: 'Weight Converter', description: 'Convert kg, g, lbs, oz' },
  'percentage': { name: 'Percentage Calculator', description: 'Multi-mode percentage calculations' },
  'base-converter': { name: 'Base Converter', description: 'Convert between binary, octal, decimal, hex' },
  'mortgage': { name: 'Mortgage Calculator', description: 'Monthly payment with equal principal + interest' },
  'temperature': { name: 'Temperature Converter', description: 'Celsius ↔ Fahrenheit bidirectional conversion' },
  'random-number': { name: 'Random Number', description: 'Generate random numbers in custom range' },
  'exchange-rate': { name: 'Exchange Rate', description: 'Simulated bidirectional currency conversion' },

  // UI & Design
  'dark-mode': { name: 'Dark Mode Toggle', description: 'Sun/moon theme toggle demo' },
  'color-converter': { name: 'Color Converter', description: 'HEX, RGB, HSL bidirectional conversion' },
  'palette-generator': { name: 'Palette Generator', description: 'Generate harmonious random color palettes' },
  'shadow-generator': { name: 'Shadow Generator', description: 'Visual box-shadow CSS generator' },
  'border-radius': { name: 'Border Radius', description: 'Visual border-radius CSS generator' },
  'image-to-base64': { name: 'Image to Base64', description: 'Convert image files to Base64 strings' },
  'drawing-board': { name: 'Drawing Board', description: 'Canvas brush drawing tool' },
  'modal-preview': { name: 'Modal Preview', description: '3 modal dialog style demos' },
  'accordion': { name: 'Accordion', description: 'FAQ-style animated accordion component' },
  'scroll-progress': { name: 'Scroll Progress', description: 'Page scroll progress indicator' },
  'gradient-generator': { name: 'Gradient Generator', description: 'Visual CSS gradient builder' },
  'flexbox-playground': { name: 'Flexbox Playground', description: 'Interactive flexbox property tester' },
  'grid-generator': { name: 'Grid Generator', description: 'Visual CSS grid layout builder' },
  'bezier-curve': { name: 'Bezier Curve', description: 'CSS cubic-bezier easing editor' },
  'css-unit-converter': { name: 'CSS Units', description: 'Convert px, rem, em, vw, vh' },

  // Time & Productivity
  'digital-clock': { name: 'Digital Clock', description: '12/24-hour format digital clock' },
  'countdown': { name: 'Countdown Timer', description: 'Customizable countdown with alert' },
  'pomodoro': { name: 'Pomodoro Timer', description: '25-min work / 5-min break cycles' },
  'stopwatch': { name: 'Stopwatch', description: 'Stopwatch with lap recording' },
  'todo-list': { name: 'Todo List', description: 'Persistent to-do list with localStorage' },
  'notes': { name: 'Quick Notes', description: 'Auto-saving Markdown notes' },
  'date-diff': { name: 'Date Difference', description: 'Calculate days/weeks/months between dates' },
  'life-progress': { name: 'Life Progress', description: 'Visualize percentage of life lived' },
  'virtual-keyboard': { name: 'Virtual Keyboard', description: 'On-screen QWERTY keyboard input' },
  'white-noise': { name: 'White Noise Player', description: '5 ambient sound generators' },

  // Games & Security
  'password-generator': { name: 'Password Generator', description: 'Custom password generator with strength meter' },
  'typing-test': { name: 'Typing Test', description: 'WPM speed and accuracy test' },
  'guess-number': { name: 'Guess the Number', description: 'Guess a random number 1–100' },
  'coin-dice': { name: 'Coin / Dice', description: '3D animated coin flip & dice roll' },
  'tic-tac-toe': { name: 'Tic Tac Toe', description: '2-player Tic Tac Toe game' },
  'memory-game': { name: 'Memory Game', description: '4×4 emoji memory matching game' },
  'calculator': { name: 'Calculator', description: 'Standard calculator with full operations' },
  'qrcode': { name: 'QR Code Generator', description: 'Generate QR codes from text/URL' },
  'reaction-test': { name: 'Reaction Test', description: 'Measure your reaction time in milliseconds' },
  'word-filter': { name: 'Word Filter', description: 'Replace sensitive words with asterisks' },
}
