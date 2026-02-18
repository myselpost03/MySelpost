import React from 'react';
import '../Styles/Tip.css';

const Tip = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="premium-overlay">
      <div className="premium-subscription-card">
        <button className="close-icon-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="card-header">
          {/* 1. Updated Label */}
          <span className="premium-label">Priority Bypass Active ⚡</span>
          <h1>Priority Extraction</h1>
          <p>Bypass the manual queue and initiate high-speed decryption for the target Instagram profile.</p>
        </div>

        <div className="perks-grid">
          {/* 2. Updated Perks for 'Unlock' Context */}
          <div className="perk-item">
            <span className="check">✓</span>
            <span>Bypass Queue Waiting</span>
          </div>
          <div className="perk-item">
            <span className="check">✓</span>
            <span>Instant Media Decryption</span>
          </div>
          <div className="perk-item">
            <span className="check">✓</span>
            <span>View Private Stories</span>
          </div>
        </div>

        <div className="cta-section">
          <div className="price-tag">
            <span className="currency">$</span>
            <span className="val">1</span>
            <span className="freq">/ unlock fee</span>
          </div>
          
          <a 
            href="https://ko-fi.com/myselpost" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="premium-action-button"
          >
            Donate via Ko-fi
          </a>
          
          <p className="footer-note">
            Secure gateway via Ko-fi. Credentials are encrypted and never stored on our nodes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tip;