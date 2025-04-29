import React from 'react';
import Hero from '../components/Hero';
import VerseOfTheDay from '../components/VerseOfTheDay';
import EmotionChat from '../components/EmotionChat';

const Home = () => {
  return (
    <div>
      <VerseOfTheDay />
      <Hero />
      <EmotionChat />
    </div>
  );
};

export default Home;