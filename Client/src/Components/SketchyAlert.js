// src/Components/SketchyAlert.js
import React, { useEffect } from "react";
import "../Styles/SketchyAlert.css";

const SketchyAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto-dismiss after 3 sec
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="sketchy-alert">
      <span>{message}</span>
    </div>
  );
};

export default SketchyAlert;
