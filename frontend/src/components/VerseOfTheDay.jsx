import React, { useState, useEffect } from 'react';
import '../styles/VerseOfTheDay.css';

const EmotionButton = ({ emotion, onClick, isLoading }) => (
  <button 
    className="emotion-btn"
    onClick={() => onClick(emotion)}
    disabled={isLoading}
  >
    {emotion}
  </button>
);

const VerseOfTheDay = () => {
  const [dailyVerse, setDailyVerse] = useState(null);
  const [emotionVerse, setEmotionVerse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const emotions = [
    'Happy', 'Sad', 'Angry', 'Anxious', 'Depressed',
    'Insecure', 'Lonely', 'Grateful', 'Fearful', 'Hopeful'
  ];

  useEffect(() => {
    fetchDailyVerse();
  }, []);

  const fetchDailyVerse = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/verse-of-the-day');
      if (!response.ok) throw new Error('Failed to fetch verse');
      const data = await response.json();
      setDailyVerse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmotionClick = async (emotion) => {
    try {
      setLoading(true);
      setEmotionVerse(null);
      const response = await fetch(`/api/verse-by-emotion?emotion=${emotion}`);
      if (!response.ok) throw new Error('Failed to fetch verse');
      const data = await response.json();
      setEmotionVerse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verse-container">
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          {dailyVerse && (
            <div className="daily-verse">
              <h2>Verse of the Day</h2>
              <p className="verse-text">{dailyVerse.text}</p>
              <p className="verse-reference">{dailyVerse.reference}</p>
            </div>
          )}

          <div className="emotions-section">
            <h3>Find a Verse by Emotion</h3>
            <div className="emotions-grid">
              {emotions.map((emotion) => (
                <EmotionButton
                  key={emotion}
                  emotion={emotion}
                  onClick={handleEmotionClick}
                  isLoading={loading}
                />
              ))}
            </div>

            {emotionVerse && (
              <div className="emotion-verse">
                <p className="verse-text">{emotionVerse.text}</p>
                <p className="verse-reference">{emotionVerse.reference}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VerseOfTheDay;