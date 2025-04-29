import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import EventForm from '../components/EventForm';
import '../styles/Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false); // Add this line
  const { state, getAccessToken } = useAuthContext();

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

  const handleEventCreation = async (newEvent) => {
    try {
      setLoading(true);
      // Fetch latest events
      const updatedEvents = await fetchEvents();
      setEvents(updatedEvents);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleEventUpdate = async (updatedEvent) => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      await updateEvent(editingEvent.id, updatedEvent, token);
      const updatedEvents = await fetchEvents();
      setEvents(updatedEvents);
      setEditingEvent(null);
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setLoading(true);
      const token = await getAccessToken();
      await deleteEvent(eventId, token);
      
      // Update local state after successful deletion
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete event');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
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
        onSuccess={editingEvent ? handleEventUpdate : handleEventCreation}
        onError={handleEventError}
        editingEvent={editingEvent}
        />
      )}

      {loading && <p>Loading events...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.event_name}</h3>
            <p className="event-description">{event.description}</p>
            <div className="event-details">
              <p><span className="detail-label">Date:</span> {event.event_date}</p>
              <p><span className="detail-label">Time:</span> {event.event_time}</p>
              <p><span className="detail-label">Location:</span> {event.location}</p>
            </div>
            {state.isAuthenticated && (
              <div className="event-actions">
                <button 
                  className="edit-button"
                  onClick={() => {
                    setEditingEvent(event);
                    setShowForm(true);
                  }}
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(event.id)}
                >
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;