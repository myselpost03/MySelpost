import React, { useState, useEffect } from "react";
import OneSignal from "react-onesignal";
import { FaRegBell, FaRegBellSlash } from "react-icons/fa";
import { supabase } from "../Utils/supabaseClient";
import "../Styles/ChatHeader.css";

const ChatHeader = ({ title, onBack }) => {

  const [subscribed, setSubscribed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const isSubscribed =
      localStorage.getItem("notificationsEnabled") === "true";
    setSubscribed(isSubscribed);
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
    <div className="chat-header">
      <button className="chat-back-button" onClick={onBack}>
        ←
      </button>
      <h1 className="chat-header-title">{title}</h1>

      <button
        className="chat-bell-icon"
        onClick={handleSubscribe}
        disabled={subscribed}
      >
        {subscribed ? (
          <FaRegBell style={{ marginRight: "6px" }} />
        ) : (
          <FaRegBellSlash style={{ marginRight: "6px" }} />
        )}
      </button>
    </div>
  );
};

export default ChatHeader;
