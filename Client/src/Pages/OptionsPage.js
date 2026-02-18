import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SketchyHeader from "../Components/SketchyHeader";
import '../Styles/OptionsPage.css';

const OptionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || 'User';

  const handleSelection = (option) => {
    console.log(`User selected: ${option}`);
    // Navigate to the next step, e.g., a results page or verification
    navigate('/results', { state: { username, selection: option } });
  };

  return (
    <div className="container">
      <SketchyHeader title="InstaView" onBack={() => navigate(-1)} />
      <div className="card options-card fade-in">
        <div className="profile-header">
          <div className="avatar-placeholder">{username.charAt(0).toUpperCase()}</div>
          <h2 className="username-display">@{username}</h2>
          <p className="status-badge">Data Ready</p>
        </div>

        <h3 className="selection-title">Select View Mode</h3>
        <p className="selection-subtitle">Choose how you would like to view the processed data:</p>

        <div className="options-grid">
          <button className="option-button premium" onClick={() => handleSelection('Everything')}>
            <div className="premium-tag">RECOMMENDED</div>
            <span className="icon">🌟</span>
            <div className="text-group">
              <span className="main-text">See Everything</span>
              <span className="sub-text">Full profile access (Sponsored)</span>
            </div>
          </button>
         
          <button className="option-button" onClick={() => handleSelection('Photos')}>
            <span className="icon">🖼️</span>
            <div className="text-group">
              <span className="main-text">View Photos Only</span>
              <span className="sub-text">Gallery view of all posts</span>
            </div>
          </button>

          <button className="option-button" onClick={() => handleSelection('Followers')}>
            <span className="icon">👥</span>
            <div className="text-group">
              <span className="main-text">See Followers Only</span>
              <span className="sub-text">Detailed follower analytics</span>
            </div>
          </button>

          <button className="option-button" onClick={() => handleSelection('Videos')}>
            <span className="icon">🎥</span>
            <div className="text-group">
              <span className="main-text">See Videos Only</span>
              <span className="sub-text">Reels and video content</span>
            </div>
          </button>

         
        </div>
      </div>
    </div>
  );
};

export default OptionsPage;