import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from "@asgardeo/auth-react";
import '../styles/Navbar.css';

const Navbar = () => {
  const { state, signOut } = useAuthContext();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>Betel Church</span>
        </Link>
        <div className="nav-menu">
          <Link to="/events" className="nav-link">Events</Link>
          <Link to="/small-groups" className="nav-link">Small Groups</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          {state.isAuthenticated && (
            <Link to="/events/manage" className="nav-link">Event Management</Link>
          )}
        </div>
        
        <div className="nav-auth">
          {state.isAuthenticated ? (
            <button
              onClick={() => signOut()}
              className="logout-btn"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;