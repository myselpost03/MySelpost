import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import i18n from "../i18n";
import "../Styles/ScratchPopup.css";
import toast from "react-hot-toast";

const ScratchPopup = ({ onClose, onAdWatched, adWatchedCount }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [refillActive, setRefillActive] = useState(false);

  const shareUrl = window.location.origin; // your site url
  const title = i18n.t("comeJoinMe");

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (adWatchedCount >= 5 && !refillActive) {
      setRefillActive(true);
      setTimeLeft(24 * 60 * 60); // 24 hours in seconds
    }
  }, [adWatchedCount, refillActive]);

  // --- Countdown timer for refill ---
  useEffect(() => {
    if (!refillActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRefillActive(false);
          localStorage.removeItem("refillEndTime");
          setTimeLeft(0);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refillActive]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleRefillClick = () => {
    toast.success("Scratches refilled!");
    setRefillActive(false);
    setTimeLeft(0);
    localStorage.removeItem("refillEndTime");
    // You can call actual refill logic here if needed
  };

  return (
    <div className="scratch-popup-overlay">
      <div className="scratch-popup-container">
        <button className="scratch-popup-close-circle" onClick={onClose}>
          ✖
        </button>
        <h2 className="scratch-popup-title">{i18n.t("getMoreScratches")}</h2>
        <div className="scratch-popup-actions">
          <button
            className="scratch-popup-btn"
            onClick={onAdWatched}
            disabled={adWatchedCount >= 5} // disable after 5
            style={{
              opacity: adWatchedCount >= 5 ? 0.5 : 1,
              cursor: adWatchedCount >= 5 ? "not-allowed" : "pointer",
            }}
          >
            ▶ {i18n.t("watchAd")}
            {adWatchedCount < 5 &&
              ` (${5 - adWatchedCount} ${i18n.t("leftAds")})`}{" "}
            {/* optional */}
          </button>
          {refillActive && (
            <button className="scratch-popup-btn">
              🔄 {i18n.t("refill")} ({formatTime(timeLeft)})
            </button>
          )}
          <button className="scratch-popup-btn" onClick={handleLogin}>
            🔓 {i18n.t("loginForFreeScratches")}
          </button>
          {/*<button className="scratch-popup-btn" onClick={onInviteFriend}>
            🤝 {i18n.t("inviteFriend")}
          </button>
          <div className="share-buttons">
            <WhatsappShareButton url={shareUrl} title={title}>
              <button className="scratch-popup-share-btn">
                📱 {i18n.t("whatsapp")}
              </button>
            </WhatsappShareButton>

            <TelegramShareButton url={shareUrl} title={title}>
              <button className="scratch-popup-share-btn">
                📨 {i18n.t("telegram")}
              </button>
            </TelegramShareButton>

            <FacebookShareButton url={shareUrl} quote={title}>
              <button className="scratch-popup-share-btn">
                📘 {i18n.t("facebook")}
              </button>
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={title}>
              <button className="scratch-popup-share-btn">
                🐦 {i18n.t("twitter")}
              </button>
            </TwitterShareButton>
          </div>  */}
        </div>
      </div>
    </div>
  );
};

export default ScratchPopup;
