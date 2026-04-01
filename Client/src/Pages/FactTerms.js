import React from "react";
import { useNavigate } from "react-router-dom";

import "../Styles/FactTerms.css";

const FactTerms = () => {
    
    const navigate = useNavigate();
     
  return (
    <div className="terms-page">

      <div className="terms-card">
        <h1 className="terms-title">📜 Terms of Use</h1>

        <p className="terms-intro">
          Welcome to FactPins. By using our app, you agree to the following
          terms and conditions. Please read them carefully.
        </p>

        <div className="terms-section">
          <h3>1. Use of the App</h3>
          <p>
            FactPins is designed to provide educational and entertaining facts.
            You agree to use the app responsibly and not misuse the service.
          </p>
        </div>

        <div className="terms-section">
          <h3>2. Content Information</h3>
          <p>
            While we aim to provide accurate facts, we cannot guarantee that
            all information is completely error-free. Content is provided for
            general knowledge and entertainment purposes.
          </p>
        </div>

        <div className="terms-section">
          <h3>3. User Conduct</h3>
          <p>
            Users must not attempt to harm the app, misuse the platform, or
            disrupt the experience for other users.
          </p>
        </div>

        <div className="terms-section">
          <h3>4. Notifications</h3>
          <p>
            If you enable notifications, you may receive daily fact reminders.
            You can disable notifications anytime through your device or app
            settings.
          </p>
        </div>

        <div className="terms-section">
          <h3>5. Changes to Terms</h3>
          <p>
            We may update these terms from time to time to improve our service.
            Continued use of the app means you accept the updated terms.
          </p>
        </div>

        <div className="terms-footer">
          <p>Last updated: 2026</p>
        </div>
      </div>
<div className="bottom-nav">
        <button className="tab-btn" onClick={() => navigate('/home-page')}>
          🏠<span>Home</span>
        </button>
        <button className="tab-btn" onClick={() => navigate('/group-chat')}>
              💬 <span>Group Chat</span>
            </button>
       {/*<button className="tab-btn">
          🪙<span>Coins</span>
        </button>*/}
         <button className="tab-btn" onClick={() => navigate('/fact-profile')}>
          ⚙️ <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default FactTerms;