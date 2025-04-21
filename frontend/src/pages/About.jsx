import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>Welcome to Senda-A-Betel Church</h1>
        <p>A Spirit-filled community sharing God's love since 1985</p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>To spread the full Gospel of Jesus Christ, empowered by the Holy Spirit, 
          and to create a welcoming community where lives are transformed through 
          worship, prayer, and discipleship.</p>
      </section>

      <section className="about-section">
        <h2>What We Believe</h2>
        <ul>
          <li>Salvation through faith in Jesus Christ</li>
          <li>The baptism of the Holy Spirit with the evidence of speaking in tongues</li>
          <li>Divine healing through the power of God</li>
          <li>The importance of water baptism</li>
          <li>The soon return of Jesus Christ</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Service Times</h2>
        <div className="service-times">
          <div className="service-item">
            <h3>Sunday Services</h3>
            <p>10:00 AM - Main Service</p>
            <p>6:00 PM - Evening Service</p>
          </div>
          <div className="service-item">
            <h3>Wednesday</h3>
            <p>7:00 PM - Bible Study & Prayer</p>
          </div>
          <div className="service-item">
            <h3>Friday</h3>
            <p>7:30 PM - Youth Service</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Pastor</h2>
        <div className="pastor-info">
          <div className="pastor-content">
            <h3>Pastor David Rodriguez</h3>
            <p>Pastor David has been leading our congregation since 2010. With his 
              wife Maria, they have created a vibrant, multicultural church family 
              focused on prayer, worship, and community outreach.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Get Involved</h2>
        <div className="ministry-grid">
          <div className="ministry-item">
            <h3>Prayer Ministry</h3>
            <p>Join our intercessory prayer team</p>
          </div>
          <div className="ministry-item">
            <h3>Worship Team</h3>
            <p>Use your musical gifts to glorify God</p>
          </div>
          <div className="ministry-item">
            <h3>Children's Ministry</h3>
            <p>Help nurture the next generation</p>
          </div>
          <div className="ministry-item">
            <h3>Outreach</h3>
            <p>Serve our local community</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;