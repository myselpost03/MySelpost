import React from "react";
import "../Styles/ComingSoonPopup.css";

const ComingSoonPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="coming-soon-popup-overlay">
      <div className="coming-soon-popup-content">
        <button className="coming-soon-close-btn" onClick={onClose}>
          &times;
        </button>
        <h1>Don't worry girls,</h1>
        <p>This feature will come soon.</p>
        <p className="coming-soon-subtitle">Great things take time ⏳</p>
      </div>
    </div>
  );
};

export default ComingSoonPopup;
