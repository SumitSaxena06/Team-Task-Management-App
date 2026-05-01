import React, { useEffect, useState } from 'react';
import { Plus, FolderKanban, Users, Calendar, MoreVertical, Trash2, Edit3, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import ProjectModal from '../components/projects/ProjectModal';
import AddMemberModal from '../components/projects/AddMemberModal';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [memberModal, setMemberModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const { user, isAdmin } = useAuth();

  const load = () => {
    setLoading(true);
    api.get('/projects').then(({ data }) => setProjects(data.projects)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const close = () => setMenuOpen(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const isOwner = (p) => p.owner?._id === user?._id || isAdmin;

  const statusDot = { planning: 'var(--blue)', active: 'var(--green)', 'on-hold': 'var(--yellow)', completed: 'var(--accent)' };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditProject(null); setShowModal(true); }}>
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="page-content">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><span className="spinner" /></div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <FolderKanban size={48} />
            <h3>No projects yet</h3>
            <p>Create your first project to get started</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Create Project</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {projects.map(p => {
              const pct = p.taskStats?.total > 0 ? Math.round((p.taskStats.done / p.taskStats.total) * 100) : 0;
              return (
                <div key={p._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusDot[p.status] || 'var(--border)', display: 'inline-block' }} />
                        <span className={`badge status-${p.status}`}>{p.status}</span>
                        <span className={`badge priority-${p.priority}`}>{p.priority}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', lineHeight: 1.3 }}>{p.name}</h3>
                      {p.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{p.description}</p>}
                    </div>

                    {isOwner(p) && (
                      <div style={{ position: 'relative' }}>
                        <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === p._id ? null : p._id); }} style={{ padding: 6 }}>
                          <MoreVertical size={16} />
                        </button>
                        {menuOpen === p._id && (
                          <div style={menuStyle} onClick={e => e.stopPropagation()}>
                            <button style={menuItem} onClick={() => { setEditProject(p); setShowModal(true); setMenuOpen(null); }}>
                              <Edit3 size={14} /> Edit
                            </button>
                            <button style={menuItem} onClick={() => { setMemberModal(p); setMenuOpen(null); }}>
                              <UserPlus size={14} /> Add Member
                            </button>
                            <button style={{ ...menuItem, color: 'var(--red)' }} onClick={() => { handleDelete(p._id); setMenuOpen(null); }}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      <span>{p.taskStats?.total || 0} tasks</span>
                      <span style={{ color: 'var(--green)', fontWeight: 600 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--bg-3)', borderRadius: 99 }}>
                      <div style={{ height: '100%', borderRadius: 99, background: 'var(--green)', width: `${pct}%`, transition: 'width 0.4s' }} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>
                        {p.owner?.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.owner?.name}</span>
                      {p.members?.length > 0 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: '0.25rem' }}>
                          <Users size={11} style={{ display: 'inline', marginRight: 3 }} />{p.members.length}
                        </span>
                      )}
                    </div>
                    {p.dueDate && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        <Calendar size={11} style={{ display: 'inline', marginRight: 3 }} />
                        {format(new Date(p.dueDate), 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <ProjectModal
          project={editProject}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); load(); }}
        />
      )}

      {memberModal && (
        <AddMemberModal
          project={memberModal}
          onClose={() => setMemberModal(null)}
          onSaved={() => { setMemberModal(null); load(); }}
        />
      )}
    </AppLayout>
  );
}

const menuStyle = {
  position: 'absolute', right: 0, top: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: '0.4rem', zIndex: 100, minWidth: 160, boxShadow: 'var(--shadow)',
};
const menuItem = {
  display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem 0.75rem',
  background: 'none', color: 'var(--text)', fontSize: '0.85rem', borderRadius: 6, cursor: 'pointer',
  transition: 'background 0.15s',
};
