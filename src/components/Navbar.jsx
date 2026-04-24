import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset indicator on route change
  useEffect(() => {
    setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
  }, [location.pathname]);

  const handleMouseEnter = (e) => {
    const el = e.currentTarget;
    const parent = navRef.current;
    if (el && parent) {
      const elRect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      setIndicatorStyle({
        left: elRect.left - parentRect.left,
        width: elRect.width,
        opacity: 1
      });
    }
  };

  const handleMouseLeave = () => {
    setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Dedicated glass layer — isolated from all parent stacking contexts */}
        <span className="navbar-glass" aria-hidden="true" />
        <Link to="/" className="logo">
          <img src={logo} alt="ARICT Logo" className="logo-img" />
        </Link>
        <ul className="nav-links" ref={navRef} onMouseLeave={handleMouseLeave}>
          <div className="nav-indicator" style={indicatorStyle}></div>
          <li onMouseEnter={handleMouseEnter}><Link to="/">Home</Link></li>
          <li onMouseEnter={handleMouseEnter}><Link to="/about">About</Link></li>
          <li onMouseEnter={handleMouseEnter}><Link to="/events">Events</Link></li>
          <li onMouseEnter={handleMouseEnter}><Link to="/gallery">Gallery</Link></li>
          <li onMouseEnter={handleMouseEnter}><Link to="/contact">Contact</Link></li>
        </ul>
        <Link to="/contact" className="btn btn-primary">Get a quote</Link>
      </div>
    </nav>
  );
};

export default Navbar;
