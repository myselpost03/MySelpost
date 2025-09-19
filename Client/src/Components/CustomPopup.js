import React, { useState } from "react";
import "../Styles/CustomPopup.css";
import closeIcon from "../Assets/close.png";
import coinsIcon from "../Assets/popup-coins.png";

const CustomPopup = ({ visible, onClose, message }) => {
  const [coin, setCoin] = useState(0);
  const url = "https://factpins.com";

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(`Fact Pins:\n${url}`);
      alert("Link copied! +10 coins awarded.");
      setCoin((prev) => prev + 10); // update local coin
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!visible) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-container"
        onClick={(e) => e.stopPropagation()} // prevent closing on inner click
      >
        <img
          src={closeIcon}
          alt="close"
          className="close-icon"
          onClick={onClose}
        />
        <h2 className="popup-message">{message}</h2>

        <div className="coins-info">
          <img src={coinsIcon} alt="coin" className="popup-coin" />
          <span className="coin-number">10</span>
          <button className="share-button" onClick={onShare}>
            Share App
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
