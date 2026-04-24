import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNotice, setCurrentNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '', message: '', type: 'info', expires_at: '', active: true
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const data = await apiFetch('/notices');
      setNotices(data);
    } catch (error) {
      toast.error('Failed to fetch notices: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (notice = null) => {
    if (notice) {
      setCurrentNotice(notice);
      setFormData({
        title: notice.title || '',
        message: notice.message || '',
        type: notice.type || 'info',
        expires_at: notice.expires_at ? new Date(notice.expires_at).toISOString().slice(0, 16) : '',
        active: notice.active
      });
    } else {
      setCurrentNotice(null);
      setFormData({
        title: '', message: '', type: 'info', expires_at: '', active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        expires_at: formData.expires_at || null
      };

      if (currentNotice) {
        await apiFetch(`/notices/${currentNotice.id}`, {
          method: 'PUT',
          body: payload
        });
      } else {
        await apiFetch('/notices', {
          method: 'POST',
          body: payload
        });
      }
      setIsModalOpen(false);
      toast.success(`Notice ${currentNotice ? 'updated' : 'added'} successfully`);
      fetchNotices();
    } catch (error) {
      toast.error('Error saving notice: ' + error.message);
    }
  };

  const handleDelete = (id) => {
    toast('Are you sure you want to delete this notice?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await apiFetch(`/notices/${id}`, { method: 'DELETE' });
            toast.success('Notice deleted successfully');
            fetchNotices();
          } catch (error) {
            toast.error('Failed to delete notice: ' + error.message);
          }
        }
      },
      cancel: { label: 'Cancel' }
    });
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'urgent': return { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444' };
      case 'warning': return { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid #f59e0b' };
      default: return { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid #3b82f6' };
    }
  };

  if (loading) return <div>Loading notices...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h2>Manage Notices</h2>
        <button className="admin-btn" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Notice
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Expires At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No notices found.</td></tr>
            ) : (
              notices.map(notice => {
                const isExpired = notice.expires_at && new Date(notice.expires_at) < new Date();
                return (
                  <tr key={notice.id}>
                    <td>{notice.title}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                        ...getBadgeStyle(notice.type) 
                      }}>
                        {notice.type}
                      </span>
                    </td>
                    <td>
                      {notice.active && !isExpired ? (
                        <span style={{ color: '#10b981' }}>Active</span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>Inactive</span>
                      )}
                    </td>
                    <td>{notice.expires_at ? new Date(notice.expires_at).toLocaleString() : 'Never'}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="action-btn edit" onClick={() => handleOpenModal(notice)}><Edit size={18} /></button>
                        <button className="action-btn delete" onClick={() => handleDelete(notice.id)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="admin-modal" data-lenis-prevent="true">
            <div className="admin-modal-header">
              <h2>{currentNotice ? 'Edit Notice' : 'Add New Notice'}</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label>Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={formData.active} onChange={e => setFormData({ ...formData, active: e.target.value === 'true' })}>
                      <option value="true">Active (Visible)</option>
                      <option value="false">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea required rows="4" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
                </div>

                <div className="form-group">
                  <label>Expires At (Optional)</label>
                  <input type="datetime-local" value={formData.expires_at} onChange={e => setFormData({ ...formData, expires_at: e.target.value })} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Notice will automatically hide after this date.</span>
                </div>

                <div className="admin-modal-actions">
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="admin-btn">Save Notice</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotices;
