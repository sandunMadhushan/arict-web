import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about section-padding bg-black" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container about-container">
        <div className="about-visual">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team meeting" className="about-img main-img" />
          <div className="experience-badge">
            <span className="years">18</span>
            <span className="text">Years<br/>Experience</span>
          </div>
        </div>
        
        <div className="about-content">
          <h2>We're a Digital Agency</h2>
          <p className="about-desc">
            We merge imagination and technology to help brands grow in an age of digital transformation.
          </p>
          
          <ul className="features-list">
            <li>
              <CheckCircle2 className="text-primary" size={24} />
              <span>Clean Modern Design</span>
            </li>
            <li>
              <CheckCircle2 className="text-primary" size={24} />
              <span>Excellent Support 24/7</span>
            </li>
            <li>
              <CheckCircle2 className="text-primary" size={24} />
              <span>Guaranteed Results</span>
            </li>
          </ul>
          
          <div className="about-actions">
            <button className="btn btn-primary">Discover More</button>
            <div className="signature">
              <span className="sig-name">Jerry Mock</span>
              <span className="sig-role">CEO & Founder</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
