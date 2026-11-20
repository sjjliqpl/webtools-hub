export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true }
  catch { window.dispatchEvent(new CustomEvent('webtools-notice', { detail: '复制失败，请选择文本后手动复制' })); return false }
}
