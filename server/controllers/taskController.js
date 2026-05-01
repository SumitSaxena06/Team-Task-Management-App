const { body } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

exports.taskRules = [
  body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 200 }),
  body('description').optional().isLength({ max: 1000 }),
  body('status').optional().isIn(['todo', 'in-progress', 'review', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  body('project').notEmpty().withMessage('Project ID is required'),
];

// Helper: check project access
const checkProjectAccess = async (projectId, userId, userRole) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: 'Project not found', status: 404 };

  const isOwner = project.owner.toString() === userId.toString();
  const isMember = project.members.some((m) => m.user.toString() === userId.toString());
  if (!isOwner && !isMember && userRole !== 'admin') {
    return { error: 'Access denied to this project', status: 403 };
  }
  return { project };
};

// @GET /api/tasks?project=&assignedTo=&status=&priority=
exports.getTasks = async (req, res, next) => {
  try {
    const { project, assignedTo, status, priority, search } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    // Non-admins can only see tasks in their projects
    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({
        $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
      }).select('_id');
      const projectIds = userProjects.map((p) => p._id);

      if (project && !projectIds.map(String).includes(String(project))) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (!project) filter.project = { $in: projectIds };
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    next(err);
  }
};

// @GET /api/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('project', 'name owner members');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const { error, status } = await checkProjectAccess(task.project._id, req.user._id, req.user.role);
    if (error) return res.status(status).json({ success: false, message: error });

    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { error, status } = await checkProjectAccess(req.body.project, req.user._id, req.user.role);
    if (error) return res.status(status).json({ success: false, message: error });

    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    await task.populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email' },
      { path: 'project', select: 'name' },
    ]);

    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project', 'owner members');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const { error, status } = await checkProjectAccess(task.project._id, req.user._id, req.user.role);
    if (error) return res.status(status).json({ success: false, message: error });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email' },
      { path: 'project', select: 'name' },
    ]);

    res.json({ success: true, task: updated });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project', 'owner members');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isProjectOwner = task.project.owner.toString() === req.user._id.toString();
    if (!isCreator && !isProjectOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

// @GET /api/tasks/dashboard/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    let projectFilter = {};
    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({
        $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
      }).select('_id');
      projectFilter = { project: { $in: userProjects.map((p) => p._id) } };
    }

    const now = new Date();
    const [total, todo, inProgress, review, done, overdue, myTasks] = await Promise.all([
      Task.countDocuments(projectFilter),
      Task.countDocuments({ ...projectFilter, status: 'todo' }),
      Task.countDocuments({ ...projectFilter, status: 'in-progress' }),
      Task.countDocuments({ ...projectFilter, status: 'review' }),
      Task.countDocuments({ ...projectFilter, status: 'done' }),
      Task.countDocuments({ ...projectFilter, status: { $ne: 'done' }, dueDate: { $lt: now } }),
      Task.countDocuments({ assignedTo: req.user._id, status: { $ne: 'done' } }),
    ]);

    // Recent activity: last 5 updated tasks
    const recentTasks = await Task.find(projectFilter)
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('assignedTo', 'name avatar')
      .populate('project', 'name');

    res.json({
      success: true,
      stats: { total, todo, inProgress, review, done, overdue, myTasks },
      recentTasks,
    });
  } catch (err) {
    next(err);
  }
};
