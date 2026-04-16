const pool = require('../config/db');
const { success, fail } = require('../utils/response');

// 任务分类枚举
const CATEGORIES = ['工作', '生活', '学习', '其他'];
// 任务优先级枚举
const PRIORITIES = ['low', 'medium', 'high'];

// 发送任务变更通知
const sendTaskNotification = async (operation, task) => {
  try {
    const notificationData = {
      operation,
      id: task.id,
      user_id: task.user_id,
      content: task.content,
      status: task.status,
      category: task.category,
      priority: task.priority,
      timestamp: new Date().toISOString()
    };
    
    // 打印到控制台
    console.log('📢 任务变更通知:', notificationData);
    
    // 这里可以添加其他通知方式，比如WebSocket
  } catch (err) {
    console.error('发送通知失败：', err);
  }
};

// 查询自己的任务
const getList = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY priority DESC, id DESC',
      [req.user.id]
    );
    res.json(success(result.rows));
  } catch (err) {
    console.error('获取任务失败：', err);
    res.json(fail('获取失败：服务器内部错误'));
  }
};

// 新增任务（绑定当前用户）
const addTask = async (req, res) => {
  const { content, category = '其他', priority = 'medium' } = req.body;
  
  // 验证输入
  if (!content || content.trim() === '') {
    return res.json(fail('内容不能为空'));
  }
  
  if (content.length > 100) {
    return res.json(fail('任务内容不能超过100个字符'));
  }
  
  // 验证分类
  if (!CATEGORIES.includes(category)) {
    return res.json(fail('无效的任务分类'));
  }
  
  // 验证优先级
  if (!PRIORITIES.includes(priority)) {
    return res.json(fail('无效的任务优先级'));
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (content, category, priority, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [content.trim(), category, priority, req.user.id]
    );
    
    // 发送通知
    await sendTaskNotification('INSERT', result.rows[0]);
    
    res.json(success({ id: result.rows[0].id }, '添加成功'));
  } catch (err) {
    console.error('添加任务失败：', err);
    res.json(fail('添加失败：服务器内部错误'));
  }
};

// 修改任务
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { content, status, category, priority } = req.body;

  // 验证输入
  if (!content || content.trim() === '') {
    return res.json(fail('内容不能为空'));
  }
  
  if (content.length > 100) {
    return res.json(fail('任务内容不能超过100个字符'));
  }
  
  if (status !== 0 && status !== 1) {
    return res.json(fail('任务状态无效'));
  }
  
  // 验证分类
  if (category && !CATEGORIES.includes(category)) {
    return res.json(fail('无效的任务分类'));
  }
  
  // 验证优先级
  if (priority && !PRIORITIES.includes(priority)) {
    return res.json(fail('无效的任务优先级'));
  }

  try {
    // 检查任务是否存在且属于当前用户
    const checkResult = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.json(fail('任务不存在或无权限修改'));
    }
    
    await pool.query(
      'UPDATE tasks SET content = $1, status = $2, category = COALESCE($3, category), priority = COALESCE($4, priority) WHERE id = $5 AND user_id = $6',
      [content.trim(), status, category, priority, id, req.user.id]
    );
    
    // 获取更新后的任务
    const updatedResult = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );
    
    // 发送通知
    await sendTaskNotification('UPDATE', updatedResult.rows[0]);
    
    res.json(success(null, '修改成功'));
  } catch (err) {
    console.error('修改任务失败：', err);
    res.json(fail('修改失败：服务器内部错误'));
  }
};

// 删除任务
const deleteTask = async (req, res) => {
  const { id } = req.params;
  
  // 验证ID格式
  if (!id || isNaN(Number(id))) {
    return res.json(fail('无效的任务ID'));
  }

  try {
    // 检查任务是否存在且属于当前用户
    const checkResult = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.json(fail('任务不存在或无权限删除'));
    }
    
    const taskToDelete = checkResult.rows[0];
    
    await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    // 发送通知
    await sendTaskNotification('DELETE', taskToDelete);
    
    res.json(success(null, '删除成功'));
  } catch (err) {
    console.error('删除任务失败：', err);
    res.json(fail('删除失败：服务器内部错误'));
  }
};

// 获取所有分类
const getCategories = async (req, res) => {
  res.json(success(CATEGORIES));
};

module.exports = { getList, addTask, updateTask, deleteTask, getCategories };