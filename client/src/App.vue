<template>
  <div>
    <nav class="nav-bar">
      <div class="nav-container">
        <div class="nav-left">
          <div class="logo">
            <span class="logo-icon">📋</span>
            <span class="logo-text">TaskMaster</span>
          </div>
          <div class="nav-links">
            <router-link to="/home" class="nav-link">首页</router-link>
            <router-link to="/task" class="nav-link">任务管理</router-link>
          </div>
        </div>
        <div class="nav-right" v-if="userStore.isLoggedIn">
          <div class="user-info">
            <span class="user-name">欢迎，{{ userStore.username }}</span>
            <button class="logout-btn" @click="logout">
              <span class="logout-icon">🚪</span>
              退出
            </button>
          </div>
        </div>
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
.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 30px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.logo-icon {
  font-size: 24px;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
}

.nav-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
}

.user-name {
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.logout-icon {
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 12px 20px;
  }
  
  .nav-left {
    gap: 20px;
  }
  
  .logo-text {
    display: none;
  }
  
  .nav-links {
    gap: 12px;
  }
  
  .nav-link {
    font-size: 14px;
    padding: 6px 12px;
  }
  
  .user-name {
    font-size: 13px;
  }
  
  .logout-btn {
    font-size: 13px;
    padding: 4px 8px;
  }
}
</style>