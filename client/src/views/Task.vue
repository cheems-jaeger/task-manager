<template>
  <div class="task-wrapper">
    <div class="task-container">
      <button class="back-btn" @click="$router.push('/home')">← 返回首页</button>
      <h2>📋 任务管理</h2>

      <!-- 添加任务 -->
      <div class="add-box">
        <input v-model="content" placeholder="输入任务内容" @keyup.enter="add" :disabled="loading" />
        <button class="add-btn" @click="add" :disabled="loading">
          {{ loading ? '添加中...' : '添加任务' }}
        </button>
      </div>

      <!-- 加载/空状态 -->
      <div v-if="loadIng" class="tip">加载中...</div>
      <div v-else-if="list.length === 0" class="tip">暂无任务，添加一个吧~</div>

      <!-- 任务列表 -->
      <div class="task-list" v-else>
        <div v-for="item in list" :key="item.id" class="task-item card">
          <input type="checkbox" :checked="item.status === 1" @change="toggleStatus(item)" />
          <input v-model="item.content" :class="{ done: item.status === 1 }" @blur="update(item)" />
          <button class="del-btn" @click="del(item.id)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'
import { msg } from '../utils/message'

const content = ref('')
const list = ref([])
const loading = ref(false)
const loadIng = ref(true) // 页面加载状态

// 获取任务
const getList = async () => {
  loadIng.value = true
  try {
    const res = await request.get('/task/list')
    list.value = res.data
  } finally {
    loadIng.value = false
  }
}

// 添加任务
const add = async () => {
  if (!content.value.trim()) return msg.error('请输入任务内容')
  if (loading.value) return
  loading.value = true
  try {
    await request.post('/task/add', { content: content.value.trim() })
    msg.success('添加成功')
    content.value = ''
    getList()
  } finally {
    loading.value = false
  }
}

// 修改任务
const update = async (item) => {
  if (!item.content.trim()) return msg.error('内容不能为空')
  await request.put(`/task/update/${item.id}`, { content: item.content, status: item.status })
  msg.success('修改成功')
  getList()
}

// 切换状态
const toggleStatus = async (item) => {
  item.status = item.status === 1 ? 0 : 1
  await request.put(`/task/update/${item.id}`, { content: item.content, status: item.status })
  getList()
}

// 删除任务
const del = async (id) => {
  if (!msg.confirm('确定删除此任务？')) return
  await request.delete(`/task/delete/${id}`)
  msg.success('删除成功')
  getList()
}

onMounted(() => getList())
</script>

<style scoped>
.task-wrapper { padding: 30px 20px; max-width: 800px; margin: 0 auto; position: relative; }
.back-btn { position: absolute; left: 20px; top: 20px; background: #f1f1f1; padding: 6px 12px; font-size: 14px; }
h2 { text-align: center; margin-bottom: 24px; }
.add-box { display: flex; gap: 12px; margin-bottom: 24px; }
.add-box input { flex: 1; padding: 12px 14px; font-size: 15px; }
.add-btn { padding: 12px 20px; background: #42b983; color: #fff; white-space: nowrap; }
.tip { text-align: center; color: #999; padding: 40px 0; }
.task-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.task-item input[type="text"] { flex: 1; padding: 8px 12px; font-size: 15px; }
.done { text-decoration: line-through; color: #999; background: #f9f9f9; }
.del-btn { padding: 8px 12px; background: #f56c6c; color: #fff; font-size: 14px; }
</style>