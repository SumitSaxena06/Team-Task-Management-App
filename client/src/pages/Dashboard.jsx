import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, BarChart3, ListTodo, Timer, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} color={color} />
      </div>
    </div>
    <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700, color }}>{value}</div>
  </div>
);

const priorityColor = { low: 'var(--green)', medium: 'var(--yellow)', high: 'var(--orange)', critical: 'var(--red)' };
const statusColor = { todo: 'var(--text-muted)', 'in-progress': 'var(--blue)', review: 'var(--yellow)', done: 'var(--green)' };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/tasks/dashboard/stats')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><div className="page-loader"><span className="spinner" /></div></AppLayout>;

  const { stats: s, recentTasks } = stats || {};

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name} 👋</p>
        </div>
      </div>

      <div className="page-content">
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard label="Total Tasks" value={s?.total ?? 0} icon={BarChart3} color="var(--accent)" bg="var(--accent-dim)" />
          <StatCard label="To Do" value={s?.todo ?? 0} icon={ListTodo} color="var(--text-muted)" bg="var(--bg-3)" />
          <StatCard label="In Progress" value={s?.inProgress ?? 0} icon={Timer} color="var(--blue)" bg="var(--blue-dim)" />
          <StatCard label="In Review" value={s?.review ?? 0} icon={Clock} color="var(--yellow)" bg="var(--yellow-dim)" />
          <StatCard label="Done" value={s?.done ?? 0} icon={CheckCircle2} color="var(--green)" bg="var(--green-dim)" />
          <StatCard label="Overdue" value={s?.overdue ?? 0} icon={AlertCircle} color="var(--red)" bg="var(--red-dim)" />
          <StatCard label="My Tasks" value={s?.myTasks ?? 0} icon={User} color="var(--orange)" bg="var(--orange-dim)" />
        </div>

        {/* Progress bar */}
        {s?.total > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Overall Progress</span>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>{Math.round((s.done / s.total) * 100)}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--bg-3)', borderRadius: 99 }}>
              <div style={{ height: '100%', borderRadius: 99, background: 'var(--green)', width: `${(s.done / s.total) * 100}%`, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span><span style={{ color: 'var(--blue)' }}>●</span> {s.inProgress} in progress</span>
              <span><span style={{ color: 'var(--yellow)' }}>●</span> {s.review} in review</span>
              <span><span style={{ color: 'var(--green)' }}>●</span> {s.done} done</span>
              {s.overdue > 0 && <span><span style={{ color: 'var(--red)' }}>●</span> {s.overdue} overdue</span>}
            </div>
          </div>
        )}

        {/* Recent tasks */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', fontSize: '1rem' }}>Recent Activity</h3>
          {recentTasks?.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No tasks yet. Create your first project!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentTasks?.map(task => (
                <div
                  key={task._id}
                  onClick={() => navigate('/tasks')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem',
                    borderRadius: 'var(--radius)', background: 'var(--bg-3)', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-3)'}
                >
                  <div style={{ width: 4, height: 32, borderRadius: 99, background: priorityColor[task.priority] || 'var(--border)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.project?.name}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: statusColor[task.status], fontWeight: 600 }}>{task.status}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
