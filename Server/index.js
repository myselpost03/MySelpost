import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ONE_SIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;

app.post("/schedule-push", async (req, res) => {
  const { userId, title, message, url } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }
  console.log("⏳ Scheduling push for user:", userId);

  // fetch player_id(s) for this user from Supabase
  const { data: players, error } = await supabase
    .from("players")
    .select("player_id")
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Error fetching players:", error.message);
    return res.status(500).json({ error: "Failed to fetch players" });
  }

  if (!players || players.length === 0) {
    return res.status(404).json({ error: "No player_id found for this user" });
  }

  const playerIds = players.map((p) => p.player_id);

  // Respond immediately so frontend isn’t stuck waiting
  res.json({ message: "Push scheduled in 30s", playerIds });

  // Delay push 30s
  setTimeout(async () => {
    try {
      const response = await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: ONE_SIGNAL_APP_ID,
          include_player_ids: playerIds,
          headings: { en: title || "New Message" },
          contents: { en: message || "This came 30s later!" },
          url: url || "https://yourwebsite.com",
        }),
      });

      const data = await response.json();
      console.log("✅ OneSignal 30s Push Response:", data);
    } catch (err) {
      console.error("❌ Error sending scheduled push:", err);
    }
  }, 30_000); // 30 seconds
});

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log("Route registered:", r.route.path);
  }
});

app.listen(PORT, () => {
  console.log(`Push server running on port ${PORT}`);
});
