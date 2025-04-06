import React, { useState } from "react";
import { X } from "lucide-react"; // Optional: For close icon
import "../Styles/AlertBox.css"; // Import styles

const AlertBox = ({ type = "info", message = "", onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className={`alert-box ${type}`}>
      <span className="alert-message">{message}</span>
      <button className="alert-close" onClick={handleClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default AlertBox;
