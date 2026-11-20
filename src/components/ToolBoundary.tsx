import { Component } from 'react'
import type { ReactNode } from 'react'
export default class ToolBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <div className="empty-state" role="alert"><h2>工具暂时无法打开</h2><p>请刷新页面重试，输入数据不会上传。</p><button className="primary-button" onClick={() => window.location.reload()}>刷新页面</button></div> : this.props.children
  }
}
