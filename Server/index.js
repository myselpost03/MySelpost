import "dotenv/config";
import express from "express";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://myselpost.com",
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
    title: "🌍 Talk Beyond Borders",
    body: "Make friends worldwide — someone’s waiting to chat.",
    url: "https://myselpost.com/chat-list",
  },
  {
    title: "🎨 Sketch What You See",
    body: "Draw your imagination, and AI will build it into reality.",
    url: "https://myselpost.com/sketch",
  },
  {
    title: "🔥 Enter the Roast Pit",
    body: "Upload your pic and see what people really think.",
    url: "https://myselpost.com/roast",
  },
  {
    title: "📱 App from a Scribble",
    body: "Sketch anything. We'll turn it into an app — no code needed.",
    url: "https://myselpost.com/sketch",
  },
  {
    title: "💥 Dare to Be Roasted?",
    body: "Upload a selfie. Let the internet do its thing.",
    url: "https://myselpost.com/roast",
  },
  {
    title: "🗣️ Global Talks in Real-Time",
    body: "Jump into conversations across cultures and time zones.",
    url: "https://myselpost.com/chat-list",
  },
  {
    title: "🛠️ Build Without Coding",
    body: "Got an idea? Draw it and AI builds your prototype.",
    url: "https://myselpost.com/sketch",
  },
  {
    title: "🎭 Roast Arena Open",
    body: "Enter the battleground of brutal honesty and laughs.",
    url: "https://myselpost.com/roast",
  },
  {
    title: "🌐 Meet Someone New",
    body: "Every message is a doorway to a different world.",
    url: "https://myselpost.com/chat-list",
  },
  {
    title: "🧠 From Idea to Interface",
    body: "Sketch your vision — AI brings it to life.",
    url: "https://myselpost.com/sketch",
  },
  {
    title: "🚨 Roast in Progress",
    body: "Someone just got roasted... could be you next.",
    url: "https://myselpost.com/roast",
  },
  {
    title: "🌏 Small Talk, Big World",
    body: "Say hello to someone across the globe right now.",
    url: "https://myselpost.com/chat-list",
  },
  {
    title: "🎨 Doodle to Demo",
    body: "Your rough sketches become real apps — seriously.",
    url: "https://myselpost.com/sketch",
  },
  {
    title: "🔥 Roast Madness",
    body: "It's getting spicy in here — jump into the roast feed.",
    url: "https://myselpost.com/roast",
  },
  {
    title: "💬 Language Swaps & Laughs",
    body: "Talk to strangers, learn something new, feel alive.",
    url: "https://myselpost.com/chat-list",
  },
  {
    title: "📲 No Skills Needed",
    body: "Sketch it. Drop it. We’ll code it. Done.",
    url: "https://myselpost.com/sketch",
  },
  {
    title: "🎤 Roast Room Unlocked",
    body: "Brave enough? Upload and let the roasting begin.",
    url: "https://myselpost.com/roast",
  },
  {
    title: "🌎 Find a Friend Abroad",
    body: "Click. Match. Talk. From anywhere to anywhere.",
    url: "https://myselpost.com/chat-list",
  },
  {
    title: "✏️ Sketch the Unexpected",
    body: "Make something weird — AI loves weird.",
    url: "https://myselpost.com/sketch",
  },
  {
    title: "🔥 Roast Storm Incoming",
    body: "Some faces just ask for it. Join the fun.",
    url: "https://myselpost.com/roast",
  },
  {
    title: "🌍 Unfiltered World Chat",
    body: "No borders. No filters. Just real humans talking.",
    url: "https://myselpost.com/chat-list",
  },
  {
    title: "🎯 Napkin to App",
    body: "Even your worst doodle can become an app — try us.",
    url: "https://myselpost.com/sketch",
  },
  {
    title: "🔥 One Pic. Many Punchlines.",
    body: "Upload now. Internet humor is brutally creative.",
    url: "https://myselpost.com/roast",
  },
  {
    title: "🧭 Talk Beyond Your Circle",
    body: "Tired of local chats? Meet a total stranger.",
    url: "https://myselpost.com/chat-list",
  },
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
    url, // Include URL for click actions in client
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

  setInterval(async () => {
    try {
      const feature = featureNotifications[currentIndex];

      await sendPushToAll(feature.title, feature.body, feature.url);
      //console.log(`✅ Sent notification: ${feature.title}`);

      // Move to next index (loop around when end is reached)
      currentIndex = (currentIndex + 1) % featureNotifications.length;
    } catch (err) {
      console.error("❌ Error sending feature notification:", err);
    }
  }, 60 * 60 * 1000); // every 1 hour
});
