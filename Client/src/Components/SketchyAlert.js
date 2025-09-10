import React, { useState, useEffect } from "react";
import OneSignal from "react-onesignal";
import { supabase } from "../Utils/supabaseClient";
import "../Styles/SketchyAlert.css";

const SketchyAlert = ({ message, buttons = ["close"], onClose, onPay }) => {
  const [subscribed, setSubscribed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const isSubscribed =
      localStorage.getItem("notificationsEnabled") === "true";
    setSubscribed(isSubscribed);
  }, []);

  const handleSubscribe = async () => {
    console.log('clciked')
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
            { player_id: playerId, user_id: user?.id },
            { onConflict: "player_id" }
          );

        if (error) {
          console.error("❌ Error saving player to Supabase:", error.message);
        } else {
          console.log("✅ Player saved to Supabase:", data);
        }
        localStorage.setItem("notificationsEnabled", "true");
        setSubscribed(true);
      } else {
        console.log("⚠️ Notification permission not granted");
      }
    } catch (err) {
      console.error("❌ Error subscribing for push:", err);
    }
  };

  return (
    <div className="sketchy-alert-new">
      <div className="alert-content">
        <p>{message}</p>
        <div className="alert-buttons">
          {buttons.includes("pay") && (
            <button className="pay-btn" onClick={onPay}>
              Pay $1
            </button>
          )}
          {buttons.includes("allow") && (
            <button
              className={
                subscribed ? "disabled-allow-btn" : "sketchy-allow-btn"
              } // greyed out if already subscribed
              onClick={handleSubscribe}
              disabled={subscribed} // disable only if already subscribed
            >
              {subscribed ? "Granted" : "Allow"}
            </button>
          )}
          {buttons.includes("close") && (
            <button className="sketchy-alert-close-btn" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SketchyAlert;
