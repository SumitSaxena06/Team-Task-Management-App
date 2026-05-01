import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.brandIcon}><Zap size={20} color="#fff" fill="#fff" /></div>
          <h1 style={styles.title}>Create your account</h1>
          <p style={styles.sub}>Start managing projects with your team</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={styles.inputWrap}>
              <User size={15} color="var(--text-dim)" style={styles.icon} />
              <input type="text" placeholder="John Doe" required style={{ paddingLeft: '2.5rem' }} {...field('name')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={styles.inputWrap}>
              <Mail size={15} color="var(--text-dim)" style={styles.icon} />
              <input type="email" placeholder="you@example.com" required style={{ paddingLeft: '2.5rem' }} {...field('email')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={styles.inputWrap}>
              <Lock size={15} color="var(--text-dim)" style={styles.icon} />
              <input type="password" placeholder="Min 6 characters" required minLength={6} style={{ paddingLeft: '2.5rem' }} {...field('password')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <div style={styles.inputWrap}>
              <Shield size={15} color="var(--text-dim)" style={styles.icon} />
              <select style={{ paddingLeft: '2.5rem' }} {...field('role')}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem' },
  container: { width: '100%', maxWidth: 420 },
  header: { textAlign: 'center', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' },
  brandIcon: { width: 48, height: 48, background: 'var(--accent)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: '1.6rem', fontFamily: 'var(--font-display)' },
  sub: { color: 'var(--text-muted)', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' },
  inputWrap: { position: 'relative' },
  icon: { position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  switchText: { textAlign: 'center', color: 'var(--text-muted)', marginTop: '1.5rem', fontSize: '0.875rem' },
};
