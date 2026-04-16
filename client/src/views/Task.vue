<template>
  <div class="task-wrapper">
    <div class="task-container">
      <button class="back-btn" @click="$router.push('/home')">← 返回首页</button>
      <h2>📋 任务管理</h2>

      <!-- 添加任务 -->
      <div class="add-box">
        <div class="add-row">
          <input 
            v-model="content" 
            placeholder="输入任务内容" 
            @keyup.enter="add" 
            :disabled="taskStore.loading"
            @input="validateContent"
          />
          <button class="add-btn" @click="add" :disabled="taskStore.loading">
            {{ taskStore.loading ? '添加中...' : '添加任务' }}
          </button>
        </div>
        <div class="add-options">
          <select v-model="category" class="select-category">
            <option value="">选择分类</option>
            <option v-for="cat in taskStore.categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select v-model="priority" class="select-priority">
            <option value="">选择优先级</option>
            <option value="high">🔴 高优先级</option>
            <option value="medium">🟡 中优先级</option>
            <option value="low">🟢 低优先级</option>
          </select>
        </div>
        <span v-if="error" class="error-message">{{ error }}</span>
      </div>

      <!-- 筛选功能 -->
      <div class="filter-box">
        <span class="filter-label">筛选：</span>
        <select v-model="filterCategory" @change="setFilter('category', filterCategory)" class="filter-select">
          <option value="">全部分类</option>
          <option v-for="cat in taskStore.categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <select v-model="filterPriority" @change="setFilter('priority', filterPriority)" class="filter-select">
          <option value="">全部优先级</option>
          <option value="high">🔴 高优先级</option>
          <option value="medium">🟡 中优先级</option>
          <option value="low">🟢 低优先级</option>
        </select>
        <select v-model="filterStatus" @change="setFilter('status', filterStatus)" class="filter-select">
          <option value="">全部状态</option>
          <option value="0">待完成</option>
          <option value="1">已完成</option>
        </select>
        <button class="clear-btn" @click="clearFilters">清空筛选</button>
      </div>

      <!-- 加载/空状态 -->
      <div v-if="taskStore.loadIng" class="tip">加载中...</div>
      <div v-else-if="taskStore.filteredTasks.length === 0" class="tip">暂无任务，添加一个吧~</div>

      <!-- 任务列表 -->
      <div class="task-list" v-else>
        <div v-for="item in taskStore.filteredTasks" :key="item.id" class="task-item card">
          <input type="checkbox" :checked="item.status === 1" @change="toggleStatus(item)" />
          <div class="task-content">
            <input 
              v-model="item.content" 
              :class="{ done: item.status === 1 }" 
              @blur="update(item)"
              @input="() => { delete item.error }"
            />
            <div class="task-meta">
              <span class="category-tag" :class="'category-' + item.category">{{ item.category }}</span>
              <span class="priority-tag" :class="'priority-' + item.priority">
                {{ item.priority === 'high' ? '🔴 高' : item.priority === 'medium' ? '🟡 中' : '🟢 低' }}
              </span>
            </div>
          </div>
          <button class="del-btn" @click="del(item.id)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../stores/task'

const content = ref('')
const error = ref('')
const category = ref('其他')
const priority = ref('medium')
const filterCategory = ref('')
const filterPriority = ref('')
const filterStatus = ref('')
const taskStore = useTaskStore()

onMounted(() => {
  taskStore.getList()
  taskStore.getCategories()
})

// 验证任务内容
const validateContent = () => {
  if (!content.value.trim()) {
    error.value = '请输入任务内容'
  } else if (content.value.length > 100) {
    error.value = '任务内容不能超过100个字符'
  } else {
    error.value = ''
  }
}

// 验证任务项内容
const validateTaskItem = (item) => {
  if (!item.content.trim()) {
    item.error = '内容不能为空'
    return false
  } else if (item.content.length > 100) {
    item.error = '内容不能超过100个字符'
    return false
  }
  delete item.error
  return true
}

// 添加任务
const add = async () => {
  validateContent()
  if (error.value) return
  
  const success = await taskStore.addTask(content.value, category.value, priority.value)
  if (success) {
    content.value = ''
    error.value = ''
    category.value = '其他'
    priority.value = 'medium'
  }
}

// 修改任务
const update = async (item) => {
  if (!validateTaskItem(item)) return
  await taskStore.updateTask(item.id, item.content, item.status, item.category, item.priority)
}

// 切换状态
const toggleStatus = async (item) => {
  await taskStore.toggleStatus(item)
}

// 删除任务
const del = async (id) => {
  await taskStore.deleteTask(id)
}

// 设置筛选条件
const setFilter = (key, value) => {
  taskStore.setFilter(key, value)
}

// 清空筛选
const clearFilters = () => {
  filterCategory.value = ''
  filterPriority.value = ''
  filterStatus.value = ''
  taskStore.clearFilters()
}
</script>

<style scoped>
.task-wrapper { padding: 30px 20px; max-width: 900px; margin: 0 auto; position: relative; }
.back-btn { position: absolute; left: 20px; top: 20px; background: #f1f1f1; padding: 6px 12px; font-size: 14px; cursor: pointer; }
h2 { text-align: center; margin-bottom: 24px; }
.add-box { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.add-row { display: flex; gap: 12px; margin-bottom: 12px; }
.add-row input { flex: 1; padding: 12px 14px; font-size: 15px; border: 1px solid #ddd; border-radius: 4px; }
.add-btn { padding: 12px 20px; background: #42b983; color: #fff; white-space: nowrap; border: none; border-radius: 4px; cursor: pointer; }
.add-btn:disabled { background: #999; cursor: not-allowed; }
.add-options { display: flex; gap: 12px; }
.select-category, .select-priority { padding: 8px 12px; font-size: 14px; border: 1px solid #ddd; border-radius: 4px; }
.error-message { display: block; color: #f56c6c; font-size: 12px; text-align: left; margin-top: 8px; }
.filter-box { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding: 12px; background: #f5f5f5; border-radius: 4px; flex-wrap: wrap; }
.filter-label { font-weight: 500; }
.filter-select { padding: 6px 12px; font-size: 14px; border: 1px solid #ddd; border-radius: 4px; }
.clear-btn { padding: 6px 12px; background: #909399; color: #fff; font-size: 14px; border: none; border-radius: 4px; cursor: pointer; }
.tip { text-align: center; color: #999; padding: 40px 0; }
.task-list { display: flex; flex-direction: column; gap: 12px; }
.task-item { display: flex; align-items: center; gap: 12px; padding: 16px; }
.task-item input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
.task-content { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.task-content input[type="text"] { padding: 8px 12px; font-size: 15px; border: 1px solid #ddd; border-radius: 4px; }
.done { text-decoration: line-through; color: #999; background: #f9f9f9; }
.task-meta { display: flex; gap: 8px; align-items: center; }
.category-tag { padding: 2px 8px; font-size: 12px; border-radius: 4px; background: #ecf5ff; color: #409eff; }
.category-tag.category-工作 { background: #fdf6ec; color: #f56c6c; }
.category-tag.category-生活 { background: #f0f9eb; color: #67c23a; }
.category-tag.category-学习 { background: #ecf5ff; color: #409eff; }
.category-tag.category-其他 { background: #f4f4f5; color: #909399; }
.priority-tag { padding: 2px 8px; font-size: 12px; border-radius: 4px; }
.priority-tag.priority-high { background: #fef0f0; color: #f56c6c; }
.priority-tag.priority-medium { background: #fdf6ec; color: #e6a23c; }
.priority-tag.priority-low { background: #f0f9eb; color: #67c23a; }
.del-btn { padding: 8px 12px; background: #f56c6c; color: #fff; font-size: 14px; border: none; border-radius: 4px; cursor: pointer; }
</style>