import "dotenv/config";
import express from "express";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Setup web-push VAPID
webpush.setVapidDetails(
  "mailto:anujers.social@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
const subscriptions = []
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription saved." });
});

app.post("/send-notification", (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  subscriptions.forEach((sub, i) => {
    webpush.sendNotification(sub, payload).catch((err) => {
      console.error("Failed, removing subscription", err);
      subscriptions.splice(i, 1);
    });
  });

  res.status(200).json({ message: "Notifications sent." });
});

app.post("/send-push", async (req, res) => {
  const { userId, messageId } = req.body;

  try {
    console.log("🔹 Incoming request:", { userId, messageId });

    if (!userId || !messageId) return res.status(400).json({ error: "Missing userId or messageId" });

    const cleanUserId = userId.trim();

    // 1️⃣ Fetch user
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("badge_seen, last_push_message_id")
      .eq("id", cleanUserId)
      .maybeSingle();

    console.log("🔹 User fetched:", user, "Error:", userErr);
    if (userErr) throw userErr;
    if (!user) throw new Error("User not found");

    // 2️⃣ Only push if badge_seen === false and messageId is new
    if (user.badge_seen === false && user.last_push_message_id !== messageId) {
      console.log("🔹 Push required for this message");

      // 3️⃣ Fetch subscription
      const { data: sub, error: subErr } = await supabase
        .from("subscriptions")
  .select("endpoint, keys")
  .filter("user_id::text", "eq", userId)
  .maybeSingle();

      console.log("🔹 Subscription fetched:", sub, "Error:", subErr);

      if (subErr) throw subErr;
      if (!sub) throw new Error("No subscription found");

      // 4️⃣ Parse keys JSON if needed
      let keysObj = sub.keys;
      if (typeof keysObj === "string") keysObj = JSON.parse(keysObj);

      if (!sub.endpoint || !keysObj) throw new Error("Invalid subscription");

      // 5️⃣ Send push
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: keysObj
        },
        JSON.stringify({
          title: "New Messages",
          body: "You have unread messages",
          tag: "consolidated-message"
        })
      );

      console.log("✅ Notification sent successfully");

      // 6️⃣ Update last_push_message_id
      const { error: updateErr } = await supabase
        .from("users")
        .update({ last_push_message_id: messageId })
        .eq("id", cleanUserId);

      if (updateErr) throw updateErr;

      return res.status(200).json({ message: "✅ Push sent" });
    }

    console.log("ℹ️ No push needed for this message");
    return res.status(200).json({ message: "ℹ️ No push needed" });

  } catch (err) {
    console.error("❌ Error sending push:", err);
    return res.status(500).json({ error: err.message });
  }
});


app.get("/debug-subs/:userId", async (req, res) => {
  const userId = req.params.userId.trim();
  console.log("🔹 Debug subscriptions for userId:", userId);

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId);

  console.log("🔹 Subscriptions found:", data, "Error:", error);
  res.json({ data, error });
});

app.get("/check-subscriptions", async (req, res) => {
  try {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*");

    if (error) {
      console.error("Supabase fetch error:", error);
      return res.status(500).json({ error: "Failed to fetch subscriptions" });
    }

    let removedCount = 0;

    for (const sub of subscriptions) {
      try {
        // Optional: send a silent/test payload
        const payload = JSON.stringify({ test: true });

        await webpush.sendNotification(sub, payload);
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase
            .from("subscriptions")
            .delete()
            .eq("endpoint", sub.endpoint);
          console.log("Deleted expired subscription:", sub.endpoint);
          removedCount++;
        } else {
          console.warn("Unhandled push error:", err.message);
        }
      }
    }

    res.json({
      message: "Subscription check completed.",
      removed: removedCount,
      total: subscriptions.length,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const ONE_SIGNAL_APP_ID = "38c069c8-b71d-4c44-ac8b-f3a92bcb9f94";
const ONE_SIGNAL_API_KEY = "os_v2_app_hdagtsfxdvgejlel6ousxs47stvgicg7le6uy4ugyqcfnrdbvaqnmtuz6yi4cdaj6y33afp75cno3ab5ancxqoz2h433bdymu5o63eq"; // from OneSignal dashboard

app.post("/send-to-user", async (req, res) => {
  const { playerId, title, message, url } = req.body;

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONE_SIGNAL_APP_ID,
        include_player_ids: [playerId], // 🎯 target this player only
        headings: { en: title || "New Message" },
        contents: { en: message || "You got a new push!" },
        url: url || "https://yourwebsite.com",
      }),
    });

    const data = await response.json();
    console.log("✅ OneSignal Response:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Error sending push:", err);
    res.status(500).json({ error: err.message });
  }
});

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log("Route registered:", r.route.path);
  }
});

app.listen(PORT, () => {
  console.log(`Push server running`);
});
