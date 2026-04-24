import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { getDriveEmbedUrl } from '../../utils/gdrive';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', event_date: '', location: '', 
    image_url: '', registration_link: '', capacity: ''
  });
  const [rawImageUrl, setRawImageUrl] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await apiFetch('/events');
      setEvents(data);
    } catch (error) {
      toast.error('Failed to fetch events: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setCurrentEvent(event);
      setFormData({
        title: event.title || '',
        description: event.description || '',
        event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        image_url: event.image_url || '',
        registration_link: event.registration_link || '',
        capacity: event.capacity || ''
      });
      setRawImageUrl(event.image_url || '');
    } else {
      setCurrentEvent(null);
      setFormData({
        title: '', description: '', event_date: '', location: '', 
        image_url: '', registration_link: '', capacity: ''
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
      setFormData({ ...formData, image_url: embedUrl });
    } else {
      setFormData({ ...formData, image_url: val });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity, 10) : null
      };

      if (currentEvent) {
        await apiFetch(`/events/${currentEvent.id}`, {
          method: 'PUT',
          body: payload
        });
      } else {
        await apiFetch('/events', {
          method: 'POST',
          body: payload
        });
      }
      setIsModalOpen(false);
      toast.success(`Event ${currentEvent ? 'updated' : 'added'} successfully`);
      fetchEvents();
    } catch (error) {
      toast.error('Error saving event: ' + error.message);
    }
  };

  const handleDelete = (id) => {
    toast('Are you sure you want to delete this event?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await apiFetch(`/events/${id}`, { method: 'DELETE' });
            toast.success('Event deleted successfully');
            fetchEvents();
          } catch (error) {
            toast.error('Failed to delete event: ' + error.message);
          }
        }
      },
      cancel: { label: 'Cancel' }
    });
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h2>Manage Events</h2>
        <button className="admin-btn" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Event
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No events found.</td></tr>
            ) : (
              events.map(event => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.event_date ? new Date(event.event_date).toLocaleString() : 'N/A'}</td>
                  <td>{event.location || '-'}</td>
                  <td>{event.capacity || 'Unlimited'}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="action-btn edit" onClick={() => handleOpenModal(event)}><Edit size={18} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(event.id)}><Trash2 size={18} /></button>
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
              <h2>{currentEvent ? 'Edit Event' : 'Add New Event'}</h2>
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
                    <label>Event Date/Time</label>
                    <input type="datetime-local" value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                </div>

                <div className="form-group">
                  <label>Google Drive Image URL (Anyone with link to view)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="url" 
                      placeholder="https://drive.google.com/file/d/..." 
                      value={rawImageUrl} 
                      onChange={handleImageUrlChange} 
                      style={{ flexGrow: 1 }}
                    />
                  </div>
                  {formData.image_url && (
                    <div style={{ marginTop: '10px', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}>Image Preview (Auto-converted for direct embed):</p>
                      <img src={formData.image_url} alt="Preview" style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Registration Link</label>
                    <input type="url" placeholder="https://forms.gle/..." value={formData.registration_link} onChange={e => setFormData({ ...formData, registration_link: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Capacity (Max Guests)</label>
                    <input type="number" placeholder="Leave empty for unlimited" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
                  </div>
                </div>

                <div className="admin-modal-actions">
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="admin-btn">Save Event</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
