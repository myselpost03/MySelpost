import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import OneSignal from "react-onesignal";
import { supabase } from "../Utils/supabaseClient";
import i18n from "../i18n";
import "../Styles/Settings.css";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const savedState = localStorage.getItem("notificationsEnabled");
    if (savedState === "true") {
      setNotificationsEnabled(true);
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      // Ask permission
      await OneSignal.Notifications.requestPermission();

      if (Notification.permission === "granted") {
        await OneSignal.User.PushSubscription.optIn();
        const playerId = OneSignal.User.PushSubscription.id;
        console.log("✅ Player ID:", playerId);

        const { data, error } = await supabase
          .from("players")
          .upsert(
            { player_id: playerId, user_id: currentUser?.id },
            { onConflict: "player_id" }
          );

        if (error) {
          console.error("❌ Error saving player to Supabase:", error.message);
        } else {
          console.log("✅ Player saved to Supabase:", data);
        }
      } else {
        console.log("⚠️ Notification permission not granted");
      }
    } catch (err) {
      console.error("❌ Error subscribing for push:", err);
    }
  };

  const handleBack = () => navigate(-1);
  const handleContact = () => navigate("/contact-us");
  const handlePrivacy = () => navigate("/privacy-policy");
  const handleTerms = () => navigate("/terms");
  const handleAbout = () => navigate("/about");
  const handleUpdates = () => navigate("/updates");

  return (
    <>
      <SketchyHeader title={i18n.t("settings")} onBack={handleBack} />
      <div className="settings-container">
        <div className="settings-card">
          {/*<div className="settings-item">
            <span>Push Notifications</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={handleNotificationsChange}
              />
              <span className="slider round"></span>
            </label>
          </div>*/}

          <div className="settings-item" onClick={handleContact}>
            <span>{i18n.t("contactUs")}</span>
            <button className="settings-btn"> {i18n.t("go")} </button>
          </div>

          <div className="settings-item" onClick={handlePrivacy}>
            <span>{i18n.t("privacy_title")}</span>
            <button className="settings-btn">{i18n.t("view")}</button>
          </div>

          <div className="settings-item" onClick={handleUpdates}>
            <span>{i18n.t("recentUpdates")}</span>
            <button className="settings-btn">{i18n.t("view")}</button>
          </div>

          <div className="settings-item" onClick={handleTerms}>
            <span>{i18n.t("terms_title")}</span>
            <button className="settings-btn">{i18n.t("view")}</button>
          </div>

          <div className="settings-item" onClick={handleAbout}>
            <span>{i18n.t("about")}</span>
            <button className="settings-btn"> {i18n.t("more")} </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
