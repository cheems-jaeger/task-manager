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
.reg-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.reg-card {
  width: 100%;
  max-width: 450px;
  position: relative;
  text-align: center;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  border: 1px solid #f0f0f0;
  backdrop-filter: blur(10px);
}

.back-btn {
  position: absolute;
  left: 20px;
  top: 20px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.back-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

h2 {
  margin: 20px 0 30px;
  color: #333;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-item {
  margin-bottom: 24px;
  position: relative;
  text-align: left;
}

.form-item input {
  width: 100%;
  padding: 14px 18px;
  font-size: 16px;
  border: 2px solid #eaeaea;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-item input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: #fff;
  outline: none;
}

.eye {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.eye:hover {
  color: #667eea;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  background: #999;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.link {
  margin-top: 24px;
  color: #667eea;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.error-message {
  display: block;
  color: #f56c6c;
  font-size: 12px;
  text-align: left;
  margin-top: 6px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .reg-card {
    padding: 30px 24px;
  }
  
  h2 {
    font-size: 20px;
  }
  
  .form-item input {
    padding: 12px 16px;
  }
  
  .submit-btn {
    padding: 12px;
  }
}
</style>