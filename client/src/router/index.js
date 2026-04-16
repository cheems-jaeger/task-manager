import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Task from '../views/Task.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/task', component: Task, meta: { requireAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：自动校验登录
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('username')

  // 已登录用户禁止访问登录/注册页
  if (token && (to.path === '/login' || to.path === '/register')) {
    next('/task')
    return
  }

  // 需要登录的页面校验
  if (to.meta.requireAuth && !token) {
    msg.error('请先登录')
    next('/login')
  } else {
    next()
  }
})

export default router