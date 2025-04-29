import React, { useState } from 'react';
import { API_URL } from '../config/api';
import '../styles/EmotionChat.css';

const EmotionChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verse, setVerse] = useState(null);
  const [error, setError] = useState(null);

  const emotions = [
    'Happy', 'Sad', 'Angry', 'Anxious', 'Depressed',
    'Insecure', 'Lonely', 'Grateful', 'Fearful', 'Hopeful'
  ];

  const handleEmotionClick = async (emotion) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/verse-by-emotion?emotion=${emotion}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch verse');
      }
      
      const data = await response.json();
      setVerse(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`emotion-chat ${isOpen ? 'open' : ''}`}>
      <button 
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Close' : 'Find a Verse'}
      </button>
      
      {isOpen && (
        <div className="chat-content">
          <h3>How are you feeling?</h3>
          <div className="emotions-grid">
            {emotions.map((emotion) => (
              <button
                key={emotion}
                className="emotion-btn"
                onClick={() => handleEmotionClick(emotion)}
                disabled={loading}
              >
                {emotion}
              </button>
            ))}
          </div>
          
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">{error}</div>}
          
          {verse && (
            <div className="verse-result">
              <p className="verse-text">{verse.text}</p>
              <p className="verse-reference">{verse.reference}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmotionChat;