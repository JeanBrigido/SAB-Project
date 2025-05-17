import React, { useState, useEffect } from "react";
import api from "../config/axios";
import { useAuth } from "../contexts/AuthContext"; // Updated import
import { Link } from "react-router-dom";
import '../styles/SmallGroups.css';
import '../styles/Events.css';

const SmallGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user, churchMember } = useAuth();
  
  const isAdmin = churchMember?.roles?.name === 'admin';

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get('/small-groups');
      setGroups(response.data);
    } catch (err) {
      setError('Failed to load groups');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCreation = async (groupData) => {
    try {
      setLoading(true);
      await api.post('/small-groups', groupData);
      await loadGroups();
      setShowForm(false);
    } catch (err) {
      setError('Failed to create group');
      console.error('Creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupUpdate = async (groupData) => {
    try {
      setLoading(true);
      await api.put(`/small-groups/${groupData.id}`, groupData);
      await loadGroups();
      setEditingGroup(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to update group');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupId) => {
    if (!isAdmin || !window.confirm('Are you sure you want to delete this group?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/small-groups/${groupId}`);
      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      setError(null);
    } catch (err) {
      setError('Failed to delete group');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGroup(null);
    setError(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Small Groups</h1>
        <p className="subtitle">Connect with others in our community through our small groups.</p>
      </div>

      <div className="groups-container">
        <div className="button-container">
          {isAdmin && (
            <button 
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              Add New Group
            </button>
          )}
        </div>

        {showForm && (
          <SmallGroupForm 
            onSuccess={editingGroup ? handleGroupUpdate : handleGroupCreation}
            onError={setError}
            editingGroup={editingGroup}
            onCancel={handleCancel}
          />
        )}

        {loading && <p>Loading groups...</p>}
        {error && <p className="error-message">{error}</p>}
        
        <div className="groups-grid">
          {groups.map(group => (
            <div key={group.id} className="group-card">
              <h3>{group.name}</h3>
              <p className="group-description">{group.bio}</p>
              <div className="group-details">
                <p><span className="detail-label">Meeting Days:</span> {group.meeting_days}</p>
                <p><span className="detail-label">Time:</span> {group.meeting_time_range}</p>
                <p><span className="detail-label">Location:</span> {group.location}</p>
              </div>
              {isAdmin && (
                <div className="group-actions">
                  <button 
                    className="edit-button"
                    onClick={() => {
                      setEditingGroup(group);
                      setShowForm(true);
                    }}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(group.id)}
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmallGroups;