import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-black">
      <div className="container">
        <div className="footer-top">
          <div className="footer-cta">
            <h2>Let's Connect there</h2>
            <Link to="/contact" className="btn btn-primary">
              Hire Agency <ArrowRight size={20} />
            </Link>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col brand-col">
              <Link to="/" className="logo">
                <img src={logo} alt="ARICT Logo" className="logo-img footer-logo-img" />
              </Link>
              <p>A premium digital agency dedicated to elevating your brand through cutting-edge web design.</p>
              <div className="social-links">
                <a href="#">Fb</a>
                <a href="#">Tw</a>
                <a href="#">In</a>
                <a href="#">Be</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/blogs">Blogs</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Events</h4>
              <ul>
                <li><a href="#">Tech Symposium</a></li>
                <li><a href="#">Hackathon</a></li>
                <li><a href="#">Career Seminars</a></li>
                <li><a href="#">Workshops</a></li>
                <li><a href="#">Branding</a></li>
              </ul>
            </div>

            <div className="footer-col newsletter-col">
              <h4>Newsletter</h4>
              <p>Subscribe to our newsletter for latest updates.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Email Address" required />
                <button type="submit" className="btn btn-primary submit-btn">
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Arict Agency. All rights reserved.</p>
          <div className="bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
