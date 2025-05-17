import React, { useState } from 'react';
import { FaCalendarAlt, FaUsers, FaBullhorn } from 'react-icons/fa';
import EventsManager from './content/EventsManager';
import GroupsManager from './content/GroupsManager';
import AnnouncementsManager from './content/AnnouncementsManager';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('events');

  const tabs = [
    { id: 'events', label: 'Events', icon: FaCalendarAlt },
    { id: 'groups', label: 'Small Groups', icon: FaUsers },
    { id: 'announcements', label: 'Announcements', icon: FaBullhorn }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return <EventsManager />;
      case 'groups':
        return <GroupsManager />;
      case 'announcements':
        return <AnnouncementsManager />;
      default:
        return <EventsManager />;
    }
  };

  return (
    <div className="content-management">
      <h1 className="section-title">Content Management</h1>
      
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="tab-icon" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ContentManagement;