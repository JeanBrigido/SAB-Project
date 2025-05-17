import React from 'react';
import { 
  FaChartBar, 
  FaUsers, 
  FaCalendarAlt, 
  FaChartLine, 
  FaEnvelope, 
  FaCog 
} from 'react-icons/fa';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'content', label: 'Content Management', icon: FaCalendarAlt },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine },
    { id: 'communication', label: 'Communication', icon: FaEnvelope },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2>Admin Dashboard</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon className="nav-icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;