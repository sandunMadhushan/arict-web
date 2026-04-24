import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { LayoutDashboard, CalendarDays, Users, FileText, Bell, LogOut } from 'lucide-react';
import './Admin.css';

const AdminLayout = () => {
  const { isAuthenticated, isLoading, logout } = useAdmin();

  if (isLoading) return <div className="admin-login-page">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin" replace />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>ARICT Admin</h2>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/events" className={({ isActive }) => isActive ? 'active' : ''}>
            <CalendarDays size={20} /> Events
          </NavLink>
          <NavLink to="/admin/members" className={({ isActive }) => isActive ? 'active' : ''}>
            <Users size={20} /> Members
          </NavLink>
          <NavLink to="/admin/blogs" className={({ isActive }) => isActive ? 'active' : ''}>
            <FileText size={20} /> Blogs
          </NavLink>
          <NavLink to="/admin/notices" className={({ isActive }) => isActive ? 'active' : ''}>
            <Bell size={20} /> Notices
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={logout} className="admin-logout-btn">
            <LogOut size={16} style={{ display: 'inline', marginRight: '8px' }} /> Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <h1>Content Management System</h1>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
