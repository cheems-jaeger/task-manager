const { Pool, Client } = require('pg');
require('dotenv').config();

// 数据库连接池（严格对应.env配置）
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD, // 必须和你psql的密码一致
  database: process.env.DB_NAME || 'task_db',
});

// 强制测试连接（一定会打印日志，确保执行）
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ 数据库连接失败：', err.stack);
    return;
  }
  console.log('✅ PostgreSQL 数据库连接成功！');
  release(); // 释放连接
});

// 创建专用客户端用于监听通知
const notifyClient = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'task_db',
});

// 连接并开始监听
notifyClient.connect()
  .then(() => {
    console.log('✅ 通知监听客户端连接成功！');
    return notifyClient.query('LISTEN task_changed');
  })
  .then(() => {
    console.log('✅ 开始监听任务变更通知！');
    // 监听通知事件
    notifyClient.on('notification', (msg) => {
      console.log('📢 任务变更通知:', JSON.parse(msg.payload));
    });
  })
  .catch(err => {
    console.error('❌ 通知客户端连接失败：', err);
  });

module.exports = pool;