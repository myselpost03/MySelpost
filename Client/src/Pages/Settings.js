import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import toast, { Toaster } from "react-hot-toast";
import OneSignal from "react-onesignal";
import { supabase } from "../Utils/supabaseClient";
import i18n from "../i18n";
import "../Styles/Settings.css";

const backgrounds = [
  {
    name: i18n.t("default"),
    style: `repeating-linear-gradient(
      45deg,
      #fffef9,
      #fffef9 10px,
      #f9f7ed 10px,
      #f9f7ed 20px
    ),
    radial-gradient(circle at top left, #fffef9 0%, #f1efdb 100%)`,
    blend: "normal",
  },
  {
    name: i18n.t("pinkPattern"),
    style: `repeating-linear-gradient(
      45deg,
      #ffe6f0,
      #ffe6f0 15px,
      #ffcce0 15px,
      #ffcce0 30px
    ),
    rgba(255,255,255,0.2)`,
    blend: "screen",
  },
  {
    name: i18n.t("oceanWaves"),
    style: `linear-gradient(160deg, #a1c4fd 0%, #c2e9fb 100%),
            repeating-linear-gradient(45deg, #69b7eb, #69b7eb 20px, #a0e9fd 20px, #a0e9fd 40px)`,
    blend: "soft-light",
  },
  {
    name: i18n.t("forestMist"),
    style: `linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%),
            radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)`,
    blend: "multiply",
  },
  {
    name: i18n.t("cosmicNight"),
    style: `radial-gradient(circle at top left, #2c3e50 0%, #4ca1af 100%),
            linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05)),
            linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05))`,
    blend: "screen",
  },
  {
    name: i18n.t("rightVibe"),
    style: `linear-gradient(90deg, #f6d365 0%, #fda085 100%),
            repeating-linear-gradient(-45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 10px, transparent 10px, transparent 20px)`,
    blend: "hard-light",
  },
];

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [restrictLowDecency, setRestrictLowDecency] = useState(false);
  const [showThemePopup, setShowThemePopup] = useState(false); // popup state

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const changeBackground = (style) => {
    localStorage.setItem("chatBackground", style);
    toast.success(i18n.t("chatThemeChanged"));
    setShowThemePopup(false); // close popup after selecting theme
  };

   useEffect(() => {
    // Check if running inside React Native WebView
    if (window.ReactNativeWebView) {
      const btn = document.getElementById("target-ad");
      if (btn) {
        btn.innerText = "coming"; // Show "coming" inside WebView
      }
    }
  }, []);

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
  const toggleRestrict = async () => {
    const newValue = !restrictLowDecency;
    setRestrictLowDecency(newValue);

    const { error } = await supabase
      .from("users")
      .update({ restrict_low_decency: newValue })
      .eq("id", currentUser.id);

    if (error) console.error("❌ Error updating setting:", error.message);
  };
  const toggleThemePopup = () => setShowThemePopup(!showThemePopup);

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
          {/*<button onClick={toggleRestrict}>
  {restrictLowDecency ? "Disable Decency Filter" : "Enable Decency Filter"}
</button>  */}
         

          <div className="settings-item" onClick={handleContact}>
            <span>{i18n.t("contactUs")}</span>
            <button className="settings-btn"> {i18n.t("go")} </button>
          </div>
           <div className="settings-item">
            <span style={{fontSize: '15px'}}>{i18n.t("restrictMessages")}</span>
            <button
              className="settings-btn"
              id="target-ad"
            >
              {i18n.t("soon")}
            </button>
          </div>
          <div className="settings-item">
            <span>{i18n.t("selectChatTheme")}</span>
            <button className="settings-btn" onClick={toggleThemePopup}>
              {i18n.t("choose")}
            </button>
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
      {showThemePopup && (
        <div className="theme-popup-overlay" onClick={toggleThemePopup}>
          <div className="theme-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Select a Theme</h3>
            <div className="theme-selector-horizontal">
              {backgrounds.map((bg) => (
                <button
                  key={bg.name}
                  className="theme-btn"
                  style={{
                    background: bg.style,
                    color: "#333",
                    backgroundBlendMode: bg.blend || "normal",
                  }}
                  onClick={() => changeBackground(bg.style)}
                >
                  {bg.name}
                </button>
              ))}
            </div>
            <button className="close-popup" onClick={toggleThemePopup}>
              {i18n.t("close")}
            </button>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default Settings;
