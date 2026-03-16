import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/FactAbout.css";

const FactAbout = () => {
    
const navigate = useNavigate();
 
  return (
    <div className="about-page">

      <div className="about-card">
        <h1 className="about-title">📌 About FactPins</h1>

        <p className="about-text">
          FactPins is a fun place to discover surprising, interesting,
          and mind-blowing facts from around the world. Our goal is to
          make learning something new every day simple and enjoyable.
        </p>

        <p className="about-text">
          From science and history to strange and fascinating discoveries,
          FactPins delivers short facts that spark curiosity and help you
          learn something cool in just a few seconds.
        </p>

        <div className="about-features">
          <div className="feature">📚 Learn amazing facts</div>
          <div className="feature">❤️ Like your favorite facts</div>
          <div className="feature">🔔 Get daily fact reminders</div>
          <div className="feature">🧠 Expand your knowledge</div>
        </div>

        <div className="about-footer">
          <p>Made for curious minds everywhere 🌍</p>
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

export default FactAbout;