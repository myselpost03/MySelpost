import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OneSignal from "react-onesignal";
import SketchyHeader from "../Components/SketchyHeader";
import { supabase } from "../Utils/supabaseClient";
import { subscribeUser } from "../Utils/subscribeUser";
import { trackEvent } from "../Utils/analytics";
import "../Styles/Settings.css";

// ✅ Global flag to track if initialized
let oneSignalInitialized = false;

const initOneSignal = async () => {
  if (!window.OneSignal) {
    console.error("❌ OneSignal SDK not loaded");
    return;
  }

  if (!oneSignalInitialized) {
    await OneSignal.init({
      appId: "2018cba1-59ea-4116-87a0-6f8dad9cf527",
      safari_web_id: "web.onesignal.auto.487bfeae-71a3-407e-85d8-1b40bd783a80",
      notifyButton: {
        enable: true,
      }, //allowLocalhostAsSecureOrigin: true,
    });
    oneSignalInitialized = true;
    console.log("✅ OneSignal initialized once");
  } else {
    console.log("ℹ️ OneSignal already initialized, skipping");
  }
};

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

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
      await initOneSignal();

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

  const handleNotificationsChange = (e) => {
    const isEnabled = e.target.checked;

    if (isEnabled) {
      setNotificationsEnabled(true);
      localStorage.setItem("notificationsEnabled", "true");
      handleSubscribe();
    } else {
      // ❌ Prevent disabling manually
      e.preventDefault();
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
      <SketchyHeader title="Settings" onBack={handleBack} />
      <div className="settings-container">
        <div className="settings-card">
          <div className="settings-item">
            <span>Push Notifications</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={handleNotificationsChange}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="settings-item" onClick={handleContact}>
            <span>Contact Us</span>
            <button className="settings-btn">Go</button>
          </div>

          <div className="settings-item" onClick={handlePrivacy}>
            <span>Privacy Policy</span>
            <button className="settings-btn">View</button>
          </div>

          <div className="settings-item" onClick={handleUpdates}>
            <span>Recent Updates Made</span>
            <button className="settings-btn">View</button>
          </div>

          <div className="settings-item" onClick={handleTerms}>
            <span>Terms of Service</span>
            <button className="settings-btn">View</button>
          </div>

          <div className="settings-item" onClick={handleAbout}>
            <span>About</span>
            <button className="settings-btn">More</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
