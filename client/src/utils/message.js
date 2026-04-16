// 轻量友好提示，替代alert
export const msg = {
  // 成功提示
  success(text) {
    alert(`✅ ${text}`)
  },
  // 错误提示
  error(text) {
    alert(`❌ ${text}`)
  },
  // 确认框
  confirm(text) {
    return window.confirm(`⚠️ ${text}`)
  }
}