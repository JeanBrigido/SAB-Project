import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Updated import path
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import UserManagement from './components/UserManagement';
import ContentManagement from './components/ContentManagement';
import Analytics from './components/Analytics';
import Communication from './components/Communication';
import Settings from './components/Settings';
import '../../styles/Admin.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { user, churchMember } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <UserManagement />;
      case 'content':
        return <ContentManagement />;
      case 'analytics':
        return <Analytics />;
      case 'communication':
        return <Communication />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;