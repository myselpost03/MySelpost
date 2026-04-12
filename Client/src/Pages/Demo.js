import React from "react";
import axios from "axios";

const tg = window.Telegram.WebApp;

function Demo() {
  const sendGift = async () => {
    const user = tg.initDataUnsafe?.user;

    if (!user) {
      alert("Open inside Telegram");
      return;
    }

    try {
      await axios.post("https://yourdomain.com/create-invoice", {
        chat_id: user.id,
        gift_name: "Rose 🌹",
        amount: 10, // 10 Stars
      });

      alert("Invoice sent to your Telegram chat!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Send Gift 🎁</h2>

      <button onClick={sendGift}>
        Send Rose 🌹 (10⭐)
      </button>
    </div>
  );
}

export default Demo;