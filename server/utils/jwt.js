const jwt = require('jsonwebtoken');
require('dotenv').config();

// 生成Token
const generateToken = (userInfo) => {
  return jwt.sign(
    { id: userInfo.id, username: userInfo.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// 校验Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };