import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { CalendarDays, Users, FileText, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    members: 0,
    blogs: 0,
    notices: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, members, blogs, notices] = await Promise.all([
          apiFetch('/events').catch(() => []),
          apiFetch('/members').catch(() => []),
          apiFetch('/blogs').catch(() => []),
          apiFetch('/notices').catch(() => [])
        ]);
        
        setStats({
          events: Array.isArray(events) ? events.length : 0,
          members: Array.isArray(members) ? members.length : 0,
          blogs: Array.isArray(blogs) ? blogs.length : 0,
          notices: Array.isArray(notices) ? notices.length : 0
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h2>Dashboard Overview</h2>
      </div>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card-title"><CalendarDays size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Total Events</div>
          <div className="admin-stat-card-value">{stats.events}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card-title"><Users size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Team Members</div>
          <div className="admin-stat-card-value">{stats.members}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card-title"><FileText size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Blog Posts</div>
          <div className="admin-stat-card-value">{stats.blogs}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card-title"><Bell size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Active Notices</div>
          <div className="admin-stat-card-value">{stats.notices}</div>
        </div>
      </div>

      <div className="admin-table-container" style={{ padding: '20px' }}>
        <h3>Welcome to the ARICT CMS</h3>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '10px' }}>
          Use the sidebar to manage events, team members, blog posts, and important notices.
          Changes made here will immediately reflect on the public website.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
