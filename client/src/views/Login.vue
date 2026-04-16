<template>
  <div class="login-wrapper">
    <div class="login-card card">
      <button class="back-btn" @click="goBack">← 返回首页</button>
      <h2>用户登录</h2>
      <div class="form-item">
        <input v-model="form.username" placeholder="请输入用户名" @input="clearErr" />
      </div>
      <div class="form-item">
        <input v-model="form.password" :type="showPwd ? 'text' : 'password'" placeholder="请输入密码" @input="clearErr" />
        <span class="eye" @click="showPwd = !showPwd">{{ showPwd ? '隐藏' : '显示' }}</span>
      </div>
      <button class="submit-btn" @click="login" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <p class="link" @click="$router.push('/register')">没有账号？去注册</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '../utils/request'
import { msg } from '../utils/message'

const router = useRouter()
const form = ref({ username: '', password: '' })
const loading = ref(false)
const showPwd = ref(false)

const goBack = () => router.back() || router.push('/home')
const clearErr = () => {}

// 登录（防重复+提示）
const login = async () => {
  if (!form.value.username) return msg.error('请输入用户名')
  if (!form.value.password) return msg.error('请输入密码')
  if (loading.value) return

  loading.value = true
  try {
    const res = await request.post('/user/login', form.value)
    if (res.code === 200) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.username)
      msg.success('登录成功')
      router.push('/task')
    } else {
      msg.error(res.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 保留原有美化样式 */
.login-wrapper { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 70px); padding: 20px; }
.login-card { width: 100%; max-width: 420px; position: relative; text-align: center; }
.back-btn { position: absolute; left: 20px; top: 20px; background: #f1f1f1; padding: 6px 12px; font-size: 14px; }
h2 { margin: 20px 0 30px; color: #333; }
.form-item { margin-bottom: 18px; position: relative; }
.form-item input { width: 100%; padding: 12px 14px; font-size: 15px; }
.eye { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 14px; color: #666; cursor: pointer; }
.submit-btn { width: 100%; padding: 12px; background: #42b983; color: #fff; font-size: 16px; margin-top: 10px; }
.submit-btn:disabled { background: #999; cursor: not-allowed; }
.link { margin-top: 20px; color: #666; cursor: pointer; font-size: 14px; }
</style>