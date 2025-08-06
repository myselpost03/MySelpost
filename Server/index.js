import "dotenv/config";
import express from "express";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["https://myselpost.com", "https://www.myselpost.com"],
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

app.post("/send-push", async (req, res) => {
  const { userId } = req.body;

  try {
    // 1. Check badge_seen
    const { data: status, error: statusErr } = await supabase
      .from("users")
      .select("badge_seen")
      .eq("id", userId)
      .maybeSingle();

    if (statusErr) throw statusErr;
    if (!status || status.badge_seen) {
      return res.status(200).json({ message: "No push needed. Badge seen is true." });
    }

    // 2. Get subscription info
    const { data: sub, error: subErr } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (subErr || !sub) throw new Error("No subscription found");

    // 3. Send push notification
    const payload = JSON.stringify({
      title: "New Messages",
      body: "You have unread messages",
      tag: "consolidated-message",
    });

    await webpush.sendNotification(sub, payload);

    res.status(200).json({ message: "Push sent!" });
  } catch (err) {
    console.error("❌ Error sending push:", err.message);
    res.status(500).json({ error: err.message });
  }
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

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log("Route registered:", r.route.path);
  }
});

app.listen(PORT, () => {
  console.log(`Push server running`);
});
