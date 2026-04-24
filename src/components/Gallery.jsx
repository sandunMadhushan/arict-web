import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import './Gallery.css';

const slides = [
  { id: 1, title: 'Tech Symposium 2023', subtitle: 'Main Event Overview', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Hackathon 2024', subtitle: '24-Hour Coding Challenge', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Workshop Session', subtitle: 'Hands-on Learning', image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Award Ceremony', subtitle: 'Celebrating Success', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80' },
  { id: 5, title: 'Networking Night', subtitle: 'Connecting Minds', image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80" },
  { id: 6, title: 'Coding Bootcamp', subtitle: 'Level Up Your Skills', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80' },
  { id: 7, title: 'AI Conference', subtitle: 'Future of Tech', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80' },
  { id: 8, title: 'Robotics Expo', subtitle: 'Innovation at Scale', image: 'https://images.unsplash.com/photo-1485811661309-ab85183a729c?auto=format&fit=crop&w=800&q=80' },
  { id: 9, title: 'Cyber Security Talk', subtitle: 'Defending the Web', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80' }
];

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Handle Resize for responsive dimensions
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      
      // Calculate how far we've scrolled into the section
      const scrollProgress = -rect.top / window.innerHeight;
      
      // If we are within the section bounds, update the active slide
      if (scrollProgress >= -0.5 && scrollProgress <= slides.length) {
        let newIndex = Math.round(scrollProgress);
        if (newIndex >= slides.length) newIndex = slides.length - 1;
        if (newIndex < 0) newIndex = 0;
        
        if (activeIndex !== newIndex) {
          setActiveIndex(newIndex);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  return (
    <section 
      id="gallery" 
      className="gallery-section bg-black-light" 
      ref={sectionRef}
      style={{ height: `${slides.length * 100}vh` }}
    >
      <div className="gallery-sticky-container">
        
        {/* Dynamic Backgrounds */}
        <div className="gallery-backgrounds">
          {slides.map((slide, index) => (
            <div 
              key={`bg-${slide.id}`} 
              className={`g-bg-image ${index === activeIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
          ))}
          <div className="g-bg-overlay"></div>
        </div>

        {/* Details - Left Corner */}
        <div className="gallery-details">
          <div className="g-icon">■</div>
          <div className="gd-text">
            <h2>{slides[activeIndex].title}</h2>
            <p>{slides[activeIndex].subtitle}</p>
          </div>
        </div>

        {/* Slider Container */}
        <div className="gallery-carousel">
          <div className="gallery-track">
            {slides.map((slide, index) => {
              const offset = index - activeIndex;
              
              // Calculate class names
              let className = "g-slide";
              if (offset === 0) className += " active";
              else className += " inactive";

              // Dynamic sizing logic
              const isMobile = windowWidth < 768;
              const activeWidth = isMobile ? windowWidth * 0.85 : 750;
              const inactiveWidth = isMobile ? windowWidth * 0.5 : 280;
              const slideHeight = isMobile ? 350 : 500;
              const inactiveSlideHeight = isMobile ? 280 : 380;
              const gap = isMobile ? -30 : -80; // Negative gap for overlapping

              // Calculate exact pixel position
              let translateX = 0;
              if (offset > 0) {
                translateX = (activeWidth / 2) + (inactiveWidth / 2) + gap + (offset - 1) * (inactiveWidth + gap);
              } else if (offset < 0) {
                translateX = -((activeWidth / 2) + (inactiveWidth / 2) + gap + (Math.abs(offset) - 1) * (inactiveWidth + gap));
              }

              const zIndex = slides.length - Math.abs(offset);
              const opacity = Math.abs(offset) > 2 ? 0 : 1;
              const currentWidth = offset === 0 ? activeWidth : inactiveWidth;
              const currentHeight = offset === 0 ? slideHeight : inactiveSlideHeight;

              return (
                <div 
                  key={slide.id} 
                  className={className} 
                  onClick={() => setActiveIndex(index)}
                  style={{
                    transform: `translateX(${translateX}px)`,
                    width: `${currentWidth}px`,
                    height: `${currentHeight}px`,
                    zIndex: zIndex,
                    opacity: opacity,
                    pointerEvents: opacity === 0 ? 'none' : 'auto'
                  }}
                >
                  <img src={slide.image} alt={slide.title} className="g-slide-img" />
                </div>
              );
            })}
          </div>
        </div>



      </div>
    </section>
  );
};

export default Gallery;
