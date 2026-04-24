import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, ExternalLink, MousePointer2 } from 'lucide-react';
import './LocationSection.css';

const LocationSection = () => {
  const [mapInteractive, setMapInteractive] = useState(false);

  // Hide custom cursor while map is interactive (iframe captures mouse events)
  useEffect(() => {
    if (mapInteractive) {
      document.body.classList.add('map-interactive-mode');
    } else {
      document.body.classList.remove('map-interactive-mode');
    }
    return () => document.body.classList.remove('map-interactive-mode');
  }, [mapInteractive]);

  return (
    <section className="location-section section-padding bg-black">
      <div className="container">

        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '60px' }}>
          <p className="section-tag">Where To Find Us</p>
          <h2>Our <span style={{ color: 'var(--color-primary)' }}>Location</span></h2>
        </div>

        <div className="location-grid">

          {/* Map Embed */}
          <div
            className="map-glass-wrapper"
            onMouseLeave={() => setMapInteractive(false)}
          >
            <div className="map-glass-top-line"></div>
            <div className="map-glass-bottom-line"></div>

            {/* Transparent overlay — captures mousemove for custom cursor.
                Click removes it so the map becomes fully interactive. */}
            {!mapInteractive && (
              <div
                className="map-cursor-overlay"
                onClick={() => setMapInteractive(true)}
                title="Click to interact with the map"
              >
                <div className="map-overlay-hint">
                  <MousePointer2 size={16} />
                  Click to interact
                </div>
              </div>
            )}

            <iframe
              className="location-map"
              title="ARICT Location"
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3954.5!2d80.502005!3d8.354217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2slk!4v1714000000000"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Info Cards */}
          <div className="location-info-stack">

            <div className="loc-glass-card">
              <div className="loc-card-blur"></div>
              <div className="loc-card-top-line"></div>
              <div className="loc-icon-wrap">
                <MapPin size={22} />
              </div>
              <div className="loc-card-content">
                <h4>Address</h4>
                <p>Rajarata University of Sri Lanka,<br />Mihintale, Sri Lanka</p>
                <a
                  href="https://maps.app.goo.gl/3i8A2PAoPnbFZqxF6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="loc-link"
                >
                  Get Directions <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="loc-glass-card">
              <div className="loc-card-blur"></div>
              <div className="loc-card-top-line"></div>
              <div className="loc-icon-wrap">
                <Mail size={22} />
              </div>
              <div className="loc-card-content">
                <h4>Email Us</h4>
                <p>arict@rajarata.ac.lk</p>
                <a href="mailto:arict@rajarata.ac.lk" className="loc-link">
                  Send Email <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="loc-glass-card">
              <div className="loc-card-blur"></div>
              <div className="loc-card-top-line"></div>
              <div className="loc-icon-wrap">
                <Phone size={22} />
              </div>
              <div className="loc-card-content">
                <h4>Open Hours</h4>
                <p>Mon – Fri: 9:00 AM – 5:00 PM<br />Weekends: Closed</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
