// SketchyAlert.jsx
import React from "react";
import "../Styles/SketchyAlert.css";

const SketchyAlert = ({ message, buttons = ["close"], onClose, onPay }) => {
  return (
    <div className="sketchy-alert-new">
      <div className="alert-content">
        <p>{message}</p>
        <div className="alert-buttons">
          {buttons.includes("pay") && (
            <button className="pay-btn" onClick={onPay}>
              Pay $1
            </button>
          )}
          {buttons.includes("close") && (
            <button className="close-btn" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SketchyAlert;
