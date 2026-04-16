<template>
  <div class="home">
    <h1>🏠 项目首页</h1>
    <p>{{ msg }}</p>
    <button @click="$router.push('/task')">去任务管理</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'

const msg = ref('加载中...')

onMounted(async () => {
  const res = await request.get('/hello')
  msg.value = res.message
})
</script>