const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { success, fail } = require('../utils/response');

// 注册
const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json(fail('用户名和密码不能为空'));
  }

  try {
    // 检查用户名是否已存在
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length > 0) {
      return res.json(fail('用户名已存在'));
    }

    // 密码加密
    const salt = bcrypt.genSaltSync(10);
    const hashPwd = bcrypt.hashSync(password, salt);

    // 插入数据库
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashPwd]);
    res.json(success(null, '注册成功'));
  } catch (err) {
    res.json(fail('注册失败：' + err.message));
  }
};

// 登录
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 查询用户
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.json(fail('用户名不存在'));
    }

    const user = result.rows[0];
    // 密码校验
    const isOk = bcrypt.compareSync(password, user.password);
    if (!isOk) {
      return res.json(fail('密码错误'));
    }

    // 生成Token
    const token = generateToken(user);
    res.json(success({ token, username: user.username }, '登录成功'));
  } catch (err) {
    res.json(fail('登录失败：' + err.message));
  }
};

module.exports = { register, login };