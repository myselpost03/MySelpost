import React from "react";
import "../Styles/WrongGuessPopup.css"; // optional for styling

const WrongGuessPopup = ({ onClose, onAd }) => {
  return (
    <div className="wrong-popup-overlay">
      <div className="wrong-popup-container">
        <h2 className="wrong-guessed">😞 You guessed it wrong!</h2>
        <p className="wrong-guessed-subtitle">You can't scratch it now.</p>
        <button className="wrong-ad-btn" onClick={onAd}>
          Watch Ad to Reveal
        </button>
        <button className="wrong-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default WrongGuessPopup;
