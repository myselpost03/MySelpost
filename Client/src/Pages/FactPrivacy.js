import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/FactPrivacy.css";


const FactPrivacy = () => {
const navigate = useNavigate();
  return (
    <div className="privacy-page">
 
      <div className="privacy-card">
       
        <h1 className="privacy-title">🔒 Privacy Policy</h1>

        <p className="privacy-intro">
          Your privacy is important to us. This policy explains how
          FactPins collects, uses, and protects your information when
          you use our app.
        </p>

        <div className="privacy-section">
          <h3>1. Information We Collect</h3>
          <p>
            FactPins may collect limited information such as notification
            subscription data and basic app usage interactions like likes
            or preferences. We do not collect personal information such
            as your name, email, or location unless explicitly provided.
          </p>
        </div>

        <div className="privacy-section">
          <h3>2. Push Notifications</h3>
          <p>
            If you enable notifications, we may send daily fact reminders
            or updates. You can disable notifications anytime through
            your browser or device settings.
          </p>
        </div>

        <div className="privacy-section">
          <h3>3. How We Use Information</h3>
          <p>
            Information collected is used only to improve the app
            experience, deliver daily facts, and maintain the service.
          </p>
        </div>

        <div className="privacy-section">
          <h3>4. Data Protection</h3>
          <p>
            We take reasonable measures to protect your data from
            unauthorized access, misuse, or disclosure.
          </p>
        </div>

        <div className="privacy-section">
          <h3>5. Third-Party Services</h3>
          <p>
            FactPins may use trusted third-party services to provide
            features like push notifications. These services may collect
            limited technical data required to deliver notifications.
          </p>
        </div>

        <div className="privacy-section">
          <h3>6. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Updates
            will be reflected on this page.
          </p>
        </div>

        <div className="privacy-footer">
          <p>Last updated: 2026</p>
        </div>

      </div>
 <div className="bottom-nav">
        <button className="tab-btn" onClick={() => navigate('/home-page')}>
          🏠<span>Home</span>
        </button>
        <button className="tab-btn">
          🔔<span>Notify</span>
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

export default FactPrivacy;