const { verifyToken } = require('../utils/jwt');
const { fail } = require('../utils/response');

// 登录校验中间件
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json(fail('请先登录', 401));
  }

  const userInfo = verifyToken(token.replace('Bearer ', ''));
  if (!userInfo) {
    return res.json(fail('登录已过期，请重新登录', 401));
  }

  // 把用户信息挂载到请求对象
  req.user = userInfo;
  next();
};

module.exports = authMiddleware;