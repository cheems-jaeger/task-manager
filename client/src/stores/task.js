import { defineStore } from 'pinia'
import request from '../utils/request'
import { msg } from '../utils/message'

export const useTaskStore = defineStore('task', {
  state: () => ({
    list: [],
    categories: ['工作', '生活', '学习', '其他'],
    loading: false,
    loadIng: false,
    filters: {
      category: '',
      priority: '',
      status: ''
    }
  }),
  
  getters: {
    completedTasks: (state) => state.list.filter(task => task.status === 1),
    pendingTasks: (state) => state.list.filter(task => task.status === 0),
    filteredTasks: (state) => {
      let result = state.list
      if (state.filters.category) {
        result = result.filter(task => task.category === state.filters.category)
      }
      if (state.filters.priority) {
        result = result.filter(task => task.priority === state.filters.priority)
      }
      if (state.filters.status !== '') {
        result = result.filter(task => task.status === state.filters.status)
      }
      return result
    }
  },
  
  actions: {
    // 获取任务列表
    async getList() {
      this.loadIng = true
      try {
        const res = await request.get('/task/list')
        this.list = res.data
      } catch (error) {
        msg.error('获取任务失败：网络错误')
      } finally {
        this.loadIng = false
      }
    },
    
    // 获取所有分类
    async getCategories() {
      try {
        const res = await request.get('/task/categories')
        if (res.code === 200) {
          this.categories = res.data
        }
      } catch (error) {
        console.error('获取分类失败：', error)
      }
    },
    
    // 添加任务
    async addTask(content, category = '其他', priority = 'medium') {
      if (!content || content.trim() === '') {
        msg.error('请输入任务内容')
        return false
      }
      
      if (content.length > 100) {
        msg.error('任务内容不能超过100个字符')
        return false
      }
      
      this.loading = true
      try {
        const res = await request.post('/task/add', { 
          content: content.trim(),
          category,
          priority
        })
        if (res.code === 200) {
          msg.success('添加成功')
          await this.getList()
          return true
        } else {
          msg.error(res.message)
          return false
        }
      } catch (error) {
        msg.error('添加失败：网络错误')
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 更新任务
    async updateTask(id, content, status, category, priority) {
      if (!content || content.trim() === '') {
        msg.error('内容不能为空')
        return false
      }
      
      if (content.length > 100) {
        msg.error('内容不能超过100个字符')
        return false
      }
      
      try {
        const res = await request.put(`/task/update/${id}`, { 
          content: content.trim(), 
          status,
          category,
          priority
        })
        if (res.code === 200) {
          msg.success('修改成功')
          await this.getList()
          return true
        } else {
          msg.error(res.message)
          return false
        }
      } catch (error) {
        msg.error('修改失败：网络错误')
        return false
      }
    },
    
    // 切换任务状态
    async toggleStatus(task) {
      const newStatus = task.status === 1 ? 0 : 1
      try {
        const res = await request.put(`/task/update/${task.id}`, { 
          content: task.content, 
          status: newStatus,
          category: task.category,
          priority: task.priority
        })
        if (res.code === 200) {
          await this.getList()
          return true
        } else {
          msg.error(res.message)
          return false
        }
      } catch (error) {
        msg.error('更新状态失败：网络错误')
        return false
      }
    },
    
    // 删除任务
    async deleteTask(id) {
      if (!msg.confirm('确定删除此任务？')) return false
      
      try {
        const res = await request.delete(`/task/delete/${id}`)
        if (res.code === 200) {
          msg.success('删除成功')
          await this.getList()
          return true
        } else {
          msg.error(res.message)
          return false
        }
      } catch (error) {
        msg.error('删除失败：网络错误')
        return false
      }
    },
    
    // 设置筛选条件
    setFilter(key, value) {
      this.filters[key] = value
    },
    
    // 清空筛选条件
    clearFilters() {
      this.filters = {
        category: '',
        priority: '',
        status: ''
      }
    }
  }
})