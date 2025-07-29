import { useEffect, useState } from "react";
import { subscribeUser } from "../Utils/subscribeUser";
import { createClient } from "@supabase/supabase-js";

const PUBLIC_VAPID_KEY = "BJcFO_2JkaAlRX5QZf3Srqswnjcy1hD2OBv5aaiPn_hgcD3reNZ36huFjzgfHs0QIIjK-9s0txe35oGIWyQa_Ng";
const SUPABASE_URL = "https://rfdadtqbicukjmypcjpt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmZGFkdHFiaWN1a2pteXBjanB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MjA5MzYsImV4cCI6MjA1OTQ5NjkzNn0.LS97_pRDEgk_8ScjqLi_iVUjVeATynsWXVx6yuSxB88";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function Demo() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Register service worker on mount
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch(err => console.error("SW registration failed:", err));
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      const subscription = await subscribeUser(PUBLIC_VAPID_KEY);
      setIsSubscribed(true);

      // Prepare data for Supabase
      const data = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      };

      const { error } = await supabase.from("subscriptions").insert([data]);

      if (error) {
        console.error("Supabase insert error:", error);
       // alert("Failed to save subscription.");
      } else {
        //alert("Subscribed & saved to Supabase!");
      }
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>React Push Notification Test</h2>
      <button onClick={handleSubscribe}>Subscribe to Push</button>
    </div>
  );
}

export default Demo;
