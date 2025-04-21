import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Senda-A-Betel Church
      </Link>

      <div className="nav-links">
        <Link to="/events" className="nav-link">
          Events
        </Link>
        <Link to="/small-groups" className="nav-link">
          Small Groups
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>
      </div>

      <Link to="/login" className="login-link">
        Login
      </Link>
    </nav>
  );
};

export default Navbar;