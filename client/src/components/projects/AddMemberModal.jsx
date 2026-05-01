import React, { useState } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AddMemberModal({ project, onClose, onSaved }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedRole, setSelectedRole] = useState('member');

  const search = async (q) => {
    setQuery(q);
    if (q.length < 2) return setResults([]);
    setSearching(true);
    try {
      const { data } = await api.get(`/users/search?q=${q}`);
      setResults(data.users);
    } catch { setResults([]); }
    finally { setSearching(false); }
  };

  const addMember = async (userId) => {
    try {
      await api.post(`/projects/${project._id}/members`, { userId, role: selectedRole });
      toast.success('Member added');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const existingIds = new Set([project.owner?._id, ...project.members.map(m => m.user?._id || m.user)]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Member to {project.name}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input placeholder="Search by name or email..." value={query} onChange={e => search(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
            </div>
            <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} style={{ width: 120 }}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {searching && <div style={{ textAlign: 'center' }}><span className="spinner" /></div>}

          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {results.map(u => {
                const already = existingIds.has(u._id);
                return (
                  <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-3)', borderRadius: 'var(--radius)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {u.name[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                    <span className={`badge role-${u.role}`}>{u.role}</span>
                    {already ? (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Already member</span>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => addMember(u._id)}>
                        <UserPlus size={13} /> Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {query.length >= 2 && !searching && results.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>No users found</p>
          )}

          {/* Current members */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.6rem' }}>CURRENT MEMBERS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[{ user: project.owner, role: 'owner' }, ...project.members].map((m, i) => {
                const u = m.user;
                if (!u) return null;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.825rem' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>
                      {(u.name || u)[0]?.toUpperCase()}
                    </div>
                    <span style={{ flex: 1 }}>{u.name || 'Unknown'}</span>
                    <span className="badge role-member" style={{ fontSize: '0.65rem' }}>{m.role}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
