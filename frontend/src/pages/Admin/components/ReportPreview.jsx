import React from 'react';
import { format } from 'date-fns';

const ReportPreview = ({ data, type }) => {
  const renderPreview = () => {
    switch (type) {
      case 'members':
        return (
          <table className="preview-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                  <td>{format(new Date(member.joined_date), 'MM/dd/yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'events':
        return (
          <table className="preview-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Attendees</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((event) => (
                <tr key={event.id}>
                  <td>{event.event_name}</td>
                  <td>{format(new Date(event.event_date), 'MM/dd/yyyy')}</td>
                  <td>{event.attendees_count}</td>
                  <td>{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'groups':
        return (
          <table className="preview-table">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Members</th>
                <th>Leader</th>
                <th>Meeting Day</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((group) => (
                <tr key={group.id}>
                  <td>{group.name}</td>
                  <td>{group.members_count}</td>
                  <td>{group.leader_name}</td>
                  <td>{group.meeting_day}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return <p>No preview available</p>;
    }
  };

  return (
    <div className="report-preview">
      <h4>Preview (First 5 Entries)</h4>
      <div className="preview-container">
        {renderPreview()}
      </div>
    </div>
  );
};

export default ReportPreview;