import React, { useEffect, useState } from 'react';
import { Plus, CheckSquare, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import AppLayout from '../components/layout/AppLayout';
import TaskModal from '../components/tasks/TaskModal';
import TaskCard from '../components/tasks/TaskCard';

const STATUSES = ['todo', 'in-progress', 'review', 'done'];
const STATUS_LABELS = { 'todo': 'To Do', 'in-progress': 'In Progress', 'review': 'Review', 'done': 'Done' };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', project: '', search: '' });
  const [view, setView] = useState('board'); // 'board' | 'list'

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.project) params.set('project', filters.project);
    if (filters.search) params.set('search', filters.search);

    Promise.all([
      api.get(`/tasks?${params}`),
      api.get('/projects'),
    ])
      .then(([{ data: t }, { data: p }]) => { setTasks(t.tasks); setProjects(p.projects); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${id}`); toast.success('Task deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const handleStatusChange = async (id, status) => {
    try { await api.put(`/tasks/${id}`, { status }); load(); }
    catch (err) { toast.error('Failed to update status'); }
  };

  const tasksByStatus = STATUSES.reduce((acc, s) => {
    acc[s] = tasks.filter(t => t.status === s);
    return acc;
  }, {});

  const statusColors = { 'todo': 'var(--text-dim)', 'in-progress': 'var(--blue)', 'review': 'var(--yellow)', 'done': 'var(--green)' };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'var(--bg-3)', borderRadius: 8, padding: 3 }}>
            <button className={`btn btn-sm ${view === 'board' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('board')}>Board</button>
            <button className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('list')}>List</button>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditTask(null); setShowModal(true); }}>
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
          <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input placeholder="Search tasks..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} style={{ paddingLeft: '2.25rem', height: 36 }} />
        </div>
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} style={{ width: 140 }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))} style={{ width: 130 }}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select value={filters.project} onChange={e => setFilters(f => ({ ...f, project: e.target.value }))} style={{ width: 160 }}>
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>

      <div className="page-content">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><span className="spinner" /></div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <CheckSquare size={48} />
            <h3>No tasks found</h3>
            <p>Create a new task or adjust your filters</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Create Task</button>
          </div>
        ) : view === 'board' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {STATUSES.map(status => (
              <div key={status}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColors[status] }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem' }}>{STATUS_LABELS[status]}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', background: 'var(--bg-3)', borderRadius: 99, padding: '1px 8px' }}>{tasksByStatus[status].length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {tasksByStatus[status].map(t => (
                    <TaskCard key={t._id} task={t} onEdit={() => { setEditTask(t); setShowModal(true); }} onDelete={() => handleDelete(t._id)} onStatusChange={handleStatusChange} />
                  ))}
                  {tasksByStatus[status].length === 0 && (
                    <div style={{ padding: '1rem', background: 'var(--bg-2)', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tasks.map(t => (
              <TaskCard key={t._id} task={t} onEdit={() => { setEditTask(t); setShowModal(true); }} onDelete={() => handleDelete(t._id)} onStatusChange={handleStatusChange} listView />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal task={editTask} projects={projects} onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); load(); }} />
      )}
    </AppLayout>
  );
}
