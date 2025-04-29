import React, { useState, useEffect } from 'react';
import '../styles/VerseOfTheDay.css';

const VerseOfTheDay = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVerse();
  }, []);

  const fetchVerse = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/verse-of-the-day');
      if (!response.ok) throw new Error('Failed to fetch verse');
      const data = await response.json();
      setVerse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="verse-loading">Loading...</div>;
  if (error) return <div className="verse-error">Error: {error}</div>;

  return (
    <div className="verse-container">
      <h2>Verse of the Day</h2>
      {verse && (
        <>
          <p className="verse-text">{verse.text}</p>
          <p className="verse-reference">{verse.reference}</p>
        </>
      )}
    </div>
  );
};

export default VerseOfTheDay;