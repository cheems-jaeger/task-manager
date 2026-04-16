const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 注册 + 登录 接口
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;