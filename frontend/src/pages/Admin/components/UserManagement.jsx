import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../../../config/axios';

const UserManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load members');
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await api.patch(`/members/${memberId}/role`, { role: newRole });
      await loadMembers();
    } catch (err) {
      setError('Failed to update member role');
    }
  };

  const handleStatusChange = async (memberId, isActive) => {
    try {
      await api.patch(`/members/${memberId}/status`, { isActive });
      await loadMembers();
    } catch (err) {
      setError('Failed to update member status');
    }
  };

  if (loading) return <div className="loading">Loading members...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-management">
      <div className="action-bar">
        <h1 className="section-title">Member Management</h1>
        <div className="members-stats">
          <span>Total Members: {members.length}</span>
        </div>
      </div>

      <div className="members-table-container">
        <table className="members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="group_leader">Group Leader</option>
                  </select>
                </td>
                <td>
                  <button
                    className={`status-toggle ${member.is_active ? 'active' : 'inactive'}`}
                    onClick={() => handleStatusChange(member.id, !member.is_active)}
                  >
                    {member.is_active ? <FaCheck /> : <FaTimes />}
                  </button>
                </td>
                <td>{new Date(member.joined_date).toLocaleDateString()}</td>
                <td className="actions">
                  <button 
                    className="edit-button"
                    onClick={() => setEditingMember(member)}
                  >
                    <FaEdit />
                  </button>
                  <button className="delete-button">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;