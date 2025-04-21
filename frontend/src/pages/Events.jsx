import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/events');
        setEvents(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;


  return (
    <div className="events-container">
      <h1 className="events-title">Upcoming Events</h1>
      <p className="events-subtitle">
        Join us for these upcoming events and activities at Senda-A-Betel Church.
      </p>

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
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
            <button className="add-calendar-btn">
              Sign Up
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;