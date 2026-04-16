// 统一返回格式
function success(data = null, message = '操作成功') {
  return { code: 200, message, data }
}

function fail(message = '操作失败', code = 500) {
  return { code, message, data: null }
}

module.exports = { success, fail }