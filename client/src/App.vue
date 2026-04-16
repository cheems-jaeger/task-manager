<template>
  <div>
    <nav class="nav-bar">
      <div class="nav-left">
        <router-link to="/home">首页</router-link>
        <router-link to="/task">任务管理</router-link>
      </div>
      <div class="nav-right" v-if="username">
        <span class="user-name">欢迎：{{ username }}</span>
        <button class="logout-btn" @click="logout">退出登录</button>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { msg } from './utils/message'

const router = useRouter()
const username = ref('')

// 自动获取登录状态
onMounted(() => {
  username.value = localStorage.getItem('username')
})

// 退出登录二次确认
const logout = () => {
  if (!msg.confirm('确定退出登录？')) return
  localStorage.clear()
  username.value = ''
  msg.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 30px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.nav-left { display: flex; gap: 24px; }
.nav-left a { text-decoration: none; color: #333; font-size: 15px; }
.nav-left a:hover { color: #42b983; }
.user-name { margin-right: 12px; color: #42b983; font-weight: 500; }
.logout-btn { padding: 6px 12px; background: #f56c6c; color: #fff; font-size: 14px; }
</style>