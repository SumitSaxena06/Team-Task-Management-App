const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getProjects, getProject, createProject, updateProject, deleteProject,
  addMember, removeMember, projectRules,
} = require('../controllers/projectController');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(projectRules, validate, createProject);

router.route('/:id')
  .get(getProject)
  .put(projectRules, validate, updateProject)
  .delete(deleteProject);

router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
