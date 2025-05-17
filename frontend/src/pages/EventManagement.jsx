import React from 'react';

import { Navigate } from 'react-router-dom';
import '../styles/EventManagement.css';

const EventManagement = () => {
  const { state } = useAuthContext();

  // Redirect to login if not authenticated
  if (!state.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="event-management-container">
      <h1>Event Management Dashboard</h1>
      <div className="budibase-embed-container">
        <iframe
          src="https://sabproject.budibase.app/embed/newsab"
          title="Event Management Dashboard"
          width="100%"
          height="800px"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default EventManagement;