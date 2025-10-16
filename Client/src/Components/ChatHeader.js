import React, { useState, useEffect } from "react";
import OneSignal from "react-onesignal";
import { FaRegBell, FaRegBellSlash, FaBan } from "react-icons/fa";
import { supabase } from "../Utils/supabaseClient";
import { isWebView } from "../Utils/isWebView";
import "../Styles/ChatHeader.css";

const ChatHeader = ({ title, onBack, onBlockToggle, isBlocked }) => {
  const [subscribed, setSubscribed] = useState(false);
const showButton = !isWebView();

  // Check if already subscribed on mount
  useEffect(() => {
    const isSubscribed =
      localStorage.getItem("notificationsEnabled") === "true";
    setSubscribed(isSubscribed);

    // If guest already granted permission and user logs in, save playerId
    if (isSubscribed) {
      savePlayerForUser();
    }
  }, []);

  const savePlayerForUser = async () => {
    try {
      // Check if permission already granted
      if (Notification.permission !== "granted") {
        // Request permission only if not granted
        const permission = await OneSignal.Notifications.requestPermission();
        if (permission !== "granted") return; // stop if user denies
      }

      // Opt-in the push subscription
      await OneSignal.User.PushSubscription.optIn();
      const playerId = OneSignal.User.PushSubscription.id;
      console.log("✅ Player ID:", playerId);

      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.id) {
        // Save playerId with user_id in players table
        const { data, error } = await supabase
          .from("players")
          .upsert(
            { player_id: playerId, user_id: user.id },
            { onConflict: "player_id" }
          );

        if (error) console.error("❌ Error saving player:", error.message);
        else console.log("✅ Player saved in players table:", data);

        // Remove from guestPlayers if exists
        await supabase.from("guestPlayers").delete().eq("player_id", playerId);
      }
    } catch (err) {
      console.error("❌ Error saving player for user:", err);
    }
  };

  const handleSubscribe = async () => {
    // Only execute if notificationsEnabled not set
    if (localStorage.getItem("notificationsEnabled") === "true") return;

    try {
      // Request permission only if not granted
      if (Notification.permission !== "granted") {
        const permission = await OneSignal.Notifications.requestPermission();
        if (permission !== "granted") return;
      }

      await OneSignal.User.PushSubscription.optIn();
      const playerId = OneSignal.User.PushSubscription.id;
      console.log("✅ Player ID:", playerId);

      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.id) {
        const { data, error } = await supabase
          .from("players")
          .upsert(
            { player_id: playerId, user_id: user.id },
            { onConflict: "player_id" }
          );
        if (error) console.error("❌ Error saving player:", error.message);
        else console.log("✅ Player saved in players table:", data);

        await supabase.from("guestPlayers").delete().eq("player_id", playerId);
      } else {
        const { error } = await supabase
          .from("guestPlayers")
          .upsert({ player_id: playerId }, { onConflict: "player_id" });
        if (error)
          console.error("❌ Error saving guest player:", error.message);
        else console.log("✅ Player saved in guestPlayers table");
      }

      localStorage.setItem("notificationsEnabled", "true");
      setSubscribed(true);
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

      <div className="chat-header-actions">
        {/* Block button - just calls the function passed from parent */}
        <button
          onClick={onBlockToggle}
          aria-label={isBlocked ? "Unblock user" : "Block user"}
          title={isBlocked ? "Unblock user" : "Block user"}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: isBlocked ? "#ff6f61" : "#fff",
            fontSize: "1.2rem",
          }}
        >
          <FaBan />
        </button>

        {/* Notification bell */}
       {showButton && (
      <button
        className="chat-bell-icon"
        onClick={handleSubscribe}
        disabled={subscribed}
        title={subscribed ? "Notifications enabled" : "Enable notifications"}
      >
        {subscribed ? (
          <FaRegBell style={{ marginRight: "6px" }} />
        ) : (
          <FaRegBellSlash style={{ marginRight: "6px" }} />
        )}
      </button>
    )}
      </div>
    </div>
  );
};

export default ChatHeader;
