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
.task-wrapper {
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 20px;
  top: 20px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

h2 {
  text-align: center;
  margin-bottom: 32px;
  color: #333;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.add-box {
  background: #fff;
  padding: 28px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.add-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.add-row input {
  flex: 1;
  padding: 14px 18px;
  font-size: 16px;
  border: 2px solid #eaeaea;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.add-row input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-btn {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  white-space: nowrap;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.add-btn:disabled {
  background: #999;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.add-options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.select-category, .select-priority {
  padding: 10px 16px;
  font-size: 14px;
  border: 2px solid #eaeaea;
  border-radius: 8px;
  background: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.select-category:focus, .select-priority:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.error-message {
  display: block;
  color: #f56c6c;
  font-size: 12px;
  text-align: left;
  margin-top: 8px;
  font-weight: 500;
}

.filter-box {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  flex-wrap: wrap;
  border: 1px solid #eaeaea;
}

.filter-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  min-width: 60px;
}

.filter-select {
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.filter-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.clear-btn {
  padding: 8px 16px;
  background: #909399;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #606266;
  transform: translateY(-1px);
}

.tip {
  text-align: center;
  color: #999;
  padding: 60px 0;
  font-size: 16px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.task-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.task-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 0 0 12px;
}

.task-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
  accent-color: #667eea;
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-content input[type="text"] {
  padding: 10px 14px;
  font-size: 16px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.task-content input[type="text"]:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: #fff;
}

.done {
  text-decoration: line-through;
  color: #999;
  background: #f5f5f5 !important;
}

.task-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.category-tag {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 12px;
  font-weight: 500;
  background: #ecf5ff;
  color: #409eff;
  transition: all 0.3s ease;
}

.category-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.category-tag.category-工作 {
  background: #fdf6ec;
  color: #f56c6c;
}

.category-tag.category-生活 {
  background: #f0f9eb;
  color: #67c23a;
}

.category-tag.category-学习 {
  background: #ecf5ff;
  color: #409eff;
}

.category-tag.category-其他 {
  background: #f4f4f5;
  color: #909399;
}

.priority-tag {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.priority-tag:hover {
  transform: scale(1.05);
}

.priority-tag.priority-high {
  background: #fef0f0;
  color: #f56c6c;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.2);
}

.priority-tag.priority-medium {
  background: #fdf6ec;
  color: #e6a23c;
  box-shadow: 0 2px 8px rgba(230, 162, 60, 0.2);
}

.priority-tag.priority-low {
  background: #f0f9eb;
  color: #67c23a;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.2);
}

.del-btn {
  padding: 10px 16px;
  background: #f56c6c;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  align-self: flex-start;
  margin-top: 2px;
}

.del-btn:hover {
  background: #f5222d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-wrapper {
    padding: 20px 16px;
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .add-box {
    padding: 20px;
  }
  
  .add-row {
    flex-direction: column;
  }
  
  .add-btn {
    align-self: stretch;
  }
  
  .add-options {
    flex-direction: column;
  }
  
  .filter-box {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .task-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .task-meta {
    justify-content: space-between;
  }
  
  .del-btn {
    align-self: flex-end;
  }
}
</style>