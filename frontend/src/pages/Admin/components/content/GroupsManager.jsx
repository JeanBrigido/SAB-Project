import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import api from '../../../../config/axios';

const GroupsManager = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await api.get('/small-groups');
      setGroups(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load groups');
      console.error('Group loading error:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;

    try {
      await api.delete(`/small-groups/${groupId}`);
      setGroups(groups.filter(group => group.id !== groupId));
    } catch (err) {
      setError('Failed to delete group');
      console.error('Delete error:', err);
    }
  };

  if (loading) return <div className="loading">Loading groups...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="groups-manager">
      <div className="action-bar">
        <h2>Small Groups Management</h2>
        <button 
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          <FaUserPlus /> Add New Group
        </button>
      </div>

      <div className="groups-grid">
        {groups.map(group => (
          <div key={group.id} className="group-card">
            <h3>{group.name}</h3>
            <p>{group.description}</p>
            <div className="group-details">
              <span>Leader: {group.leader_name}</span>
              <span>Members: {group.members_count}</span>
              <span>Meeting Day: {group.meeting_day}</span>
              <span>Location: {group.location}</span>
            </div>
            <div className="card-actions">
              <button 
                className="edit-button"
                onClick={() => {
                  setEditingGroup(group);
                  setShowForm(true);
                }}
              >
                <FaEdit /> Edit
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDelete(group.id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal">
          {/* Group form component will go here */}
          <button onClick={() => {
            setShowForm(false);
            setEditingGroup(null);
          }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupsManager;