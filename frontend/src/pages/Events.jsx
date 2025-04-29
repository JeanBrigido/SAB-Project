import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from "@asgardeo/auth-react";
import '../styles/Events.css';

const BASE_URL = "https://sab-cbaudvgcfab6g4gh.centralus-01.azurewebsites.net/events";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    event_name: '',
    description: '',
    event_date: '',
    event_time: '',
    location: ''
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const { state } = useAuthContext();

  // Simplify to just check authentication
  const canModifyEvents = () => {
    return state.isAuthenticated;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}`);
      setEvents(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.isAuthenticated) {
      setError('Please login to create events');
      return;
    }
    try {
      // Validate all required fields and ensure they're not just whitespace
      const trimmedEvent = {
        event_name: newEvent.event_name.trim(),
        description: newEvent.description.trim(),
        event_date: newEvent.event_date,
        event_time: newEvent.event_time,
        location: newEvent.location.trim()
      };

      if (!trimmedEvent.event_name || !trimmedEvent.description || 
          !trimmedEvent.event_date || !trimmedEvent.event_time || !trimmedEvent.location) {
        setError('All fields are required and cannot be empty');
        return;
      }

      // Log the data being sent
      console.log('Sending event data:', trimmedEvent);
      
      const response = await axios.post(BASE_URL, trimmedEvent, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Server response:', response);

      // Reset form only after successful submission
      setNewEvent({
        event_name: '',
        description: '',
        event_date: '',
        event_time: '',
        location: ''
      });
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        data: err.response?.data,
        status: err.response?.status,
        requestData: newEvent // Log what was actually sent
      });
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!state.isAuthenticated) {
      setError('Please login to update events');
      return;
    }
    try {
      await axios.put(`${BASE_URL}/${editingEvent.id}`, editingEvent);
      setEditingEvent(null);
      fetchEvents(); // Refresh the events list
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!state.isAuthenticated) {
      setError('Please login to delete events');
      return;
    }
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        fetchEvents(); // Refresh the events list
      } catch (err) {
        console.error('Error deleting event:', err);
        setError(err.message);
      }
    }
  };

  const handleChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value
    });
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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="event_name">Event Name:</label>
              <input
                type="text"
                id="event_name"
                name="event_name"
                value={newEvent.event_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={newEvent.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event_date">Date:</label>
              <input
                type="date"
                id="event_date"
                name="event_date"
                value={newEvent.event_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event_time">Time:</label>
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
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={newEvent.location}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">Create Event</button>
          </form>
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