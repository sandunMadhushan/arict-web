import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { getDriveEmbedUrl } from '../../utils/gdrive';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '', role: '', photo_url: '', linkedin_url: '', 
    github_url: '', email: '', display_order: '0'
  });
  const [rawImageUrl, setRawImageUrl] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await apiFetch('/members');
      setMembers(data);
    } catch (error) {
      toast.error('Failed to fetch members: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setCurrentMember(member);
      setFormData({
        name: member.name || '',
        role: member.role || '',
        photo_url: member.photo_url || '',
        linkedin_url: member.linkedin_url || '',
        github_url: member.github_url || '',
        email: member.email || '',
        display_order: member.display_order?.toString() || '0'
      });
      setRawImageUrl(member.photo_url || '');
    } else {
      setCurrentMember(null);
      setFormData({
        name: '', role: '', photo_url: '', linkedin_url: '', 
        github_url: '', email: '', display_order: '0'
      });
      setRawImageUrl('');
    }
    setIsModalOpen(true);
  };

  const handleImageUrlChange = (e) => {
    const val = e.target.value;
    setRawImageUrl(val);
    const embedUrl = getDriveEmbedUrl(val);
    if (embedUrl) {
      setFormData({ ...formData, photo_url: embedUrl });
    } else {
      setFormData({ ...formData, photo_url: val });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        display_order: parseInt(formData.display_order, 10) || 0
      };

      if (currentMember) {
        await apiFetch(`/members/${currentMember.id}`, {
          method: 'PUT',
          body: payload
        });
      } else {
        await apiFetch('/members', {
          method: 'POST',
          body: payload
        });
      }
      setIsModalOpen(false);
      toast.success(`Member ${currentMember ? 'updated' : 'added'} successfully`);
      fetchMembers();
    } catch (error) {
      toast.error('Error saving member: ' + error.message);
    }
  };

  const handleDelete = (id) => {
    toast('Are you sure you want to delete this member?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await apiFetch(`/members/${id}`, { method: 'DELETE' });
            toast.success('Member deleted successfully');
            fetchMembers();
          } catch (error) {
            toast.error('Failed to delete member: ' + error.message);
          }
        }
      },
      cancel: { label: 'Cancel' }
    });
  };

  if (loading) return <div>Loading members...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h2>Manage Team Members</h2>
        <button className="admin-btn" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Member
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No members found.</td></tr>
            ) : (
              members.map(member => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                      )}
                      {member.name}
                    </div>
                  </td>
                  <td>{member.role || '-'}</td>
                  <td>{member.display_order}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="action-btn edit" onClick={() => handleOpenModal(member)}><Edit size={18} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(member.id)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="admin-modal" data-lenis-prevent="true">
            <div className="admin-modal-header">
              <h2>{currentMember ? 'Edit Member' : 'Add New Member'}</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Name *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input type="text" placeholder="e.g. President" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Photo URL (Google Drive link)</label>
                  <input 
                    type="url" 
                    value={rawImageUrl} 
                    onChange={handleImageUrlChange} 
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  {formData.photo_url && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={formData.photo_url} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input type="url" value={formData.linkedin_url} onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>GitHub URL</label>
                    <input type="url" value={formData.github_url} onChange={e => setFormData({ ...formData, github_url: e.target.value })} />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Display Order (Lower numbers appear first)</label>
                  <input type="number" required value={formData.display_order} onChange={e => setFormData({ ...formData, display_order: e.target.value })} />
                </div>

                <div className="admin-modal-actions">
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="admin-btn">Save Member</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
