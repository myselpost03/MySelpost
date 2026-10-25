import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-txt-1">MySelpost</h3>
          <p className="tagline">“Your Window to the Social World.”</p>
          <p>
            The premier Instagram viewer for seamless profile discovery. 
            Explore trending content, view stories anonymously, and stay 
            updated with the latest social media insights.
          </p>
        </div>

        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>
              <Link to="/story-viewer">Story Viewer</Link>
            </li>
            <li>
              <Link to="/trending-tags">Trending Tags</Link>
            </li>
            <li>
              <Link to="/profile-search">Profile Search</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy & Terms</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Get in Touch</h4>
          <p>Feedback or Support:</p>
          <p><strong>myselpost03@gmail.com</strong></p>
          <p>We are not affiliated with Instagram or Meta.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MySelpost. Fast. Private. Anonymous.</p>
      </div>
    </footer>
  );
};

export default Footer;