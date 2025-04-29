import React from 'react';
import Hero from '../components/Hero';
import VerseOfTheDay from '../components/VerseOfTheDay';

const Home = () => {
  return (
    <div>
      <VerseOfTheDay />
      <Hero />
    </div>
  );
};

export default Home;