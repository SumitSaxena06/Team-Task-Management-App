const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getTasks, getTask, createTask, updateTask, deleteTask,
  getDashboardStats, taskRules,
} = require('../controllers/taskController');

router.use(protect);

router.get('/dashboard/stats', getDashboardStats);

router.route('/')
  .get(getTasks)
  .post(taskRules, validate, createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
