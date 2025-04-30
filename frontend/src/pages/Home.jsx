import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../services/eventService';
import axios from 'axios';
import Hero from '../components/Hero';
import VerseOfTheDay from '../components/VerseOfTheDay';
import EmotionChat from '../components/EmotionChat';
import '../styles/Home.css';

const BASE_URL = "https://sab-cbaudvgcfab6g4gh.centralus-01.azurewebsites.net";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, groupsResponse] = await Promise.all([
          fetchEvents(),
          axios.get(`${BASE_URL}/small-groups`)
        ]);
        setEvents(eventsData.slice(0, 3));
        setGroups(groupsResponse.data.slice(0, 3));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="home-container">
      <VerseOfTheDay />
      <Hero />
      
      <section className="preview-section">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <p>Join us for our upcoming events and activities.</p>
        </div>
        
        <div className="preview-grid">
          {events.map(event => (
            <div key={event.id} className="preview-card">
              <h3>{event.event_name}</h3>
              <p className="event-description">{event.description}</p>
              <div className="event-details">
                <p className="date-time">
                  {event.event_date} • {event.event_time}
                </p>
                <p className="location">{event.location}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Link to="/events" className="view-all-button">
          View All Events
        </Link>
      </section>

      <section className="preview-section">
        <div className="section-header">
          <h2>Join a Small Group</h2>
          <p>Connect with others in our community through our small groups.</p>
        </div>
        
        <div className="preview-grid">
          {groups.map(group => (
            <div key={group.id} className="preview-card">
              <h3>{group.name}</h3>
              <p className="group-description">{group.bio}</p>
              <div className="group-details">
                <p className="meeting-time">{group.meeting_days}</p>
                <p className="location">{group.location}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Link to="/small-groups" className="view-all-button">
          View All Small Groups
        </Link>
      </section>

      <EmotionChat />
    </div>
  );
};

export default Home;