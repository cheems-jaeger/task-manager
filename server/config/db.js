const { Pool } = require('pg');
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

module.exports = pool;