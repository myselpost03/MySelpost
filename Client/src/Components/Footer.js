import React from 'react';
import {Link} from 'react-router-dom';
import '../Styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>MySelpost</h3>
          <p className="tagline">"Ideas don’t need code. Just a sketch."</p>
          <p>Your place to turn sketches or prompts into real web apps.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Get in Touch</h4>
          <p>Email: support@myselpost.com</p>
          <p>
            Instagram:{' '}
            <Link to="https://instagram.com/myselpost" target="_blank" rel="noreferrer">
              @myselpost
            </Link>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MySelpost. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
