import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import axios from "axios";
import { DodoPayments } from 'dodopayments';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000"    ],
    credentials: true,
     methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ONE_SIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;

// Helper
function formatLikes(count) {
  if (count === 1) return "1 like";
  if (count < 1000) return `${count} likes`;
  if (count < 1_000_000)
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k likes`;
  return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M likes`;
}

// Schedule push notifications for all players after 30 seconds
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
      const response = await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: ONE_SIGNAL_APP_ID,
          include_player_ids: playerIds,
          headings: { en: title || "New Message" },
          contents: { en: message || "This came 30s later!" },
          url: url || "https://yourwebsite.com",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
          },
        }
      );

      const data = await response.data;
      console.log("✅ OneSignal 30s Push Response:", data);

      // 🔑 Cleanup expired/invalid player_ids
      if (data.errors && data.errors.length > 0) {
        console.warn("⚠️ Some player_ids failed:", data.errors);

        // If OneSignal rejected playerIds → remove them from Supabase
        await supabase.from("players").delete().in("player_id", playerIds);

        console.log("🗑️ Invalid player_ids removed from Supabase");
      }
    } catch (err) {
      console.error("❌ Error sending scheduled push:", err);
    }
  }, 30_000); // 30 seconds
});

// Schedule like push notification
app.post("/send-like-push", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("❌ Missing userId in request body");
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // 1️⃣ Count unseen likes
    const { data: unseenLikes, error: likesErr } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", userId)
      .eq("seen", false);

    if (likesErr) throw likesErr;

    if (!unseenLikes || unseenLikes.length === 0) {
      //console.log(`🔕 User ${userId} has no unseen likes`);
      return res.json({ message: "No new likes, skip push" });
    }

    // 2️⃣ Get player_ids
    const { data: players, error: playerErr } = await supabase
      .from("players")
      .select("player_id")
      .eq("user_id", userId);

    if (playerErr) throw playerErr;
    if (!players?.length) {
      //console.log(`❌ No player IDs found for user ${userId}`);
      return res.status(404).json({ error: "No player IDs" });
    }

    const playerIds = players.map((p) => p.player_id);
    //console.log(`✅ Found player IDs for user ${userId}:`, playerIds);

    // 3️⃣ Respond immediately
    res.json({ success: true, count: unseenLikes.length, playerIds });

    // 4️⃣ Send push after a tiny delay (200ms)
    setTimeout(async () => {
      try {
        const payload = {
          app_id: ONE_SIGNAL_APP_ID,
          include_player_ids: playerIds,
          headings: { en: "❤️ New Likes!" },
          contents: {
            en: `You have ${formatLikes(unseenLikes.length)}.`, // formatLikes: 1 like / 2 likes
          },
          url: "https://www.myselpost.com/chat-list",
          chrome_web_icon: "https://www.myselpost.com/heart.png",
          chrome_web_badge: "https://www.myselpost.com/myselpost.png",
        };

        const response = await axios.post(
          "https://onesignal.com/api/v1/notifications",
          payload,
          { headers: { Authorization: `Basic ${ONE_SIGNAL_API_KEY}` } }
        );

        //console.log("✅ OneSignal Like Push Response:", response.data);

        // 5️⃣ Cleanup invalid player_ids
        if (response.data.errors && response.data.errors.length > 0) {
          console.warn("⚠️ Some player_ids invalid:", response.data.errors);

          await supabase
            .from("players")
            .delete()
            .in(
              "player_id",
              response.data.errors.map((e) => e.id)
            );

          console.log("🗑️ Removed invalid player_ids from Supabase");
        }
      } catch (err) {
        console.error(
          "❌ Error sending like push:",
          err.response?.data || err.message
        );
      }
    }, 200); // 200ms delay
  } catch (err) {
    console.error(
      "❌ Error in send-like-push route:",
      err.response?.data || err.message
    );
    return res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Schedule message push notification
app.post("/send-message-push", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("❌ Missing userId in request body");
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // 1️⃣ Fetch user's current route
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("active_route")
      .eq("id", userId)
      .single();

    if (userErr) throw userErr;
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2️⃣ Check if user is on their chat page
    if (userData.active_route?.startsWith("/chat/")) {
      console.log(`ℹ️ User ${userId} is currently in chat. No push sent.`);
      return res.json({ success: true, message: "User in chat, push skipped" });
    }

    // 3️⃣ Fetch player_ids for the user
    const { data: players, error: playerErr } = await supabase
      .from("players")
      .select("player_id")
      .eq("user_id", userId);

    if (playerErr) throw playerErr;
    if (!players?.length) {
      return res.status(404).json({ error: "No player IDs" });
    }

    const playerIds = players.map((p) => p.player_id);

    // 4️⃣ Respond immediately so frontend isn't blocked
    res.json({ success: true, message: "Push request received", playerIds });

    // 5️⃣ Fire push after a tiny delay
    setTimeout(async () => {
      try {
        const payload = {
          app_id: ONE_SIGNAL_APP_ID,
          include_player_ids: playerIds,
          headings: "MySelpost",
          contents: "You have unread messages",
          url: "https://www.myselpost.com/chat-list",
          collapse_id: `chat_${userId}`,
          chrome_web_icon: "https://www.myselpost.com/inbox.png",
          chrome_web_badge: "https://www.myselpost.com/myselpost.png",
        };

        const response = await axios.post(
          "https://onesignal.com/api/v1/notifications",
          payload,
          { headers: { Authorization: `Basic ${ONE_SIGNAL_API_KEY}` } }
        );

        // 6️⃣ Cleanup invalid player_ids
        if (response.data.errors && response.data.errors.length > 0) {
          console.warn("⚠️ Some player_ids invalid:", response.data.errors);

          await supabase
            .from("players")
            .delete()
            .in(
              "player_id",
              response.data.errors.map((e) => e.id)
            );

          console.log("🗑️ Removed invalid player_ids from Supabase");
        }
      } catch (err) {
        console.error(
          "❌ Error sending push:",
          err.response?.data || err.message
        );
      }
    }, 200);
  } catch (err) {
    console.error("❌ Error in send-message-push route:", err);
    return res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Delete player from database
app.delete("/delete-player", async (req, res) => {
  const { playerId, userId } = req.body;

  if (!playerId || !userId) {
    return res.status(400).json({ error: "Missing playerId or userId" });
  }

  try {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("player_id", playerId)
      .eq("user_id", userId);

    if (error) throw error;

    res.json({ success: true, message: "Player deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting player:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const client = new DodoPayments({
  bearerToken: '5Or_EagdmyanaWRl.2RD2jj_1ska6VUlJvs48Y4sMsrl4bwHDhyJnsSEiIk-QbGR8',
  environment: 'test_mode', // for test environment
});

// In-memory coins
const userCoins = {}; // { userId: coins }

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { quantity, userId } = req.body;

    if (!quantity) return res.status(400).json({ error: "Quantity is required" });

    const sessionResponse = await client.checkoutSessions.create({
      product_cart: [{ product_id: "pdt_hGntim2Yociijw5zJEWo2", quantity }],
      metadata: { userId },
    });

    res.json({
      sessionId: sessionResponse.session_id,
      checkoutUrl: sessionResponse.checkout_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// New endpoint: confirm payment status and increment coins
app.post("/confirm-payment", async (req, res) => {
  try {
    const { sessionId, userId } = req.body;
    if (!sessionId || !userId) return res.status(400).json({ error: "Missing sessionId or userId" });

    const session = await client.checkoutSessions.retrieve(sessionId);

    console.log("Payment session status:", session.status);

    if (session.status === "succeeded") {
      // Increment coins
      userCoins[userId] = (userCoins[userId] || 0) + 100;
      res.json({ coins: userCoins[userId], message: "Coins added successfully" });
    } else {
      res.status(400).json({ message: "Payment not successful", status: session.status });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/coins/:userId", (req, res) => {
  res.json({ userId: req.params.userId, coins: userCoins[req.params.userId] || 0 });
});

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log("Route registered:", r.route.path);
  }
});

app.listen(PORT, () => {
  console.log(`Push server running on port ${PORT}`);
});