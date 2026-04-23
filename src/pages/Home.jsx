import React from 'react';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';

const Home = () => {
  return (
    <div className="page-transition">
      <Hero />
      <Marquee />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default Home;
