import React, { useState } from 'react';
import { User, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const { data } = await api.put('/auth/update-profile', profile);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoadingProfile(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirm) return toast.error('Passwords do not match');
    if (password.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoadingPass(true);
    try {
      await api.put('/auth/change-password', { currentPassword: password.currentPassword, newPassword: password.newPassword });
      toast.success('Password changed');
      setPassword({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoadingPass(false); }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account</p>
        </div>
      </div>

      <div className="page-content" style={{ maxWidth: 580 }}>
        {/* Profile */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <User size={18} color="var(--accent)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Profile</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              <span className={`badge role-${user?.role}`} style={{ marginTop: 4 }}>{user?.role}</span>
            </div>
          </div>

          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={loadingProfile}>
              {loadingProfile ? <span className="spinner" /> : <><Save size={14} /> Save Profile</>}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <Lock size={18} color="var(--accent)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Change Password</h3>
          </div>

          <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" value={password.currentPassword} onChange={e => setPassword({ ...password, currentPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" value={password.newPassword} onChange={e => setPassword({ ...password, newPassword: e.target.value })} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" value={password.confirm} onChange={e => setPassword({ ...password, confirm: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={loadingPass}>
              {loadingPass ? <span className="spinner" /> : <><Save size={14} /> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
