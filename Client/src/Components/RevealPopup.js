import React, { useState, useEffect } from 'react';
import '../Styles/RevealPopup.css';

const RevealPopup = ({ post, onClose }) => {
  const [revealed, setRevealed] = useState({
    name: false,
    country: false,
  });

  if (!post) return null;

  const handleReveal = (type) => {
    setRevealed((prev) => ({ ...prev, [type]: true }));
  };

  

  return (
    <div className="reveal-popup-overlay">
      <div className="reveal-popup-container">
        {/* X Close Icon */}
        <span className="reveal-close-icon" onClick={onClose}>
          &times;
        </span>

        <h2 className="reveal-popup-title">🎭 Reveal Identity</h2>

        <button
          className={`reveal-btn ${revealed.name ? 'revealed' : ''}`}
          onClick={() => {
            handleReveal('name');
          }}
        >
          {revealed.name ? post.name : 'Reveal Name'}
        </button>

        <button
          className={`reveal-btn ${revealed.country ? 'revealed' : ''}`}
          onClick={() => {
            handleReveal('country');
          }}
        >
          {revealed.country ? post.country : 'Reveal Country'}
        </button>
      </div>
      
    </div>
  );
};

export default RevealPopup;
