import { defineStore } from 'pinia'
import request from '../utils/request'
import { msg } from '../utils/message'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: localStorage.getItem('username') || '',
    token: localStorage.getItem('token') || '',
    loading: false
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  
  actions: {
    // 登录
    async login(username, password) {
      this.loading = true
      try {
        const res = await request.post('/user/login', { username, password })
        if (res.code === 200) {
          this.username = res.data.username
          this.token = res.data.token
          localStorage.setItem('username', res.data.username)
          localStorage.setItem('token', res.data.token)
          msg.success('登录成功')
          return true
        } else {
          msg.error(res.message)
          return false
        }
      } catch (error) {
        msg.error('登录失败：网络错误')
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 注册
    async register(username, password) {
      this.loading = true
      try {
        const res = await request.post('/user/register', { username, password })
        if (res.code === 200) {
          msg.success('注册成功！请登录')
          return true
        } else {
          msg.error(res.message)
          return false
        }
      } catch (error) {
        msg.error('注册失败：网络错误')
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 退出登录
    logout() {
      if (!msg.confirm('确定退出登录？')) return
      this.username = ''
      this.token = ''
      localStorage.clear()
      msg.success('退出成功')
    },
    
    // 检查登录状态
    checkLogin() {
      return !!this.token
    }
  }
})