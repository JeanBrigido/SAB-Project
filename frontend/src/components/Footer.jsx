import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Senda A Betel</h3>
          <p>123 Faith Street, Cityville, ST 12345</p>
          <p>(555) 123-4567</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/small-groups">Small Groups</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/sermons">Sermons</Link></li>
            <li><Link to="/devotionals">Devotionals</Link></li>
            <li><Link to="/prayer">Prayer Requests</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect</h3>
          <ul>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Senda A Betel. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;