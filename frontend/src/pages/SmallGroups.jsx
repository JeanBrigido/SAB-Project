import React from 'react';
import '../styles/SmallGroups.css';

const SmallGroups = () => {
  const groups = [
    {
      id: 1,
      category: "Young Adults",
      name: "Young Adults",
      leader: "Led by Sarah Johnson",
      description: "For adults in their 20s and 30s looking to grow in faith together. We focus on relevant topics and building community.",
      day: "Tuesdays",
      time: "7:00 PM - 9:00 PM",
      location: "Church Fellowship Hall",
      members: "12 / 20 members"
    },
    {
      id: 2,
      category: "Family",
      name: "Family Life",
      leader: "Led by Mark & Lisa Wilson",
      description: "For parents and families navigating life's challenges together. Childcare is provided.",
      day: "Wednesdays",
      time: "6:30 PM - 8:00 PM",
      location: "Wilson's Home",
      members: "8 / 10 members"
    },
    {
      id: 3,
      category: "Seniors",
      name: "Senior Fellowship",
      leader: "Led by Robert Thompson",
      description: "For seniors to connect, share life experiences, and study together.",
      day: "Thursdays",
      time: "10:00 AM - 11:30 AM",
      location: "Room 201",
      members: "15 / 20 members"
    },
    {
      id: 4,
      category: "Men",
      name: "Men's Group",
      leader: "Led by James Anderson",
      description: "A space for men to grow in faith and build strong relationships.",
      day: "Saturdays",
      time: "8:00 AM - 9:30 AM",
      location: "Church Library",
      members: "10 / 15 members"
    },
    {
      id: 5,
      category: "Women",
      name: "Women's Bible Study",
      leader: "Led by Jennifer Martinez",
      description: "Women gathering to study God's word and support one another.",
      day: "Thursdays",
      time: "7:00 PM - 8:30 PM",
      location: "Fellowship Hall",
      members: "18 / 25 members"
    },
    {
      id: 6,
      category: "College",
      name: "College Students",
      leader: "Led by Michael Lee",
      description: "A community for college students to grow in faith and find support.",
      day: "Fridays",
      time: "6:00 PM - 7:30 PM",
      location: "Student Center",
      members: "20 / 30 members"
    }
  ];

  return (
    <div className="groups-container">
      <h1 className="groups-title">Small Groups</h1>
      <p className="groups-subtitle">Join a group to connect, grow, and share life together.</p>

      <div className="groups-grid">
        {groups.map((group) => (
          <div key={group.id} className="group-card">
            <div className="group-category">{group.category}</div>
            <h2 className="group-name">{group.name}</h2>
            <p className="group-leader">{group.leader}</p>
            <p className="group-description">{group.description}</p>
            
            <div className="group-details">
              <div className="detail-item">
                <span className="calendar-icon">📅</span>
                {group.day}
              </div>
              <div className="detail-item">
                <span className="time-icon">⏰</span>
                {group.time}
              </div>
              <div className="detail-item">
                <span className="location-icon">📍</span>
                {group.location}
              </div>
              <div className="detail-item">
                <span className="members-icon">👥</span>
                {group.members}
              </div>
            </div>

            <button className="request-join-btn">Request to Join</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmallGroups;