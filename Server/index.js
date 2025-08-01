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

const featureNotifications = [
  {
    title: "🎨 Turn Sketch into App",
    body: "Upload your sketch and get a real app for free!",
    url: "http://localhost:3000/sketch" 
  },
  {
    title: "🔥 Roast Battle Ongoing",
    body: "Brutal roasts on photos are live! Join the madness.",
    url: "http://localhost:3000/roast" 
  },
  {
    title: "🌍 Global Chat",
    body: "Chat with foreigners around the world in real-time!",
    url: "http://localhost:3000/chat-list" 
  },
  {
    title: "📱 Sketch Something, AI will Code It!",
    body: "Draw your app idea, AI turn it into reality for free.",
    url: "http://localhost:3000/sketch"
  },
   {
    title: "💥 Roast or Be Roasted",
    body: "Dare to upload your pic? Let the roasting begin.",
    url: "http://localhost:3000/roast"
  },
  {
    title: "🗣️ Talk to the World",
    body: "Make friends in Japan, Brazil, or Egypt — instantly.",
    url: "http://localhost:3000/chat-list"
  },
   {
    title: "🛠️ No Code? No Problem.",
    body: "Got a napkin sketch? AI will build your app from it!",
    url: "http://localhost:3000/sketch"
  },
  {
    title: "✈️ New Language, New Friend",
    body: "Practice languages and meet global strangers now!",
    url: "http://localhost:3000/chat-list"
  }
];

let currentIndex = 0;

async function sendPushToAll(title, body, url) {
  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  const payload = JSON.stringify({
    title,
    body,
    url // Include URL for click actions in client
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("Failed to push:", err.message);
      if (err.statusCode === 410 || err.statusCode === 404) {
        await supabase
          .from("subscriptions")
          .delete()
          .eq("endpoint", sub.endpoint);
        console.log("Deleted invalid subscription:", sub.endpoint);
      }
    }
  }
}

// ⏲️ Send one feature-based notification every hour
setInterval(() => {
  const { title, body, url } = featureNotifications[currentIndex];
  sendPushToAll(title, body, url);

  // Rotate to next feature
  currentIndex = (currentIndex + 1) % featureNotifications.length;
}, 3600000); // every 1 r

// 🧪 Manual trigger (via POST)
app.post("/send-notification", async (req, res) => {
  const { receiverId, message } = req.body;

  if (!receiverId || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", receiverId);

  if (error) {
    //console.error("Supabase fetch error:", error);
    return res.status(500).json({ error: "Subscription fetch failed" });
  }

  const payload = JSON.stringify({
    title: "Inbox",
    body: `${message}`,
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("Web push error:", err.message);

      // Handle expired subscriptions
      if (err.statusCode === 410 || err.statusCode === 404) {
        await supabase
          .from("subscriptions")
          .delete()
          .eq("endpoint", sub.endpoint);
      }
    }
  }

  res.status(200).json({ success: true });
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
  console.log(`Push server running at http://localhost:${PORT}`);
});
