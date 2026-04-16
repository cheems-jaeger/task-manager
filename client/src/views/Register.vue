<template>
  <div class="reg-wrapper">
    <div class="reg-card card">
      <button class="back-btn" @click="goBack">← 返回登录</button>
      <h2>用户注册</h2>
      <div class="form-item">
        <input v-model="form.username" placeholder="用户名（≥3位）" @input="clearErr" />
      </div>
      <div class="form-item">
        <input v-model="form.password" :type="showPwd ? 'text' : 'password'" placeholder="密码（≥6位）" @input="clearErr" />
        <span class="eye" @click="showPwd = !showPwd">{{ showPwd ? '隐藏' : '显示' }}</span>
      </div>
      <button class="submit-btn" @click="register" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>
      <p class="link" @click="$router.push('/login')">已有账号？去登录</p>
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

const goBack = () => router.back()
const clearErr = () => {}

const register = async () => {
  if (form.value.username.length < 3) return msg.error('用户名≥3位')
  if (form.value.password.length < 6) return msg.error('密码≥6位')
  if (loading.value) return

  loading.value = true
  try {
    const res = await request.post('/user/register', form.value)
    if (res.code === 200) {
      msg.success('注册成功！请登录')
      router.push('/login')
    } else {
      msg.error(res.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reg-wrapper { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 70px); padding: 20px; }
.reg-card { width: 100%; max-width: 420px; position: relative; text-align: center; }
.back-btn { position: absolute; left: 20px; top: 20px; background: #f1f1f1; padding: 6px 12px; font-size: 14px; }
h2 { margin: 20px 0 30px; color: #333; }
.form-item { margin-bottom: 18px; position: relative; }
.form-item input { width: 100%; padding: 12px 14px; font-size: 15px; }
.eye { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 14px; color: #666; cursor: pointer; }
.submit-btn { width: 100%; padding: 12px; background: #42b983; color: #fff; font-size: 16px; margin-top: 10px; }
.submit-btn:disabled { background: #999; cursor: not-allowed; }
.link { margin-top: 20px; color: #666; cursor: pointer; font-size: 14px; }
</style>