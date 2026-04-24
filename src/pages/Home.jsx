import React from 'react';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Testimonials from '../components/Testimonials';
import LocationSection from '../components/LocationSection';
import FAQ from '../components/FAQ';

const Home = () => {
  return (
    <div className="page-transition" style={{ overflowX: 'hidden' }}>
      <Hero />
      <Marquee />
      <Testimonials />
      <LocationSection />
      <FAQ />
    </div>
  );
};

export default Home;
