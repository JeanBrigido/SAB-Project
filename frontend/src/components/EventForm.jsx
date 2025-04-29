import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { createEvent } from '../services/eventService';
import '../styles/EventForm.css';

const EventForm = ({ onSuccess, onError, editingEvent = null }) => {
  const [error, setError] = useState(null);
  const { state, getAccessToken } = useAuthContext();

  const [newEvent, setNewEvent] = useState({
    event_name: editingEvent?.event_name || '',
    description: editingEvent?.description || '',
    event_date: editingEvent?.event_date || '',
    event_time: editingEvent?.event_time || '',
    location: editingEvent?.location || ''
  });

  useEffect(() => {
    if (editingEvent) {
      setNewEvent({
        event_name: editingEvent.event_name,
        description: editingEvent.description,
        event_date: editingEvent.event_date,
        event_time: editingEvent.event_time,
        location: editingEvent.location
      });
    }
  }, [editingEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!state.isAuthenticated) {
        setError('Please log in to perform this action');
        return;
      }

      const token = await getAccessToken();
      const trimmedEvent = {
        event_name: newEvent.event_name.trim(),
        description: newEvent.description.trim(),
        event_date: newEvent.event_date,
        event_time: newEvent.event_time,
        location: newEvent.location.trim()
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, trimmedEvent, token);
      } else {
        await createEvent(trimmedEvent, token);
      }

      onSuccess?.();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  return (
    <div className="event-form-container">
      <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="event_name">Event Name</label>
          <input
            type="text"
            id="event_name"
            name="event_name"
            value={newEvent.event_name}
            onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="event_date">Date</label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            value={newEvent.event_date}
            onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="event_time">Time</label>
          <input
            type="time"
            id="event_time"
            name="event_time"
            value={newEvent.event_time}
            onChange={(e) => setNewEvent({ ...newEvent, event_time: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
          {editingEvent ? 'Save Changes' : 'Create Event'}
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => onSuccess?.()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;