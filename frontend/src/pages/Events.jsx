import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { fetchEvents, createEvent, updateEvent } from '../services/eventService';
import EventForm from '../components/EventForm';
import '../styles/Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false); // Add this line
  const { state } = useAuthContext();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleEventCreation = () => {
    fetchEvents();
    setShowForm(false); // Close form after successful creation
  };

  const handleEventError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = await state.getAccessToken();
      await updateEvent(editingEvent.id, editingEvent, token);
      await fetchEvents();
      setEditingEvent(null);
    } catch (error) {
      setError(error.message);
      console.error('Update error:', error);
    }
  };

  return (
    <div className="events-container">
      {state.isAuthenticated && (
        <button 
          className="add-event-button"
          onClick={() => setShowForm(true)}
        >
          Add Event
        </button>
      )}

      {showForm && (
        <EventForm 
          onSuccess={handleEventCreation}
          onError={handleEventError}
        />
      )}

      {loading && <p>Loading events...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.event_name}</h3>
            <p>{event.description}</p>
            <p>Date: {event.event_date}</p>
            <p>Time: {event.event_time}</p>
            <p>Location: {event.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;