import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import About from './components/About';
import Process from './components/Process';
import Portfolio from './components/Portfolio';
import Awards from './components/Awards';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import Blogs from './components/Blogs';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <About />
        <Process />
        <Portfolio />
        <Awards />
        <Contact />
        <Testimonials />
        <Blogs />
        <FAQ />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;
