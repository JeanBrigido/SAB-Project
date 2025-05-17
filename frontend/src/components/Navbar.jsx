import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">SAB Church</Link>
      </div>

      <button className="mobile-menu-button" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`nav-content ${isOpen ? 'show' : ''}`}>
        <div className="nav-links">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/events" onClick={closeMenu}>Events</Link>
          <Link to="/small-groups" onClick={closeMenu}>Small Groups</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
        </div>

        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <span className="welcome-text">Welcome, {user?.name}</span>
              {user?.role === 'admin' && (
                <Link to="/admin" className="admin-link" onClick={closeMenu}>
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-button" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/signup" className="signup-button" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;