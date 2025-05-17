import React, { useState, useEffect } from "react";
import api from "../config/axios";
import { useAuth } from "../contexts/AuthContext"; // Updated import
import { Link } from "react-router-dom";
import '../styles/Events.css';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { config } from '../config/config';
import EventForm from '../components/EventForm';

const BASE_URL = `${config.apiUrl}/events`;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user, churchMember } = useAuth();
  
  const isAdmin = churchMember?.roles?.name === 'admin';

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load events');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreation = async (eventData) => {
    try {
      setLoading(true);
      await api.post('/events', eventData);
      await loadEvents();
      setShowForm(false);
    } catch (err) {
      setError('Failed to create event');
      console.error('Creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventUpdate = async (eventData) => {
    try {
      setLoading(true);
      await api.put(`/events/${eventData.id}`, eventData);
      await loadEvents();
      setEditingEvent(null);
      setShowForm(false);
    } catch (err) {
      setError('Failed to update event');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!isAdmin || !window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/events/${eventId}`);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (err) {
      setError('Failed to delete event');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    setError(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Events</h1>
        <p className="subtitle">Join us for our upcoming events and activities.</p>
      </div>

      <div className="events-container">
        <div className="button-container">
          {isAdmin && (
            <button 
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              Add New Event
            </button>
          )}
        </div>

        {showForm && (
          <EventForm 
            onSuccess={editingEvent ? handleEventUpdate : handleEventCreation}
            onError={setError}
            editingEvent={editingEvent}
            onCancel={handleCancel}
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
                <p>
                  <FaCalendar className="icon" /> {event.event_date}
                </p>
                <p>
                  <FaClock className="icon" /> {event.event_time}
                </p>
                <p>
                  <FaMapMarkerAlt className="icon" /> {event.location}
                </p>
              </div>
              {isAdmin && (
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
    </div>
  );
};

export default Events;