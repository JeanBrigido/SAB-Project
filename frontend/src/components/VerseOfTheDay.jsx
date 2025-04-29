import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
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
      const response = await fetch(`${API_URL}/api/verse/daily`, {  // Updated endpoint
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setVerse(data);
    } catch (err) {
      console.error('Fetch error:', err);
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