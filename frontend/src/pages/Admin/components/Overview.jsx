import React, { useState, useEffect } from 'react';
import { FaUsers, FaCalendarAlt, FaPrayingHands, FaUserFriends } from 'react-icons/fa';
import api from '../../../config/axios';

const Overview = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeEvents: 0,
    smallGroups: 0,
    prayerRequests: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [members, events, groups, prayers] = await Promise.all([
          api.get('/members/count'),
          api.get('/events/active/count'),
          api.get('/small-groups/count'),
          api.get('/prayer-requests/count')
        ]);

        setStats({
          totalMembers: members.data.count,
          activeEvents: events.data.count,
          smallGroups: groups.data.count,
          prayerRequests: prayers.data.count,
          loading: false,
          error: null
        });
      } catch (err) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load statistics'
        }));
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: FaUsers,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      icon: FaCalendarAlt,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Small Groups',
      value: stats.smallGroups,
      icon: FaUserFriends,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Prayer Requests',
      value: stats.prayerRequests,
      icon: FaPrayingHands,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  if (stats.loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (stats.error) {
    return <div className="error-message">{stats.error}</div>;
  }

  return (
    <div className="overview-container">
      <h1 className="section-title">Dashboard Overview</h1>
      
      <div className="stats-grid">
        {statCards.map((stat) => (
          <div key={stat.title} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              <stat.icon />
            </div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p className="value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {/* We'll add recent activity list in the next implementation */}
      </div>
    </div>
  );
};

export default Overview;