import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import api from '../../../config/axios';
import { format } from 'date-fns';
import ReportPreview from './ReportPreview';

const Reports = () => {
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reports = [
    {
      id: 'members',
      name: 'Church Members Report',
      description: 'List of all church members with their details',
      formats: ['csv', 'pdf']
    },
    {
      id: 'events',
      name: 'Events Attendance Report',
      description: 'Attendance records for all events',
      formats: ['csv', 'pdf']
    },
    {
      id: 'groups',
      name: 'Small Groups Report',
      description: 'Small groups membership and activity data',
      formats: ['csv', 'pdf']
    }
  ];

  useEffect(() => {
    loadPreviews();
  }, []);

  const loadPreviews = async () => {
    try {
      setLoading(true);
      const [members, events, groups] = await Promise.all([
        api.get('/reports/members/preview'),
        api.get('/reports/events/preview'),
        api.get('/reports/groups/preview')
      ]);

      setPreviews({
        members: members.data,
        events: events.data,
        groups: groups.data
      });
    } catch (err) {
      setError('Failed to load previews');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportId, format) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/reports/${reportId}`, {
        params: { format },
        responseType: 'blob'
      });

      const fileName = `${reportId}-${format}-${format(new Date(), 'yyyy-MM-dd')}.${format}`;
      saveAs(new Blob([response.data]), fileName);

    } catch (err) {
      setError('Failed to download report');
      console.error('Download error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-container">
      <h2 className="section-title">Reports</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <h3>{report.name}</h3>
            <p>{report.description}</p>
            
            {!loading && previews[report.id] && (
              <ReportPreview 
                data={previews[report.id]} 
                type={report.id} 
              />
            )}

            <div className="format-buttons">
              {report.formats.map(format => (
                <button
                  key={format}
                  className={`download-button ${format}`}
                  onClick={() => downloadReport(report.id, format)}
                  disabled={loading}
                >
                  Download {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;