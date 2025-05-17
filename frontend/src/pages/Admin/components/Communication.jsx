import React, { useState, useEffect } from 'react';
import api from '../../../config/axios';

const Communication = () => {
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCommunicationData();
  }, []);

  const loadCommunicationData = async () => {
    try {
      const [prayers, contacts] = await Promise.all([
        api.get('/prayer-requests'),
        api.get('/contact-submissions')
      ]);

      setPrayerRequests(prayers.data);
      setContactSubmissions(contacts.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load communication data');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading communication data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="communication-container">
      <h1 className="section-title">Communication Center</h1>
      
      <div className="communication-grid">
        <div className="prayer-requests">
          <h2>Prayer Requests</h2>
          <div className="requests-list">
            {prayerRequests.map(request => (
              <div key={request.id} className="request-card">
                <h3>{request.subject}</h3>
                <p>{request.request}</p>
                <div className="request-meta">
                  <span>From: {request.name}</span>
                  <span>Date: {new Date(request.created_at).toLocaleDateString()}</span>
                </div>
                <div className="request-actions">
                  <button className="mark-prayed">Mark as Prayed</button>
                  <button className="archive">Archive</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-submissions">
          <h2>Contact Form Submissions</h2>
          <div className="submissions-list">
            {contactSubmissions.map(submission => (
              <div key={submission.id} className="submission-card">
                <h3>{submission.subject}</h3>
                <p>{submission.message}</p>
                <div className="submission-meta">
                  <span>From: {submission.name}</span>
                  <span>Email: {submission.email}</span>
                  <span>Date: {new Date(submission.created_at).toLocaleDateString()}</span>
                </div>
                <div className="submission-actions">
                  <button className="mark-responded">Mark as Responded</button>
                  <button className="archive">Archive</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;