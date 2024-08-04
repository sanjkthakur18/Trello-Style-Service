const express = require('express');
const { createTask, getAllTask, getTask, updateTask, deleteTask, updateTaskStatus } = require('../controller/taskCtrl');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getAllTask);
router.get('/:id', authMiddleware, getTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);
router.patch('/:id/status', authMiddleware, updateTaskStatus);

module.exports = router;
