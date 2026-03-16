import React from 'react';
import { useNavigate } from 'react-router-dom';

import myBackgroundImage from '../Assets/bg.png';
import '../Styles/FactProfile.css';

const FactProfile = () => {
  const navigate = useNavigate();
  return (
    <div className="profile-page">
      <img
        src={myBackgroundImage}
        alt="background"
        className="background-image"
      />

      {/* Settings */}
      <div className="settings-card" style={{ position: 'relative' }}>
        <h3>⚙️ Settings</h3>
        <div className="setting-item">ℹ️ About</div>
        <div className="setting-item">📜 Terms of Use</div>
        <div className="setting-item">🔒 Privacy Policy</div>
        <div className="setting-item">📩 Contact Us</div>
      </div>
      <div className="bottom-nav">
        <button className="tab-btn" onClick={() => navigate('/demo')}>
          🏠<span>Home</span>
        </button>
        <button className="tab-btn">
          🔔<span>Notify</span>
        </button>
       {/*<button className="tab-btn">
          🪙<span>Coins</span>
        </button>*/}
        <button className="tab-btn">
          👤<span>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default FactProfile;
