import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from "@asgardeo/auth-react";
import '../styles/SmallGroups.css';
import '../styles/Events.css'; // Reuse the shared styles
import { FaCalendar, FaClock, FaMapMarkerAlt, FaChevronLeft, FaUserPlus } from 'react-icons/fa';

const BASE_URL = "https://sab-cbaudvgcfab6g4gh.centralus-01.azurewebsites.net/small-groups";

const SmallGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    meeting_time: '',
    location: '',
    bio: '',
    meeting_days: '',
    meeting_time_range: ''
  });
  const [editingGroup, setEditingGroup] = useState(null);

  const { state } = useAuthContext();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setGroups(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.isAuthenticated) {
      setError('Please login to create small groups');
      return;
    }
    try {
      await axios.post(BASE_URL, newGroup);
      setNewGroup({
        name: '',
        description: '',
        meeting_time: '',
        location: '',
        bio: '',
        meeting_days: '',
        meeting_time_range: ''
      });
      setShowForm(false);
      fetchGroups();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!state.isAuthenticated) {
      setError('Please login to update small groups');
      return;
    }
    try {
      await axios.put(`${BASE_URL}/${editingGroup.id}`, editingGroup);
      setEditingGroup(null);
      fetchGroups();
    } catch (err) {
      console.error('Error updating group:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!state.isAuthenticated) {
      setError('Please login to delete small groups');
      return;
    }
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        fetchGroups();
      } catch (err) {
        console.error('Error deleting group:', err);
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Small Groups</h1>
        <p className="subtitle">Join a group to connect and grow in faith together.</p>
      </div>

      {/* Only show Add Group button for authenticated users */}
      <div className="small-groups-container">
        <div className="button-container">
          {state.isAuthenticated && (
            <button 
            className="primary-button"
            onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Group'}
        </button>
      )}
      </div>

      {showForm && (
        <div className="add-group-form">
          <h2>Add New Small Group</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Group Name:</label>
              <input
                type="text"
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Bio (Short Description):</label>
              <textarea
                value={newGroup.bio}
                onChange={(e) => setNewGroup({...newGroup, bio: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Full Description:</label>
              <textarea
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Meeting Days:</label>
              <input
                type="text"
                value={newGroup.meeting_days}
                onChange={(e) => setNewGroup({...newGroup, meeting_days: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Time Range:</label>
              <input
                type="text"
                value={newGroup.meeting_time_range}
                onChange={(e) => setNewGroup({...newGroup, meeting_time_range: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                value={newGroup.location}
                onChange={(e) => setNewGroup({...newGroup, location: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Create Group</button>
          </form>
        </div>
      )}

      {selectedGroup ? (
        editingGroup ? (
          <div className="add-group-form">
            <h2>Edit Small Group</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Group Name:</label>
                <input
                  type="text"
                  value={editingGroup.name}
                  onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bio (Short Description):</label>
                <textarea
                  value={editingGroup.bio}
                  onChange={(e) => setEditingGroup({...editingGroup, bio: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Description:</label>
                <textarea
                  value={editingGroup.description}
                  onChange={(e) => setEditingGroup({...editingGroup, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Meeting Days:</label>
                <input
                  type="text"
                  value={editingGroup.meeting_days}
                  onChange={(e) => setEditingGroup({...editingGroup, meeting_days: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time Range:</label>
                <input
                  type="text"
                  value={editingGroup.meeting_time_range}
                  onChange={(e) => setEditingGroup({...editingGroup, meeting_time_range: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  value={editingGroup.location}
                  onChange={(e) => setEditingGroup({...editingGroup, location: e.target.value})}
                  required
                />
              </div>
              <div className="button-group">
                <button type="submit" className="update-btn">Save Changes</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setEditingGroup(null);
                    setSelectedGroup(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="group-detail">
            <button 
              className="back-btn"
              onClick={() => setSelectedGroup(null)}
            >
              <FaChevronLeft /> Back to Groups
            </button>
            <h2>{selectedGroup.name}</h2>
            <p className="group-description">{selectedGroup.description}</p>
            <div className="group-info">
              <p><FaCalendar className="info-icon" /> <strong>Meeting Days:</strong> {selectedGroup.meeting_days}</p>
              <p><FaClock className="info-icon" /> <strong>Time:</strong> {selectedGroup.meeting_time_range}</p>
              <p><FaMapMarkerAlt className="info-icon" /> <strong>Location:</strong> {selectedGroup.location}</p>
            </div>
            <button className="join-btn">
              <FaUserPlus className="btn-icon" /> Request to Join
            </button>
          </div>
        )
      ) : (
        <div className="groups-grid">
          {groups.map((group) => (
            <div key={group.id} className="group-card">
              {editingGroup?.id === group.id ? (
                // Edit form
                <form onSubmit={handleUpdate} className="edit-form-inline">
                  <div className="form-group">
                    <label>Group Name:</label>
                    <input
                      type="text"
                      value={editingGroup.name}
                      onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Bio:</label>
                    <textarea
                      value={editingGroup.bio}
                      onChange={(e) => setEditingGroup({...editingGroup, bio: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Meeting Days:</label>
                    <input
                      type="text"
                      value={editingGroup.meeting_days}
                      onChange={(e) => setEditingGroup({...editingGroup, meeting_days: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time Range:</label>
                    <input
                      type="text"
                      value={editingGroup.meeting_time_range}
                      onChange={(e) => setEditingGroup({...editingGroup, meeting_time_range: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location:</label>
                    <input
                      type="text"
                      value={editingGroup.location}
                      onChange={(e) => setEditingGroup({...editingGroup, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className="button-group">
                    <button type="submit" className="primary-button">Save</button>
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => setEditingGroup(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Normal card view
                <>
                  <h3>{group.name}</h3>
                  <p className="group-bio">{group.bio}</p>
                  <div className="group-preview-info">
                    <p><FaCalendar className="info-icon" /> {group.meeting_days}</p>
                    <p><FaClock className="info-icon" /> {group.meeting_time_range}</p>
                    <p><FaMapMarkerAlt className="info-icon" /> {group.location}</p>
                  </div>
                  <div className="button-group">
                    <button 
                      className="view-button"
                      onClick={() => setSelectedGroup(group)}
                    >
                      View Details
                    </button>
                    {state.isAuthenticated && (
                      <>
                        <button 
                          className="edit-button"
                          onClick={() => setEditingGroup(group)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDelete(group.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default SmallGroups;