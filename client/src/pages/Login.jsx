import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}><Zap size={24} color="#fff" fill="#fff" /></div>
          <span style={styles.brandName}>TaskFlow</span>
        </div>
        <div style={styles.tagline}>
          <h1 style={styles.headline}>Manage projects.<br />Ship faster.</h1>
          <p style={styles.sub}>Role-based task management built for modern teams.</p>
        </div>
        <div style={styles.features}>
          {['Role-based access control', 'Real-time task tracking', 'Team collaboration', 'Progress dashboards'].map(f => (
            <div key={f} style={styles.feat}><span style={styles.dot} />{f}</div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Sign in</h2>
          <p style={styles.hint}>Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={styles.inputWrap}>
                <Mail size={15} color="var(--text-dim)" style={styles.icon} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={styles.inputWrap}>
                <Lock size={15} color="var(--text-dim)" style={styles.icon} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign in'}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },
  left: {
    flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: '4rem', background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
    gap: '2rem',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  brandIcon: {
    width: 44, height: 44, background: 'var(--accent)', borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  brandName: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' },
  tagline: {},
  headline: { fontSize: '2.5rem', fontFamily: 'var(--font-display)', lineHeight: 1.15, letterSpacing: '-0.03em' },
  sub: { color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '1rem' },
  features: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  feat: { display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' },
  dot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, display: 'block' },
  right: { width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { width: '100%', maxWidth: 400 },
  title: { fontSize: '1.6rem', fontFamily: 'var(--font-display)', marginBottom: '0.4rem' },
  hint: { color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  inputWrap: { position: 'relative' },
  icon: { position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  eyeBtn: {
    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
    background: 'none', color: 'var(--text-dim)', padding: 4,
  },
  switchText: { textAlign: 'center', color: 'var(--text-muted)', marginTop: '1.5rem', fontSize: '0.875rem' },
};
