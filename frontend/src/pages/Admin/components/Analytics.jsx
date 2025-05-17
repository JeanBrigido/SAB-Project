import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../../../config/axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    memberGrowth: [],
    eventAttendance: [],
    groupParticipation: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [memberStats, eventStats, groupStats] = await Promise.all([
        api.get(`/analytics/members?timeframe=${timeframe}`),
        api.get(`/analytics/events?timeframe=${timeframe}`),
        api.get(`/analytics/groups?timeframe=${timeframe}`)
      ]);

      setAnalyticsData({
        memberGrowth: memberStats.data,
        eventAttendance: eventStats.data,
        groupParticipation: groupStats.data
      });
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const memberGrowthData = {
    labels: analyticsData.memberGrowth.map(data => data.date),
    datasets: [{
      label: 'New Members',
      data: analyticsData.memberGrowth.map(data => data.count),
      fill: false,
      borderColor: '#8b5cf6',
      tension: 0.1
    }]
  };

  const eventAttendanceData = {
    labels: analyticsData.eventAttendance.map(data => data.eventName),
    datasets: [{
      label: 'Attendance',
      data: analyticsData.eventAttendance.map(data => data.attendees),
      backgroundColor: '#c4b5fd'
    }]
  };

  const groupParticipationData = {
    labels: analyticsData.groupParticipation.map(data => data.groupName),
    datasets: [{
      data: analyticsData.groupParticipation.map(data => data.members),
      backgroundColor: [
        '#c4b5fd',
        '#a78bfa',
        '#8b5cf6',
        '#7c3aed',
        '#6d28d9'
      ]
    }]
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1 className="section-title">Analytics Dashboard</h1>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="timeframe-select"
        >
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
          <option value="quarter">Past Quarter</option>
          <option value="year">Past Year</option>
        </select>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>Member Growth</h2>
          <Line data={memberGrowthData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' }
            }
          }} />
        </div>

        <div className="chart-container">
          <h2>Event Attendance</h2>
          <Bar data={eventAttendanceData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' }
            }
          }} />
        </div>

        <div className="chart-container">
          <h2>Group Participation</h2>
          <Doughnut data={groupParticipationData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' }
            }
          }} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;