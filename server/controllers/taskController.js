const pool = require('../config/db');
const { success, fail } = require('../utils/response');

// 查询自己的任务
const getList = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC',
      [req.user.id]
    );
    res.json(success(result.rows));
  } catch (err) {
    res.json(fail('获取失败：' + err.message));
  }
};

// 新增任务（绑定当前用户）
const addTask = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.json(fail('内容不能为空'));

  try {
    await pool.query(
      'INSERT INTO tasks (content, user_id) VALUES ($1, $2)',
      [content, req.user.id]
    );
    res.json(success(null, '添加成功'));
  } catch (err) {
    res.json(fail('添加失败：' + err.message));
  }
};

// 修改任务
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { content, status } = req.body;

  try {
    await pool.query(
      'UPDATE tasks SET content = $1, status = $2 WHERE id = $3 AND user_id = $4',
      [content, status, id, req.user.id]
    );
    res.json(success(null, '修改成功'));
  } catch (err) {
    res.json(fail('修改失败：' + err.message));
  }
};

// 删除任务
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json(success(null, '删除成功'));
  } catch (err) {
    res.json(fail('删除失败：' + err.message));
  }
};

module.exports = { getList, addTask, updateTask, deleteTask };