const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')

router.get('/list', taskController.getList)       // 查询
router.post('/add', taskController.addTask)       // 新增
router.put('/update/:id', taskController.updateTask) // 修改
router.delete('/delete/:id', taskController.deleteTask) // 删除

module.exports = router