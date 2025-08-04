import "dotenv/config";
import express from "express";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
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
  console.log("Received push request:", req.body);
  const { subscription, payload } = req.body;

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending push:", error);
    res.status(500).json({ error: "Failed to send notification" });
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
