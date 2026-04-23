import React from 'react';
import AboutComponent from '../components/About';
import Process from '../components/Process';
import Awards from '../components/Awards';

const About = () => {
  return (
    <div className="page-transition pt-150">
      <AboutComponent />
      <Process />
      <Awards />
    </div>
  );
};

export default About;
