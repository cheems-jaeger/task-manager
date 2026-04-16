<template>
  <div>
    <nav class="nav-bar">
      <div class="nav-left">
        <router-link to="/home">首页</router-link>
        <router-link to="/task">任务管理</router-link>
      </div>
      <div class="nav-right" v-if="userStore.isLoggedIn">
        <span class="user-name">欢迎：{{ userStore.username }}</span>
        <button class="logout-btn" @click="logout">退出登录</button>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user'

const router = useRouter()
const userStore = useUserStore()

// 退出登录
const logout = () => {
  userStore.logout()
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