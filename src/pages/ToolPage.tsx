import { useParams, Link } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { tools } from '../data/tools'
import { useApp } from '../context/useApp'
import { toolTranslations } from '../i18n/translations'
import AppShell from '../components/AppShell'
import ToolBoundary from '../components/ToolBoundary'
import Icon from '../components/Icon'

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'click-speed': lazy(() => import('../tools/test/ClickSpeed')),
  'mouse-tracking': lazy(() => import('../tools/test/MouseTracking')),
  'keyboard-reaction': lazy(() => import('../tools/test/KeyboardReaction')),
  'keyboard-tester': lazy(() => import('../tools/test/KeyboardTester')),
  'sequence-memory': lazy(() => import('../tools/test/SequenceMemory')),
  'stroop-test': lazy(() => import('../tools/test/StroopTest')),
  'regex-tester': lazy(() => import('../tools/web/RegexTester')),
  'url-parser': lazy(() => import('../tools/web/UrlParser')),
  'text-diff': lazy(() => import('../tools/web/TextDiff')),
  'image-compressor': lazy(() => import('../tools/web/ImageCompressor')),
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
  const tool = tools.find(item => item.id === id)
  const Component = id ? toolComponents[id] : null
  const { lang, favorites, toggleFavorite, recordVisit } = useApp()
  const zh = lang === 'zh'
  useEffect(() => { if (tool) recordVisit(tool.id) }, [tool, recordVisit])
  const name = tool ? (zh ? tool.name : toolTranslations[tool.id]?.name || tool.name) : (zh ? '工具未找到' : 'Tool not found')
  useEffect(() => { document.title = `${name} · WebTools Hub` }, [name])
  return <AppShell title={name} description={tool ? (zh ? tool.description : toolTranslations[tool.id]?.description || tool.description) : ''} category={tool?.category} actions={tool && <><Link className="secondary-button" to={`/?category=${tool.category}`}>{zh ? '返回分类' : 'Back'}</Link><button className={`secondary-button ${favorites.includes(tool.id) ? 'is-favorite' : ''}`} aria-pressed={favorites.includes(tool.id)} onClick={() => toggleFavorite(tool.id)}><Icon name="star" size={15} />{favorites.includes(tool.id) ? (zh ? '已收藏' : 'Saved') : (zh ? '收藏' : 'Save')}</button></>}>
    {tool && Component ? <ToolBoundary key={id}><Suspense fallback={<div className="loading-state" role="status">{zh ? '工具加载中…' : 'Loading…'}</div>}><div className="tool-body"><Component key={id} /></div></Suspense></ToolBoundary> : <div className="empty-state"><p>{zh ? '这个地址没有对应的工具。' : 'This tool does not exist.'}</p><Link to="/" className="primary-button">{zh ? '返回首页' : 'Home'}</Link></div>}
  </AppShell>
}
