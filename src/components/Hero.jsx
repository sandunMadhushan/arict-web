import React from 'react';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1>
            Learn. <br />
            Build. <br />
            Lead. <br />
            <span className="text-primary">With ARICT</span>
          </h1>
          <p className="hero-description">
            Building a strong ICT community by connecting students with skills, projects, and opportunities.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary">
              Start a Project <ArrowRight size={20} />
            </button>
            <button className="btn btn-outline">
              <Play size={20} /> Watch Video
            </button>
          </div>

          {/* <div className="hero-stats">
            <div className="stat-item">
              <CheckCircle size={24} className="text-primary" />
              <div>
                <h4>Creative Solutions</h4>
                <p>Produced</p>
              </div>
            </div>
            <div className="stat-item">
              <CheckCircle size={24} className="text-primary" />
              <div>
                <h4>Overall Success</h4>
                <p>Guaranteed</p>
              </div>
            </div>
          </div> */}
        </div>

        <div className="hero-visual">
          <div className="visual-circle"></div>
          <div className="floating-card top-left">
            <h3>40+</h3>
            <p>Project Done</p>
          </div>
          <div className="floating-card bottom-right">
            <h3>24/7</h3>
            <p>Available Support</p>
          </div>
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team working" className="hero-image" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
