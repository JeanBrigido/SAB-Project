import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCalendarPlus } from 'react-icons/fa';
import api from '../../../../config/axios';
import EventForm from '../../../../components/EventForm';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load events');
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${eventId}`);
      await loadEvents();
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  const handleFormSuccess = () => {
    loadEvents();
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleFormError = (errorMessage) => {
    setError(errorMessage);
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="events-manager">
      <div className="action-bar">
        <h2>Events Management</h2>
        <button 
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          <FaCalendarPlus /> Add New Event
        </button>
      </div>

      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.event_name}</h3>
            <p>{event.description}</p>
            <div className="event-details">
              <span>Date: {event.event_date}</span>
              <span>Time: {event.event_time}</span>
              <span>Location: {event.location}</span>
            </div>
            <div className="card-actions">
              <button 
                className="edit-button"
                onClick={() => {
                  setEditingEvent(event);
                  setShowForm(true);
                }}
              >
                <FaEdit /> Edit
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDelete(event.id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal">
          <EventForm 
            editingEvent={editingEvent}
            onSuccess={handleFormSuccess}
            onError={handleFormError}
            onCancel={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EventsManager;