import React, { useState } from 'react';
import '../Styles/WelcomePopup.css';

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="welcome-popup-overlay">
      <div className="welcome-popup-content">
        <div className="gradient-sphere-1"></div>
        <div className="gradient-sphere-2"></div>
        
        <button className="welcome-close-btn" onClick={() => setIsOpen(false)}>×</button>
        
        <div className="heart-icon">❤️</div>
        
        <h1 className="welcome-popup-title">Global Hearts</h1>
        <p className="welcome-popup-subtitle">
          Connect with interesting people from around the world. 
          Your journey to finding love transcends borders.
        </p>
        
        <div className="stats-row">
          <div className="stat-item">
            <span style={{fontSize: '1.3rem'}}>50+</span>
            <p>Countries</p>
          </div>
          <div className="stat-item">
            <span style={{fontSize: '1.3rem'}}>24/7</span>
            <p>Live Chat</p>
          </div>
        </div>

        <button className="cta-button" onClick={() => setIsOpen(false)}>
          Start Exploring
        </button>
      </div>
    </div>
  );
};

export default WelcomePopup;