import axios from 'axios'
import { msg } from './message'

const service = axios.create({
  baseURL: '/api',
  timeout: 8000
})

// 请求拦截：自动加Token
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = 'Bearer ' + token
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截：统一处理错误
service.interceptors.response.use(
  res => {
    if (res.data.code === 401) {
      msg.error('登录已过期，请重新登录')
      localStorage.clear()
      window.location.href = '/login'
    }
    return res.data
  },
  error => {
    msg.error('网络异常，请稍后重试')
    return Promise.reject(error)
  }
)

export default service