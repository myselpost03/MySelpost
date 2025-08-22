import OneSignal from "react-onesignal";
import { useEffect } from "react";

const Demo = () => {
  useEffect(() => {
    const initOneSignal = async () => {
      if (!OneSignal.initialized) {
        await OneSignal.init({
          appId: "38c069c8-b71d-4c44-ac8b-f3a92bcb9f94",
          allowLocalhostAsSecureOrigin: true,
        });
      }

      // 🔔 Ask user for browser permission
      await OneSignal.Notifications.requestPermission();

      // ✅ Use browser API instead of OneSignal wrapper
      console.log("🔔 Browser Permission:", Notification.permission); 
      // will be "granted" | "denied" | "default"

      // If granted → get OneSignal Player ID
      if (Notification.permission === "granted") {
        await OneSignal.User.PushSubscription.optIn();

        setTimeout(() => {
          const playerId = OneSignal.User.PushSubscription.id;
          console.log("🔑 Player ID:", playerId);

          if (playerId) {
            fetch("http://localhost:5000/save-player", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: "USER123", playerId }),
            });
          }
        }, 1000);
      }
    };

    initOneSignal();
  }, []);

  const sendNotification = async () => {
  const playerId = OneSignal.User.PushSubscription.id; // get the live ID
  console.log("📤 Sending push to:", playerId);

  const response = await fetch("http://localhost:5000/send-to-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      playerId, // ✅ real ID now
      title: "🚀 Hello!",
      message: "This is a test push notification just for you.",
      url: "https://yourwebsite.com",
    }),
  });

  const data = await response.json();
  console.log("📩 Push Response:", data);
};


  return (
    <div>
      <h1>Chat Demo</h1>
      <button onClick={sendNotification}>Send</button>
    </div>
  );
};

export default Demo;
