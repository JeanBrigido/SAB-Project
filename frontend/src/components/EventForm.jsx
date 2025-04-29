import React, { useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { createEvent } from '../services/eventService';
import '../styles/EventForm.css';

const EventForm = ({ onSuccess, onError }) => {
  const [newEvent, setNewEvent] = useState({
    event_name: '',
    description: '',
    event_date: '',
    event_time: '',
    location: ''
  });
  const [error, setError] = useState(null);
  const { state, getAccessToken } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!state.isAuthenticated) {
        setError('Please log in to create events');
        return;
      }

      // Validate form data
      const trimmedEvent = {
        event_name: newEvent.event_name.trim(),
        description: newEvent.description.trim(),
        event_date: newEvent.event_date,
        event_time: newEvent.event_time,
        location: newEvent.location.trim()
      };

      // Check required fields
      if (!trimmedEvent.event_name || !trimmedEvent.description || 
          !trimmedEvent.event_date || !trimmedEvent.event_time || 
          !trimmedEvent.location) {
        setError('All fields are required');
        return;
      }

      const token = await getAccessToken();
      const createdEvent = await createEvent(trimmedEvent, token);
      
      // Reset form
      setNewEvent({
        event_name: '',
        description: '',
        event_date: '',
        event_time: '',
        location: ''
      });

      // Pass the created event back to parent
      onSuccess?.(createdEvent);
    } catch (error) {
      setError(error.message);
      onError?.(error.message);
    }
  };

  return (
    <div className="event-form-container">
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
Create Event
        </button>
        <button 
          type="button" 
          className="cancel-button"
          onClick={() => onSuccess()} // This will close the form
        >
          Cancel
</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;