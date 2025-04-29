import React, { useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { validateEvent } from '../utils/validation';
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

  const handleChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setNewEvent({
      event_name: '',
      description: '',
      event_date: '',
      event_time: '',
      location: ''
    });
  };

  const { state, getAccessToken } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Check authentication
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

      // Validate all required fields
      validateEvent(trimmedEvent);

      // Get fresh token and create event
      const token = await getAccessToken();
      await createEvent(trimmedEvent, token);
      
      // Reset form and notify parent
      resetForm();
      onSuccess?.();
    } catch (error) {
      setError(error.message);
      onError?.(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <div className="form-group">
        <label htmlFor="event_name">Event Name *</label>
        <input
          type="text"
          id="event_name"
          name="event_name"
          value={newEvent.event_name}
          onChange={handleChange}
          placeholder="Enter event name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={newEvent.description}
          onChange={handleChange}
          placeholder="Enter event description"
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="event_date">Date *</label>
        <input
          type="date"
          id="event_date"
          name="event_date"
          value={newEvent.event_date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="event_time">Time *</label>
        <input
          type="time"
          id="event_time"
          name="event_time"
          value={newEvent.event_time}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={newEvent.location}
          onChange={handleChange}
          placeholder="Enter event location"
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
  );
};

export default EventForm;