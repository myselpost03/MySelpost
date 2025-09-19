import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import "../Styles/ScratchPopup.css";

const ScratchPopup = ({ onClose }) => {
  const navigate = useNavigate();
const shareUrl = window.location.origin; // your site url
  const title = "Come join me on MySelpost and win scratches!";

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="scratch-popup-overlay">
      <div className="scratch-popup-container">
        <button className="scratch-popup-close-circle" onClick={onClose}>
          ✖
        </button>
        <h2 className="scratch-popup-title">Get More Scratches</h2>
        <div className="scratch-popup-actions">
          <button className="scratch-popup-btn">▶ Watch Ad</button>
          <button className="scratch-popup-btn" onClick={handleLogin}>
            🔓 Login to get +30 free scratches
          </button>
          <button className="scratch-popup-btn">🤝 Invite Friend</button>
          <div className="share-buttons">
              <WhatsappShareButton url={shareUrl} title={title}>
                <button className="scratch-popup-share-btn">📱 WhatsApp</button>
              </WhatsappShareButton>

              <TelegramShareButton url={shareUrl} title={title}>
                <button className="scratch-popup-share-btn">📨 Telegram</button>
              </TelegramShareButton>

              <FacebookShareButton url={shareUrl} quote={title}>
                <button className="scratch-popup-share-btn">📘 Facebook</button>
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl} title={title}>
                <button className="scratch-popup-share-btn">🐦 Twitter</button>
              </TwitterShareButton>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScratchPopup;
