require('./config/db');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authMiddleware = require('./middlewares/auth');
const { success } = require('./utils/response');

const app = express();

app.use(cors());
app.use(express.json());

// 测试接口
app.get('/api/hello', (req, res) => {
  res.json(success(null, '✅ 前后端连接成功！'));
});

// 用户接口（无需登录）
app.use('/api/user', userRoutes);
// 任务接口（必须登录）
app.use('/api/task', authMiddleware, taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 后端运行在 http://localhost:${PORT}`);
});