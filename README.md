# WebTools Hub

浏览器里的工具与训练工作台，提供 **88 个工具、9 个分类**。文本、图片、计算和训练均在本地完成，无需注册。

[在线使用](https://sjjliqpl.github.io/webtools-hub/) · [功能审查记录](docs/tool-audit.md)

## 本次更新

- 数字记忆支持 **50、100、200、300、500 毫秒和 1、2、3 秒**，可选 3–10 位数字，支持 Enter 提交与继续，切换设置重新统计。
- 按 layout.html 参考统一侧栏、顶栏、白色面板与蓝色交互；支持手机导航、深浅主题、搜索快捷键、收藏与最近使用。
- 新增点击速度、鼠标追踪、键盘反应、键盘检测、顺序记忆和颜色干扰 6 项训练。
- 新增正则表达式测试、URL 解析、文本对比和图片压缩 4 个常用工具。
- 改善进制精度、UTF-8 编解码、零利率房贷、定时器、密码生成、Markdown 预览隔离、文件处理、复制失败提示和移动端布局。
- 工具按路由懒加载，保留原有工具地址。

## 快速开始

需要 Node.js 20.19+ 或 22.12+ 和 npm。

```bash
npm ci
npm run dev
```

打开终端显示的 `/webtools-hub/` 地址。

```bash
npm run lint    # ESLint
npm test        # 算法、边界与目录一致性测试
npm run build   # TypeScript 检查与生产构建
npm run preview # 预览 dist
```

## 使用说明

- 顶栏支持中文、英文名称和工具 ID 搜索，多个关键词同时匹配；`Cmd/Ctrl + K` 聚焦搜索。
- 星标收藏与最近使用、主题、语言、笔记及待办保存在当前浏览器。清除网站数据会删除这些记录，笔记可下载备份。
- 数字记忆的短时曝光受显示器刷新率和浏览器调度影响，不能作为专业计时设备。键盘反应与按键检测需要实体键盘，系统保留快捷键可能无法检测。
- 正则匹配在 Worker 中运行，超过 1 秒终止；最多展示 1000 个匹配。文本对比每侧最多 1000 行、100000 字符。
- 图片压缩支持 JPG/PNG/WebP，最大 20 MB、4000 万像素，输出 WebP/JPEG；图片转 Base64 最大 10 MB。压缩不保证文件一定变小。
- Markdown 预览使用无脚本沙盒并阻止外部资源加载。文件和工具输入不会上传到服务器。
- 汇率使用离线演示数据。BMI、颜色辨识和其他练习结果仅供参考；JWT 解码不验证签名。凯撒、ROT13、XOR 是编码/教学演示，不适合保护敏感数据。
- 界面提供中英文导航与工具名称，部分工具内部操作文案以中文为主。

## 工具目录

### 文本处理（11）

| 工具 | 功能 |
|---|---|
| [字数统计器](https://sjjliqpl.github.io/webtools-hub/tool/word-counter) | 实时统计字符数、单词数、行数 |
| [大小写转换](https://sjjliqpl.github.io/webtools-hub/tool/case-converter) | 全大写、全小写、首字母大写 |
| [JSON 格式化](https://sjjliqpl.github.io/webtools-hub/tool/json-formatter) | JSON 格式化与校验工具 |
| [Base64 编解码](https://sjjliqpl.github.io/webtools-hub/tool/base64) | Base64 文本双向实时转换 |
| [URL 编解码](https://sjjliqpl.github.io/webtools-hub/tool/url-codec) | URL 编码与解码转换 |
| [Markdown 预览](https://sjjliqpl.github.io/webtools-hub/tool/markdown-preview) | 左侧输入右侧实时渲染 |
| [文本去重](https://sjjliqpl.github.io/webtools-hub/tool/text-dedup) | 识别并删除重复行 |
| [文本排序](https://sjjliqpl.github.io/webtools-hub/tool/text-sort) | 字母、长度、数字排序 |
| [Lorem Ipsum](https://sjjliqpl.github.io/webtools-hub/tool/lorem-ipsum) | 占位符文本生成器 |
| [代码高亮预览](https://sjjliqpl.github.io/webtools-hub/tool/code-highlight) | 多语言代码格式化展示 |
| [敏感词过滤](https://sjjliqpl.github.io/webtools-hub/tool/word-filter) | 敏感词替换工具 |

### 数学转换（10）

| 工具 | 功能 |
|---|---|
| [BMI 计算器](https://sjjliqpl.github.io/webtools-hub/tool/bmi-calculator) | 身高体重健康状态评估 |
| [小费计算器](https://sjjliqpl.github.io/webtools-hub/tool/tip-calculator) | 账单分摊与小费计算 |
| [长度单位换算](https://sjjliqpl.github.io/webtools-hub/tool/length-converter) | 米、千米、英寸等互转 |
| [重量单位换算](https://sjjliqpl.github.io/webtools-hub/tool/weight-converter) | 千克、磅、盎司互转 |
| [百分比计算器](https://sjjliqpl.github.io/webtools-hub/tool/percentage) | 多功能百分比工具 |
| [进制转换器](https://sjjliqpl.github.io/webtools-hub/tool/base-converter) | 2/8/10/16 进制互转 |
| [房贷计算器](https://sjjliqpl.github.io/webtools-hub/tool/mortgage) | 等额本息月供计算 |
| [温度转换](https://sjjliqpl.github.io/webtools-hub/tool/temperature) | 摄氏度与华氏度互转 |
| [随机数生成器](https://sjjliqpl.github.io/webtools-hub/tool/random-number) | 自定义范围随机数 |
| [汇率模拟器](https://sjjliqpl.github.io/webtools-hub/tool/exchange-rate) | 常用汇率双向换算 |

### UI 设计（15）

| 工具 | 功能 |
|---|---|
| [深色模式切换](https://sjjliqpl.github.io/webtools-hub/tool/dark-mode) | 太阳/月亮图标切换 |
| [颜色代码转换](https://sjjliqpl.github.io/webtools-hub/tool/color-converter) | HEX、RGB、HSL 互转 |
| [调色板生成器](https://sjjliqpl.github.io/webtools-hub/tool/palette-generator) | 随机生成协调调色板 |
| [CSS 阴影生成器](https://sjjliqpl.github.io/webtools-hub/tool/shadow-generator) | box-shadow 可视化调试 |
| [CSS 圆角生成器](https://sjjliqpl.github.io/webtools-hub/tool/border-radius) | border-radius 可视化 |
| [图片转 Base64](https://sjjliqpl.github.io/webtools-hub/tool/image-to-base64) | 图片预览并转 Base64 |
| [简易画板](https://sjjliqpl.github.io/webtools-hub/tool/drawing-board) | Canvas 画笔工具 |
| [模态框预览](https://sjjliqpl.github.io/webtools-hub/tool/modal-preview) | 3 种模态框样式展示 |
| [折叠面板](https://sjjliqpl.github.io/webtools-hub/tool/accordion) | FAQ 风格折叠面板 |
| [滚动进度条](https://sjjliqpl.github.io/webtools-hub/tool/scroll-progress) | 页面滚动进度指示 |
| [CSS 渐变生成器](https://sjjliqpl.github.io/webtools-hub/tool/gradient-generator) | 可视化线性/径向渐变编辑 |
| [Flexbox 工具箱](https://sjjliqpl.github.io/webtools-hub/tool/flexbox-playground) | 交互式 Flexbox 属性调试 |
| [CSS 网格生成器](https://sjjliqpl.github.io/webtools-hub/tool/grid-generator) | 可视化 Grid 布局构建器 |
| [贝塞尔曲线](https://sjjliqpl.github.io/webtools-hub/tool/bezier-curve) | CSS cubic-bezier 缓动编辑器 |
| [CSS 单位换算](https://sjjliqpl.github.io/webtools-hub/tool/css-unit-converter) | px、rem、em、vw、vh 互转 |

### 时间效率（10）

| 工具 | 功能 |
|---|---|
| [数字时钟](https://sjjliqpl.github.io/webtools-hub/tool/digital-clock) | 12/24 小时制数字时钟 |
| [倒计时定时器](https://sjjliqpl.github.io/webtools-hub/tool/countdown) | 可自定义倒计时 |
| [番茄钟](https://sjjliqpl.github.io/webtools-hub/tool/pomodoro) | 25 分钟工作法 |
| [秒表](https://sjjliqpl.github.io/webtools-hub/tool/stopwatch) | 计次功能秒表 |
| [待办列表](https://sjjliqpl.github.io/webtools-hub/tool/todo-list) | 本地存储待办事项 |
| [简易笔记](https://sjjliqpl.github.io/webtools-hub/tool/notes) | 自动保存 Markdown 笔记 |
| [日期差计算器](https://sjjliqpl.github.io/webtools-hub/tool/date-diff) | 计算两日期间隔 |
| [生命进度条](https://sjjliqpl.github.io/webtools-hub/tool/life-progress) | 人生百分比可视化 |
| [虚拟键盘](https://sjjliqpl.github.io/webtools-hub/tool/virtual-keyboard) | 标准键盘布局输入 |
| [白噪音播放器](https://sjjliqpl.github.io/webtools-hub/tool/white-noise) | 5 种环境声音播放 |

### 休闲游戏（5）

| 工具 | 功能 |
|---|---|
| [猜数字游戏](https://sjjliqpl.github.io/webtools-hub/tool/guess-number) | 猜 1-100 随机数 |
| [抛硬币/掷骰子](https://sjjliqpl.github.io/webtools-hub/tool/coin-dice) | 3D 动画效果 |
| [井字棋](https://sjjliqpl.github.io/webtools-hub/tool/tic-tac-toe) | 双人对战井字棋 |
| [记忆翻牌](https://sjjliqpl.github.io/webtools-hub/tool/memory-game) | 4x4 图标记忆匹配 |
| [简易计算器](https://sjjliqpl.github.io/webtools-hub/tool/calculator) | 标准计算器布局 |

### 密码安全（11）

| 工具 | 功能 |
|---|---|
| [密码强度检测](https://sjjliqpl.github.io/webtools-hub/tool/password-strength) | 分析密码强度与安全建议 |
| [哈希值计算](https://sjjliqpl.github.io/webtools-hub/tool/hash-generator) | SHA-1/256/384/512 哈希计算 |
| [凯撒密码](https://sjjliqpl.github.io/webtools-hub/tool/caesar-cipher) | 字母位移加密解密工具 |
| [ROT13 编解码](https://sjjliqpl.github.io/webtools-hub/tool/rot13) | ROT13 文本双向转换 |
| [JWT 令牌解析](https://sjjliqpl.github.io/webtools-hub/tool/jwt-decoder) | 解析 JWT 头部与载荷内容 |
| [UUID 生成器](https://sjjliqpl.github.io/webtools-hub/tool/uuid-generator) | 批量生成随机 UUID v4 |
| [摩尔斯电码](https://sjjliqpl.github.io/webtools-hub/tool/morse-code) | 文本与摩尔斯电码互转 |
| [文本转二进制](https://sjjliqpl.github.io/webtools-hub/tool/text-binary) | 文本与 8 位二进制编码互转 |
| [随机令牌生成](https://sjjliqpl.github.io/webtools-hub/tool/random-token) | 生成随机 API 密钥令牌 |
| [XOR 异或加密](https://sjjliqpl.github.io/webtools-hub/tool/xor-cipher) | 密钥 XOR 位运算加密演示 |
| [随机密码生成](https://sjjliqpl.github.io/webtools-hub/tool/password-generator) | 自定义密码生成器 |

### 物联网工具（8）

| 工具 | 功能 |
|---|---|
| [MQTT 主题验证器](https://sjjliqpl.github.io/webtools-hub/tool/mqtt-topic) | MQTT 主题格式验证与层级解析 |
| [CRC 校验计算器](https://sjjliqpl.github.io/webtools-hub/tool/crc-calculator) | CRC-8/16/CCITT/32 校验值计算 |
| [字节/进制转换器](https://sjjliqpl.github.io/webtools-hub/tool/hex-converter) | 十六进制、十进制、二进制、ASCII 互转 |
| [IP 子网计算器](https://sjjliqpl.github.io/webtools-hub/tool/subnet-calculator) | CIDR 子网掩码、主机数量计算 |
| [Unix 时间戳转换](https://sjjliqpl.github.io/webtools-hub/tool/unix-timestamp) | 时间戳与日期时间双向转换 |
| [位运算计算器](https://sjjliqpl.github.io/webtools-hub/tool/bitwise-calc) | AND/OR/XOR/NOT/移位运算 |
| [设备功耗计算器](https://sjjliqpl.github.io/webtools-hub/tool/iot-power) | 估算 IoT 设备电池续航时间 |
| [波特率计算器](https://sjjliqpl.github.io/webtools-hub/tool/baud-rate) | UART/RS-485 串口数据传输计算 |

### 常用工具（5）

| 工具 | 功能 |
|---|---|
| [正则表达式测试](https://sjjliqpl.github.io/webtools-hub/tool/regex-tester) | 实时匹配、分组查看与超时保护 |
| [URL 解析器](https://sjjliqpl.github.io/webtools-hub/tool/url-parser) | 拆解协议、路径、查询参数与片段 |
| [文本对比](https://sjjliqpl.github.io/webtools-hub/tool/text-diff) | 逐行比较文本，标记新增和删除 |
| [图片压缩](https://sjjliqpl.github.io/webtools-hub/tool/image-compressor) | 本地调整图片尺寸、质量并导出 WebP / JPG |
| [二维码生成](https://sjjliqpl.github.io/webtools-hub/tool/qrcode) | 文本生成二维码 |

### 训练与测试（13）

| 工具 | 功能 |
|---|---|
| [视觉记忆测试](https://sjjliqpl.github.io/webtools-hub/tool/visual-memory) | 记住高亮格子的位置，测试视觉记忆力 |
| [数字记忆测试](https://sjjliqpl.github.io/webtools-hub/tool/number-memory) | 50 毫秒至 3 秒闪现，训练数字瞬时记忆 |
| [鼠标精确点击](https://sjjliqpl.github.io/webtools-hub/tool/click-precision) | 点击越来越小的目标，测试鼠标精准度 |
| [颜色辨识练习](https://sjjliqpl.github.io/webtools-hub/tool/color-blind-test) | 辨别点阵中的数字，仅供练习，不代替色觉诊断 |
| [瞄准训练](https://sjjliqpl.github.io/webtools-hub/tool/aim-trainer) | 快速点击随机出现的目标，测试手眼协调 |
| [点击速度训练](https://sjjliqpl.github.io/webtools-hub/tool/click-speed) | 5 / 10 / 30 秒点击测试，统计每秒点击次数 |
| [鼠标追踪训练](https://sjjliqpl.github.io/webtools-hub/tool/mouse-tracking) | 跟随移动目标，练习鼠标控制与稳定性 |
| [键盘反应训练](https://sjjliqpl.github.io/webtools-hub/tool/keyboard-reaction) | WASD、方向键与字母键反应训练 |
| [键盘按键检测](https://sjjliqpl.github.io/webtools-hub/tool/keyboard-tester) | 查看按键状态、物理键码与多键响应 |
| [顺序记忆训练](https://sjjliqpl.github.io/webtools-hub/tool/sequence-memory) | 复现逐渐变长的闪烁序列 |
| [颜色干扰训练](https://sjjliqpl.github.io/webtools-hub/tool/stroop-test) | 忽略文字含义，选择实际墨水颜色 |
| [打字测试](https://sjjliqpl.github.io/webtools-hub/tool/typing-test) | WPM 速度与准确率 |
| [反应时测试](https://sjjliqpl.github.io/webtools-hub/tool/reaction-test) | 反应速度测试 |

## 架构

React 19 + TypeScript + Vite 7 + Tailwind CSS 4。React Router 管理页面，每个工具独立懒加载，无后端与数据库。

```text
src/components/   工作台、训练区域、复制按钮、预览沙盒
src/context/      主题、语言、收藏与最近使用
src/data/         工具与分类目录
src/lib/          纯函数、存储与自动化测试
src/tools/        各分类工具
public/404.html   GitHub Pages SPA 路由回退
```

## GitHub Pages 部署

仓库 Pages 的构建来源选择 **GitHub Actions**。推送到 `main` 或手动运行 `Deploy to GitHub Pages` 工作流，会依次安装依赖、执行 lint/测试/生产构建、上传 `dist` 并发布。

部署基础路径为 `/webtools-hub/`。`404.html` 与入口恢复脚本支持直接打开或刷新 `/tool/:id`，不使用 GitHub Pages 路由插件。迁移仓库名称时需同步修改 `vite.config.ts`、`index.html` 中的基础路径和本文链接。

浏览器回归覆盖桌面和手机尺寸的全部工具路由，并重点验证训练、文件处理、计时和存储交互。页面可打开不代表每种业务输入已穷尽测试；Firefox、Safari 与真实触屏设备仍需后续兼容验证。
