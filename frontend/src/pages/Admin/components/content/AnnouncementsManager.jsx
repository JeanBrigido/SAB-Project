import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaBullhorn } from 'react-icons/fa';
import api from '../../../../config/axios';

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load announcements');
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingAnnouncement) {
        await api.put(`/announcements/${editingAnnouncement.id}`, formData);
      } else {
        await api.post('/announcements', formData);
      }
      await loadAnnouncements();
      setShowForm(false);
      setEditingAnnouncement(null);
    } catch (err) {
      setError('Failed to save announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await api.delete(`/announcements/${id}`);
      await loadAnnouncements();
    } catch (err) {
      setError('Failed to delete announcement');
    }
  };

  if (loading) return <div className="loading">Loading announcements...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="announcements-manager">
      <div className="action-bar">
        <button 
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          <FaBullhorn /> New Announcement
        </button>
      </div>

      <div className="announcements-grid">
        {announcements.map(announcement => (
          <div key={announcement.id} className="announcement-card">
            <div className="announcement-header">
              <h3>{announcement.title}</h3>
              <span className={`status ${announcement.status}`}>
                {announcement.status}
              </span>
            </div>
            <p>{announcement.content}</p>
            <div className="announcement-meta">
              <span>Posted: {new Date(announcement.created_at).toLocaleDateString()}</span>
              {announcement.end_date && (
                <span>Expires: {new Date(announcement.end_date).toLocaleDateString()}</span>
              )}
            </div>
            <div className="card-actions">
              <button 
                className="edit-button"
                onClick={() => {
                  setEditingAnnouncement(announcement);
                  setShowForm(true);
                }}
              >
                <FaEdit /> Edit
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDelete(announcement.id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingAnnouncement ? 'Edit' : 'New'} Announcement</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={editingAnnouncement?.title}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  defaultValue={editingAnnouncement?.content}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  defaultValue={editingAnnouncement?.end_date}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  {editingAnnouncement ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAnnouncement(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManager;