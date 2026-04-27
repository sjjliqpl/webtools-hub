import { useParams, useNavigate } from 'react-router-dom'
import { Suspense, lazy, useState, useEffect } from 'react'
import { tools, categories } from '../data/tools'
import { useApp } from '../context/AppContext'
import { translations, categoryNames, toolTranslations } from '../i18n/translations'

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'word-counter': lazy(() => import('../tools/text/WordCounter')),
  'case-converter': lazy(() => import('../tools/text/CaseConverter')),
  'json-formatter': lazy(() => import('../tools/text/JsonFormatter')),
  'base64': lazy(() => import('../tools/text/Base64Codec')),
  'url-codec': lazy(() => import('../tools/text/UrlCodec')),
  'markdown-preview': lazy(() => import('../tools/text/MarkdownPreview')),
  'text-dedup': lazy(() => import('../tools/text/TextDedup')),
  'text-sort': lazy(() => import('../tools/text/TextSort')),
  'lorem-ipsum': lazy(() => import('../tools/text/LoremIpsum')),
  'code-highlight': lazy(() => import('../tools/text/CodeHighlight')),
  'bmi-calculator': lazy(() => import('../tools/math/BmiCalculator')),
  'tip-calculator': lazy(() => import('../tools/math/TipCalculator')),
  'length-converter': lazy(() => import('../tools/math/LengthConverter')),
  'weight-converter': lazy(() => import('../tools/math/WeightConverter')),
  'percentage': lazy(() => import('../tools/math/Percentage')),
  'base-converter': lazy(() => import('../tools/math/BaseConverter')),
  'mortgage': lazy(() => import('../tools/math/Mortgage')),
  'temperature': lazy(() => import('../tools/math/Temperature')),
  'random-number': lazy(() => import('../tools/math/RandomNumber')),
  'exchange-rate': lazy(() => import('../tools/math/ExchangeRate')),
  'dark-mode': lazy(() => import('../tools/ui/DarkMode')),
  'color-converter': lazy(() => import('../tools/ui/ColorConverter')),
  'palette-generator': lazy(() => import('../tools/ui/PaletteGenerator')),
  'shadow-generator': lazy(() => import('../tools/ui/ShadowGenerator')),
  'border-radius': lazy(() => import('../tools/ui/BorderRadius')),
  'image-to-base64': lazy(() => import('../tools/ui/ImageToBase64')),
  'drawing-board': lazy(() => import('../tools/ui/DrawingBoard')),
  'modal-preview': lazy(() => import('../tools/ui/ModalPreview')),
  'accordion': lazy(() => import('../tools/ui/Accordion')),
  'scroll-progress': lazy(() => import('../tools/ui/ScrollProgress')),
  'gradient-generator': lazy(() => import('../tools/ui/GradientGenerator')),
  'flexbox-playground': lazy(() => import('../tools/ui/FlexboxPlayground')),
  'grid-generator': lazy(() => import('../tools/ui/GridGenerator')),
  'bezier-curve': lazy(() => import('../tools/ui/BezierCurve')),
  'css-unit-converter': lazy(() => import('../tools/ui/CssUnitConverter')),
  'digital-clock': lazy(() => import('../tools/time/DigitalClock')),
  'countdown': lazy(() => import('../tools/time/Countdown')),
  'pomodoro': lazy(() => import('../tools/time/Pomodoro')),
  'stopwatch': lazy(() => import('../tools/time/Stopwatch')),
  'todo-list': lazy(() => import('../tools/time/TodoList')),
  'notes': lazy(() => import('../tools/time/Notes')),
  'date-diff': lazy(() => import('../tools/time/DateDiff')),
  'life-progress': lazy(() => import('../tools/time/LifeProgress')),
  'virtual-keyboard': lazy(() => import('../tools/time/VirtualKeyboard')),
  'white-noise': lazy(() => import('../tools/time/WhiteNoise')),
  'password-generator': lazy(() => import('../tools/games/PasswordGenerator')),
  'typing-test': lazy(() => import('../tools/games/TypingTest')),
  'guess-number': lazy(() => import('../tools/games/GuessNumber')),
  'coin-dice': lazy(() => import('../tools/games/CoinDice')),
  'tic-tac-toe': lazy(() => import('../tools/games/TicTacToe')),
  'memory-game': lazy(() => import('../tools/games/MemoryGame')),
  'calculator': lazy(() => import('../tools/games/Calculator')),
  'qrcode': lazy(() => import('../tools/games/QRCode')),
  'reaction-test': lazy(() => import('../tools/games/ReactionTest')),
  'word-filter': lazy(() => import('../tools/games/WordFilter')),
  'password-strength': lazy(() => import('../tools/crypto/PasswordStrength')),
  'hash-generator': lazy(() => import('../tools/crypto/HashGenerator')),
  'caesar-cipher': lazy(() => import('../tools/crypto/CaesarCipher')),
  'rot13': lazy(() => import('../tools/crypto/Rot13')),
  'jwt-decoder': lazy(() => import('../tools/crypto/JwtDecoder')),
  'uuid-generator': lazy(() => import('../tools/crypto/UuidGenerator')),
  'morse-code': lazy(() => import('../tools/crypto/MorseCode')),
  'text-binary': lazy(() => import('../tools/crypto/TextBinary')),
  'random-token': lazy(() => import('../tools/crypto/RandomToken')),
  'xor-cipher': lazy(() => import('../tools/crypto/XorCipher')),
  'mqtt-topic': lazy(() => import('../tools/iot/MqttTopic')),
  'crc-calculator': lazy(() => import('../tools/iot/CrcCalculator')),
  'hex-converter': lazy(() => import('../tools/iot/HexConverter')),
  'subnet-calculator': lazy(() => import('../tools/iot/SubnetCalculator')),
  'unix-timestamp': lazy(() => import('../tools/iot/UnixTimestamp')),
  'bitwise-calc': lazy(() => import('../tools/iot/BitwiseCalc')),
  'iot-power': lazy(() => import('../tools/iot/IotPower')),
  'baud-rate': lazy(() => import('../tools/iot/BaudRate')),
  'visual-memory': lazy(() => import('../tools/test/VisualMemory')),
  'number-memory': lazy(() => import('../tools/test/NumberMemory')),
  'click-precision': lazy(() => import('../tools/test/ClickPrecision')),
  'color-blind-test': lazy(() => import('../tools/test/ColorBlindTest')),
  'aim-trainer': lazy(() => import('../tools/test/AimTrainer')),
}

export default function ToolPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const tool = tools.find(t => t.id === id)
  const cat = categories.find(c => c.id === tool?.category)
  const Component = id ? toolComponents[id] : null
  const { lang, setLang, theme, toggleTheme } = useApp()
  const t = translations[lang]
  const isDark = theme === 'dark'

  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('webtools-favorites') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('webtools-favorites', JSON.stringify(favorites))
  }, [favorites])

  const toolName = tool ? (lang === 'en' ? (toolTranslations[tool.id]?.name || tool.name) : tool.name) : ''
  const catName = cat ? (categoryNames[cat.id]?.[lang] || cat.name) : ''

  if (!tool || !Component) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <p className="text-5xl mb-4">🤷</p>
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.notFound}</p>
          <button onClick={() => navigate('/')} className="text-indigo-500 hover:underline">{t.goHome}</button>
        </div>
      </div>
    )
  }

  const isFav = favorites.includes(tool.id)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50'}`}>
      {/* Tool Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/70 border-slate-200/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className={`transition-colors text-sm flex items-center gap-1 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t.back}
            </button>
            <div className={`w-px h-5 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <span className="text-xl">{tool.icon}</span>
            <div>
              <h1 className={`font-semibold text-sm font-[var(--font-display)] ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{toolName}</h1>
              <p className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat?.color }} />
                {catName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              {lang === 'zh' ? t.langEn : t.langZh}
            </button>
            <button
              onClick={toggleTheme}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setFavorites(prev => prev.includes(tool.id) ? prev.filter(f => f !== tool.id) : [...prev, tool.id])}
              className="text-lg hover:scale-110 transition-transform"
              title={isFav ? t.removeFavorite : t.addFavorite}
            >
              {isFav ? '⭐' : '☆'}
            </button>
          </div>
        </div>
      </header>

      {/* Tool Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin text-3xl">⚡</div>
          </div>
        }>
          <Component />
        </Suspense>
      </main>
    </div>
  )
}
