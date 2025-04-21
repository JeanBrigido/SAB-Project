import '../styles/Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <h1 className="hero-title">Welcome to Senda-A-Betel Church</h1>
      <p className="hero-subtitle">
        Join our community and grow in faith together. Explore our events and small groups.
      </p>
      <div className="button-container">
        <button className="primary-button">
          View Events
        </button>
        <button className="primary-button">
          Explore Small Groups
        </button>
      </div>
    </div>
  );
};

export default Hero;