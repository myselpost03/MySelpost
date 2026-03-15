import React from "react";
import "../Styles/TelegramPopup.css";

const TelegramPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="tg-overlay">
      <div className="tg-popup">

        <div className="tg-icon">🔒</div>

        <h2>Feature Locked</h2>

        <p>
          This feature is now available only inside our
          <b> Telegram Bot</b>.
        </p>

        <a
          href="https://t.me/instalens_bot/instalens"
          target="_blank"
          rel="noreferrer"
          className="tg-open-btn"
        >
          Open Telegram Bot
        </a>

        <button className="tg-close-btn" onClick={onClose}>
          Maybe Later
        </button>

      </div>
    </div>
  );
};

export default TelegramPopup;