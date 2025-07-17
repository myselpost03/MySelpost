// App.jsx
import React from 'react';
import '../Styles/FirstUserSketch.css';
import Profile from "../Assets/car-1.jpg"

const FirstUserSketch = () => {
  return (
    <div>
      {/* Top Navigation */}
      <nav className="navbar">
        <div className="tabs">
          <span className="tab">Home</span>
          <span className="tab">Services</span>
          <span className="tab">Help</span>
        </div>
      </nav>

      {/* Profile Section */}
      <div className="profile-section">
        <img 
          src={Profile}
          alt="Profile" 
          className="profile-pic" 
        />
        <span className="doctor-name">Doctor ABC</span>
      </div>
    </div>
  );
};

export default FirstUserSketch;
