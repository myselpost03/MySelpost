import React, { useEffect } from "react";
import OneSignal from "react-onesignal";
import { supabase } from "../Utils/supabaseClient";
import axios from "axios";

// ✅ Global flag to track if initialized
let oneSignalInitialized = false;

const initOneSignal = async () => {
  if (!window.OneSignal) {
    console.error("❌ OneSignal SDK not loaded");
    return;
  }

  if (!oneSignalInitialized) {
    await OneSignal.init({
      appId: "38c069c8-b71d-4c44-ac8b-f3a92bcb9f94",
      allowLocalhostAsSecureOrigin: true,
    });
    oneSignalInitialized = true;
    console.log("✅ OneSignal initialized once");
  } else {
    console.log("ℹ️ OneSignal already initialized, skipping");
  }
};

const Demo = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  {
    /* useEffect(() => {
    const initAndCheck = async () => {
      try {
        await initOneSignal();

        const checkAndUnsubscribe = async () => {
          const subscriptionId = OneSignal.User.PushSubscription.id;

          if (!subscriptionId) {
            console.log("⚠️ No OneSignal subscription found on this device");
            return;
          }

          const { data: playerRecords, error } = await supabase
            .from("players")
            .select("*")
            .eq("player_id", subscriptionId);

          if (error) {
            console.error("❌ Error fetching player record:", error.message);
            return;
          }

          const playerRecord = playerRecords?.[0];
          if (!playerRecord) {
            console.log("ℹ️ No matching player record in DB for this device");
            return;
          }

          if (!currentUser) {
            await OneSignal.User.PushSubscription.optOut();

            await axios.delete("http://localhost:5000/delete-player", {
              data: {
                playerId: playerRecord.player_id,
                userId: playerRecord.user_id,
              },
            });

            console.log("🔕 Auto unsubscribed and deleted from DB");
          }
        };

        // Run once
        await checkAndUnsubscribe();

        // Listen for subscription changes
        OneSignal.User.PushSubscription.addEventListener(
          "change",
          async (state) => {
            if (state.id) {
              console.log("✅ Subscription active, Player ID:", state.id);
              await checkAndUnsubscribe();
            } else {
              console.log("🔕 Subscription removed / not active");
            }
          }
        );
      } catch (err) {
        console.error("❌ OneSignal init/check failed:", err);
      }
    };

    initAndCheck();
  }, [currentUser]);
*/
  }

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

  const handleUnsubscribe = async () => {
    try {
      await initOneSignal();

      const playerId = OneSignal.User.PushSubscription.id;
      if (!playerId) {
        console.log("⚠️ No active push subscription found on this device");
      } else if (currentUser?.id) {
        await axios.delete("http://localhost:5000/delete-player", {
          data: {
            userId: currentUser.id,
            playerId,
          },
        });
      }

      await OneSignal.User.PushSubscription.optOut();
      //      localStorage.removeItem("user");
      //    window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const schedulePush = async () => {
    try {
      await initOneSignal();

      const playerId = OneSignal.User.PushSubscription.id;
      if (!playerId) {
        console.log(
          "⚠️ No active push subscription found. Not scheduling push."
        );
        return;
      }

      const { data: playerRecords, error } = await supabase
        .from("players")
        .select("*")
        .eq("player_id", playerId)
        .eq("user_id", currentUser?.id);

      if (error) {
        console.error("❌ Error checking player in Supabase:", error.message);
        return;
      }

      if (!playerRecords || playerRecords.length === 0) {
        console.log("⚠️ Player not found in Supabase. Not scheduling push.");
        return;
      }

      await axios.post("http://localhost:5000/schedule-push", {
        userId: currentUser?.id,
        title: "📩 Scheduled Hello!",
        message: "This notification came 30s later 🚀",
        url: "https://yourwebsite.com",
      });

      console.log("✅ Push scheduled successfully!");
    } catch (err) {
      console.error("❌ Error scheduling push:", err);
    }
  };

  return (
    <div>
      <button onClick={handleSubscribe}>Subscribe To Push</button>
      <button onClick={handleUnsubscribe}>Unsubscribe From Push</button>
      <button onClick={schedulePush}>Send Scheduled Push</button>
    </div>
  );
};

export default Demo;
