import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import i18n from "../i18n";
import "../Styles/ScratchPopup.css";

const ScratchPopup = ({ onClose }) => {
  const navigate = useNavigate();
const shareUrl = window.location.origin; // your site url
  const title = i18n.t("comeJoinMe");

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="scratch-popup-overlay">
      <div className="scratch-popup-container">
        <button className="scratch-popup-close-circle" onClick={onClose}>
          ✖
        </button>
        <h2 className="scratch-popup-title">{i18n.t("getMoreScratches")}</h2>
        <div className="scratch-popup-actions">
          <button className="scratch-popup-btn">▶ {i18n.t("watchAd")}</button>
          <button className="scratch-popup-btn" onClick={handleLogin}>
            🔓 {i18n.t("loginForFreeScratches")}
          </button>
          <button className="scratch-popup-btn">🤝 {i18n.t("inviteFriend")}</button>
          <div className="share-buttons">
              <WhatsappShareButton url={shareUrl} title={title}>
                <button className="scratch-popup-share-btn">📱 {i18n.t("whatsapp")}</button>
              </WhatsappShareButton>

              <TelegramShareButton url={shareUrl} title={title}>
                <button className="scratch-popup-share-btn">📨 {i18n.t("telegram")}</button>
              </TelegramShareButton>

              <FacebookShareButton url={shareUrl} quote={title}>
                <button className="scratch-popup-share-btn">📘 {i18n.t("facebook")}</button>
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl} title={title}>
                <button className="scratch-popup-share-btn">🐦 {i18n.t("twitter")}</button>
              </TwitterShareButton>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScratchPopup;
