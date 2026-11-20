# WebTools Hub 事实源

## 本次目标
优先为数字记忆提供 50/100/200/300/500 毫秒和 1/2/3 秒；按用户提供的 layout.html 更新全部工具的布局与交互，审查 78 个已有工具，新增 6 个训练和 4 个常用工具，更新文档并部署 GitHub Pages。

## 产品与架构
- React 19 + TypeScript + Vite + Tailwind 4，纯浏览器工具，无登录、服务端或数据库。
- 用户文件和文本在本地处理。收藏、最近使用、偏好、笔记和待办保存在浏览器。
- 路由 `/`、`/tool/:id`，部署基础路径 `/webtools-hub/`，每个工具独立懒加载。
- UI 参考：`/Users/viper/codex/auto-gen-checkpoint-name/docs/layout.html`。220px 侧栏、56px 顶栏、#2563eb 主色、#f8f9fc 背景、8px 圆角、独立内容滚动；保留深色与英文导航。
- 工具标题只由页面头部显示。输入弹窗只能用明确按钮关闭。

## 验收
- 8 档记忆时长可选择，实际消失时间及配置重置正确。
- 全部工具路由可用，桌面和移动端无横向溢出、控制台异常。
- 新训练具备开始、过程、结果、重试；离开页面清理计时和监听。
- 输入校验、Unicode 转换、计时准确性、Markdown 隔离、复制反馈可回归。
- npm run lint、npm test、npm run build、浏览器回归通过。
- 提交推送 main，确认同一提交的 Pages Action 成功。
