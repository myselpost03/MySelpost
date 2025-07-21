// src/Components/SketchyAlert.js
import React, { useEffect } from "react";
import "../Styles/SketchyAlert.css";

const SketchyAlert = ({ message, onClose, buttonText, onButtonClick  }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto-dismiss after 3 sec
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
   <div className="sketchy-alert-new">
      <p>{message}</p>
      <div style={{ marginTop: "10px" }}>
        {buttonText && (
          <button
            className="sketchy-coin-btn"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        )}
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SketchyAlert;
