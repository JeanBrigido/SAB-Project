import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { fetchEvents, createEvent, updateEvent } from '../services/eventService';
import '../styles/Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const { state } = useAuthContext();

  // Simplify to just check authentication
  const canModifyEvents = () => {
    return state.isAuthenticated;
  };

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
    fetchEvents(); // Refresh events list
  };

  const handleEventError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = await state.getAccessToken();
      await updateEvent(editingEvent.id, editingEvent, token);
      await fetchEvents(); // Refresh the list
      setEditingEvent(null);
    } catch (error) {
      setError(error.message);
      console.error('Update error:', error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      // Implementation coming in next feature
      console.log('Delete event:', eventId);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="events-container">
      <h1 className="events-title">Upcoming Events</h1>
      <p className="events-subtitle">
        Join us for these upcoming events and activities at Senda-A-Betel Church.
      </p>

      {/* Show Add Event button for any authenticated user */}
      {state.isAuthenticated && (
        <button 
          className="add-event-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Event'}
        </button>
      )}

      {showForm && (
        <div className="add-event-form">
          <h2>Add New Event</h2>
          <EventForm 
            onSuccess={handleEventCreation}
            onError={handleEventError}
          />
        </div>
      )}

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            {editingEvent?.id === event.id ? (
              // Only show edit form for authenticated users
              state.isAuthenticated ? (
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Event Name:</label>
                    <input
                      type="text"
                      value={editingEvent.event_name}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        event_name: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      value={editingEvent.description}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        description: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date:</label>
                    <input
                      type="date"
                      value={editingEvent.event_date}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        event_date: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time:</label>
                    <input
                      type="time"
                      value={editingEvent.event_time?.substring(0, 5)}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        event_time: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location:</label>
                    <input
                      type="text"
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        location: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="button-group">
                    <button type="submit" className="update-btn">Save</button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setEditingEvent(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null
            ) : (
              <>
                <h2 className="event-title">{event.event_name}</h2>
                <div className="event-info">
                  <span className="event-icon">•</span>
                  {new Date(event.event_date).toLocaleDateString()}
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-info">
                  <span className="event-icon">•</span>
                  {event.event_time}
                </div>
                <div className="event-info">
                  <span className="event-icon">•</span>
                  {event.location}
                </div>
                <div className="button-group">
                  {state.isAuthenticated && (
                    <>
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingEvent(event)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {/* Always show sign up button */}
                  <button className="add-calendar-btn">
                    Sign Up
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;