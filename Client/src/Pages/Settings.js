import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import { supabase } from "../Utils/supabaseClient";
import { subscribeUser } from "../Utils/subscribeUser";
import { trackEvent } from "../Utils/analytics";
import "../Styles/Settings.css";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const navigate = useNavigate();
  const PUBLIC_VAPID_KEY =
    "BMt7fVUizCYq_PQkR-gkxa9azLTlzoLVgFQEIDjjJdP35dj2LyvHKCbBnp3YvsYdPmYwjx7gfnoMMhejp9i85-4";
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const savedState = localStorage.getItem("notificationsEnabled");
    if (savedState === "true") {
      setNotificationsEnabled(true);
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      const subscription = await subscribeUser(PUBLIC_VAPID_KEY);
      setIsSubscribed(true);

      const data = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        user_id: user.id,
      };

      // Optionally: Check if subscription already exists before upsert
      const { data: existing, error: selectError } = await supabase
        .from("subscriptions")
        .select("endpoint, keys")
        .eq("endpoint", subscription.endpoint)
        .single();

      // Only upsert if changed or not found
      if (
        !existing ||
        existing.keys.p256dh !== data.keys.p256dh ||
        existing.keys.auth !== data.keys.auth
      ) {
        const { error } = await supabase.from("subscriptions").upsert(data, {
          onConflict: ["endpoint"],
        });

        if (error) {
          console.error("Supabase insert error:", error);
          //console.log("Failed to save subscription.");
        } else {
          //console.log("Subscribed & saved to Supabase!");
        }
      } else {
        //console.log("Subscription already up-to-date.");
      }
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };

  const askNotificationPermission = async () => {
    trackEvent({
      action: "button_click",
      category: "Chat List Page",
      label: "Notification Button",
    });
    if (Notification.permission === "granted") {
      console.log("Already granted.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Push notifications granted.");
      await handleSubscribe();
    }
  };

  const handleNotificationsChange = (e) => {
    const isEnabled = e.target.checked; // new value
    setNotificationsEnabled(isEnabled);
    localStorage.setItem("notificationsEnabled", isEnabled);

    if (isEnabled) {
      askNotificationPermission();
    }
    // Optional: handle disable case if needed
    // else { console.log("Notifications disabled"); }
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
                onChange={handleNotificationsChange} // handle only here
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
