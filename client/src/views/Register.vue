<template>
  <div class="reg-wrapper">
    <div class="reg-card card">
      <button class="back-btn" @click="goBack">← 返回登录</button>
      <h2>用户注册</h2>
      <div class="form-item">
        <input v-model="form.username" placeholder="用户名（≥3位）" @input="validateField('username')" />
        <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
      </div>
      <div class="form-item">
        <input v-model="form.password" :type="showPwd ? 'text' : 'password'" placeholder="密码（≥6位）" @input="validateField('password')" />
        <span class="eye" @click="showPwd = !showPwd">{{ showPwd ? '隐藏' : '显示' }}</span>
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
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
import { useUserStore } from '../stores/user'

const router = useRouter()
const form = ref({ username: '', password: '' })
const showPwd = ref(false)
const errors = ref({})
const userStore = useUserStore()

const goBack = () => router.back()

// 验证单个字段
const validateField = (field) => {
  if (field === 'username') {
    if (!form.value.username) {
      errors.value.username = '请输入用户名'
    } else if (form.value.username.length < 3 || form.value.username.length > 20) {
      errors.value.username = '用户名长度应在3-20个字符之间'
    } else {
      delete errors.value.username
    }
  } else if (field === 'password') {
    if (!form.value.password) {
      errors.value.password = '请输入密码'
    } else if (form.value.password.length < 6) {
      errors.value.password = '密码长度至少6个字符'
    } else {
      delete errors.value.password
    }
  }
}

// 验证所有字段
const validateForm = () => {
  let isValid = true
  
  if (!form.value.username) {
    errors.value.username = '请输入用户名'
    isValid = false
  } else if (form.value.username.length < 3 || form.value.username.length > 20) {
    errors.value.username = '用户名长度应在3-20个字符之间'
    isValid = false
  }
  
  if (!form.value.password) {
    errors.value.password = '请输入密码'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = '密码长度至少6个字符'
    isValid = false
  }
  
  return isValid
}

const register = async () => {
  if (!validateForm()) return
  if (userStore.loading) return

  const success = await userStore.register(form.value.username, form.value.password)
  if (success) {
    router.push('/login')
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
.error-message { display: block; color: #f56c6c; font-size: 12px; text-align: left; margin-top: 4px; }
</style>