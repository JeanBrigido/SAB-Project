import React, { useState } from 'react';
import api from '../../../config/axios';
import { FaCog, FaDatabase, FaUserLock, FaEnvelope } from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    churchName: 'New Beginnings Church',
    emailNotifications: true,
    backupFrequency: 'weekly',
    requireApproval: true
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      await api.put('/settings', settings);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update settings');
      console.error('Settings update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="section-title">Settings</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Settings updated successfully!</div>}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <div className="settings-header">
            <FaCog className="settings-icon" />
            <h2>General Settings</h2>
          </div>
          <div className="form-group">
            <label htmlFor="churchName">Church Name</label>
            <input
              type="text"
              id="churchName"
              name="churchName"
              value={settings.churchName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-header">
            <FaEnvelope className="settings-icon" />
            <h2>Notification Settings</h2>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
              Enable Email Notifications
            </label>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-header">
            <FaDatabase className="settings-icon" />
            <h2>Backup Settings</h2>
          </div>
          <div className="form-group">
            <label htmlFor="backupFrequency">Backup Frequency</label>
            <select
              id="backupFrequency"
              name="backupFrequency"
              value={settings.backupFrequency}
              onChange={handleChange}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-header">
            <FaUserLock className="settings-icon" />
            <h2>Permission Settings</h2>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="requireApproval"
                checked={settings.requireApproval}
                onChange={handleChange}
              />
              Require Admin Approval for New Members
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;