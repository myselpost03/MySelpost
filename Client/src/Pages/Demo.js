import React, { useState } from "react";
import OneSignal from "react-onesignal";
import { supabase } from "../Utils/supabaseClient";

const Demo = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleSubscribe = async () => {
    try {
      // ? Only initialize if not already initialized
      if (!window.OneSignal) {
        console.error("❌ OneSignal SDK not loaded");
        return;
      }

      if (!OneSignal.initialized) {
        await OneSignal.init({
          appId: "38c069c8-b71d-4c44-ac8b-f3a92bcb9f94",
          allowLocalhostAsSecureOrigin: true,
        });
      } else {
        console.log("ℹ️ OneSignal already initialized, skipping init");
      }

      // Ask permission
      await OneSignal.Notifications.requestPermission();

      if (Notification.permission === "granted") {
        await OneSignal.User.PushSubscription.optIn();
        const playerId = OneSignal.User.PushSubscription.id;
        console.log("✅ Player ID:", playerId);

        // Save in Supabase players table
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

        // (Optional) Send to backend for scheduling push
        await fetch("http://localhost:5000/schedule-push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser?.id,
            title: "📩 Scheduled Hello!",
            message: "This notification came 30s later 🚀",
            url: "https://yourwebsite.com",
          }),
        });
      } else {
        console.log("⚠️ Notification permission not granted");
      }
    } catch (err) {
      console.error("❌ Error subscribing for push:", err);
    }
  };

  return (
    <div>
      <button onClick={handleSubscribe}>Subscribe</button>
    </div>
  );
};

export default Demo;
