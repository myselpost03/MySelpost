import "dotenv/config";
import axios from "axios";

const BOT_TOKEN = process.env.BOT_TOKEN;

const WEBHOOK_URL = "https://bot-1hr9.onrender.com/webhook";

async function setWebhook() {
  try {
    const res = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}`
    );

    console.log(res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

setWebhook();