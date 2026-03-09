
export interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export const categories: Category[] = [
  { id: 'text', name: '文本处理', icon: '📝', color: '#6366f1' },
  { id: 'math', name: '数学转换', icon: '🔢', color: '#f59e0b' },
  { id: 'ui', name: 'UI 设计', icon: '🎨', color: '#ec4899' },
  { id: 'time', name: '时间效率', icon: '⏰', color: '#10b981' },
  { id: 'games', name: '游戏安全', icon: '🎮', color: '#ef4444' },
]

export const tools: Tool[] = [
  // 文本处理
  { id: 'word-counter', name: '字数统计器', description: '实时统计字符数、单词数、行数', category: 'text', icon: '🔤' },
  { id: 'case-converter', name: '大小写转换', description: '全大写、全小写、首字母大写', category: 'text', icon: '🔡' },
  { id: 'json-formatter', name: 'JSON 格式化', description: 'JSON 格式化与校验工具', category: 'text', icon: '📋' },
  { id: 'base64', name: 'Base64 编解码', description: 'Base64 文本双向实时转换', category: 'text', icon: '🔐' },
  { id: 'url-codec', name: 'URL 编解码', description: 'URL 编码与解码转换', category: 'text', icon: '🔗' },
  { id: 'markdown-preview', name: 'Markdown 预览', description: '左侧输入右侧实时渲染', category: 'text', icon: '📖' },
  { id: 'text-dedup', name: '文本去重', description: '识别并删除重复行', category: 'text', icon: '🧹' },
  { id: 'text-sort', name: '文本排序', description: '字母、长度、数字排序', category: 'text', icon: '📊' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum', description: '占位符文本生成器', category: 'text', icon: '📄' },
  { id: 'code-highlight', name: '代码高亮预览', description: '多语言代码格式化展示', category: 'text', icon: '💻' },

  // 数学与转换
  { id: 'bmi-calculator', name: 'BMI 计算器', description: '身高体重健康状态评估', category: 'math', icon: '⚖️' },
  { id: 'tip-calculator', name: '小费计算器', description: '账单分摊与小费计算', category: 'math', icon: '💰' },
  { id: 'length-converter', name: '长度单位换算', description: '米、千米、英寸等互转', category: 'math', icon: '📏' },
  { id: 'weight-converter', name: '重量单位换算', description: '千克、磅、盎司互转', category: 'math', icon: '🏋️' },
  { id: 'percentage', name: '百分比计算器', description: '多功能百分比工具', category: 'math', icon: '📐' },
  { id: 'base-converter', name: '进制转换器', description: '2/8/10/16 进制互转', category: 'math', icon: '🔢' },
  { id: 'mortgage', name: '房贷计算器', description: '等额本息月供计算', category: 'math', icon: '🏠' },
  { id: 'temperature', name: '温度转换', description: '摄氏度与华氏度互转', category: 'math', icon: '🌡️' },
  { id: 'random-number', name: '随机数生成器', description: '自定义范围随机数', category: 'math', icon: '🎲' },
  { id: 'exchange-rate', name: '汇率模拟器', description: '常用汇率双向换算', category: 'math', icon: '💱' },

  // UI 与设计
  { id: 'dark-mode', name: '深色模式切换', description: '太阳/月亮图标切换', category: 'ui', icon: '🌓' },
  { id: 'color-converter', name: '颜色代码转换', description: 'HEX、RGB、HSL 互转', category: 'ui', icon: '🎨' },
  { id: 'palette-generator', name: '调色板生成器', description: '随机生成协调调色板', category: 'ui', icon: '🖌️' },
  { id: 'shadow-generator', name: 'CSS 阴影生成器', description: 'box-shadow 可视化调试', category: 'ui', icon: '🌑' },
  { id: 'border-radius', name: 'CSS 圆角生成器', description: 'border-radius 可视化', category: 'ui', icon: '⬜' },
  { id: 'image-to-base64', name: '图片转 Base64', description: '图片预览并转 Base64', category: 'ui', icon: '🖼️' },
  { id: 'drawing-board', name: '简易画板', description: 'Canvas 画笔工具', category: 'ui', icon: '✏️' },
  { id: 'modal-preview', name: '模态框预览', description: '3 种模态框样式展示', category: 'ui', icon: '🪟' },
  { id: 'accordion', name: '折叠面板', description: 'FAQ 风格折叠面板', category: 'ui', icon: '📂' },
  { id: 'scroll-progress', name: '滚动进度条', description: '页面滚动进度指示', category: 'ui', icon: '📊' },
  { id: 'gradient-generator', name: 'CSS 渐变生成器', description: '可视化线性/径向渐变编辑', category: 'ui', icon: '🌈' },
  { id: 'flexbox-playground', name: 'Flexbox 工具箱', description: '交互式 Flexbox 属性调试', category: 'ui', icon: '📦' },
  { id: 'grid-generator', name: 'CSS 网格生成器', description: '可视化 Grid 布局构建器', category: 'ui', icon: '⊞' },
  { id: 'bezier-curve', name: '贝塞尔曲线', description: 'CSS cubic-bezier 缓动编辑器', category: 'ui', icon: '〰️' },
  { id: 'css-unit-converter', name: 'CSS 单位换算', description: 'px、rem、em、vw、vh 互转', category: 'ui', icon: '📐' },

  // 时间与效率
  { id: 'digital-clock', name: '数字时钟', description: '12/24 小时制数字时钟', category: 'time', icon: '🕐' },
  { id: 'countdown', name: '倒计时定时器', description: '可自定义倒计时', category: 'time', icon: '⏳' },
  { id: 'pomodoro', name: '番茄钟', description: '25 分钟工作法', category: 'time', icon: '🍅' },
  { id: 'stopwatch', name: '秒表', description: '计次功能秒表', category: 'time', icon: '⏱️' },
  { id: 'todo-list', name: '待办列表', description: '本地存储待办事项', category: 'time', icon: '✅' },
  { id: 'notes', name: '简易笔记', description: '自动保存 Markdown 笔记', category: 'time', icon: '📝' },
  { id: 'date-diff', name: '日期差计算器', description: '计算两日期间隔', category: 'time', icon: '📅' },
  { id: 'life-progress', name: '生命进度条', description: '人生百分比可视化', category: 'time', icon: '💚' },
  { id: 'virtual-keyboard', name: '虚拟键盘', description: '标准键盘布局输入', category: 'time', icon: '⌨️' },
  { id: 'white-noise', name: '白噪音播放器', description: '5 种环境声音播放', category: 'time', icon: '🎵' },

  // 游戏与安全
  { id: 'password-generator', name: '随机密码生成', description: '自定义密码生成器', category: 'games', icon: '🔑' },
  { id: 'typing-test', name: '打字测试', description: 'WPM 速度与准确率', category: 'games', icon: '⌨️' },
  { id: 'guess-number', name: '猜数字游戏', description: '猜 1-100 随机数', category: 'games', icon: '🔮' },
  { id: 'coin-dice', name: '抛硬币/掷骰子', description: '3D 动画效果', category: 'games', icon: '🎲' },
  { id: 'tic-tac-toe', name: '井字棋', description: '双人对战井字棋', category: 'games', icon: '⭕' },
  { id: 'memory-game', name: '记忆翻牌', description: '4x4 图标记忆匹配', category: 'games', icon: '🃏' },
  { id: 'calculator', name: '简易计算器', description: '标准计算器布局', category: 'games', icon: '🧮' },
  { id: 'qrcode', name: '二维码生成', description: '文本生成二维码', category: 'games', icon: '📱' },
  { id: 'reaction-test', name: '反应时测试', description: '反应速度测试', category: 'games', icon: '⚡' },
  { id: 'word-filter', name: '敏感词过滤', description: '敏感词替换工具', category: 'games', icon: '🛡️' },
]
