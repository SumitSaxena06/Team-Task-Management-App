import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut, Zap, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
  >
    <Icon size={16} className="nav-icon" />
    {label}
  </NavLink>
);

export default function AppLayout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Zap size={16} color="#fff" fill="#fff" />
          </div>
          <div>
            <div className="brand-name">TaskFlow</div>
            <div className="brand-tag">Project Manager</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-label">Workspace</div>
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/projects" icon={FolderKanban} label="Projects" />
            <NavItem to="/tasks" icon={CheckSquare} label="My Tasks" />
          </div>

          {isAdmin && (
            <div className="nav-section">
              <div className="nav-section-label">Admin</div>
              <NavItem to="/users" icon={Users} label="Users" />
            </div>
          )}

          <div className="nav-section" style={{ marginTop: 'auto' }}>
            <NavItem to="/settings" icon={Settings} label="Settings" />
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill" onClick={handleLogout} title="Logout">
            <div className="user-avatar">{initials}</div>
            <div className="user-pill-info">
              <div className="user-pill-name">{user?.name}</div>
              <div className="user-pill-role">{user?.role}</div>
            </div>
            <LogOut size={14} color="var(--text-dim)" />
          </div>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
