import express from "express";
import { Telegraf, Markup } from "telegraf";
const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Express needs to parse JSON for webhooks
app.use(express.json());

// Set up the webhook path
const PORT = process.env.PORT || 10000;
const WEBHOOK_PATH = `/telegraf/${bot.secretPathComponent()}`;

// Tell Telegraf to use webhooks
bot.telegram.setWebhook(`https://bot-1hr9.onrender.com${WEBHOOK_PATH}`);
app.use(bot.webhookCallback(WEBHOOK_PATH));

// Your commands
bot.start((ctx) => ctx.reply("Welcome! Type /view"));
bot.command("view", (ctx) => {
  ctx.reply("Click the button below to open the Insta Lens:", {
    reply_markup: {
      inline_keyboard: [
        [
          Markup.button.webApp(
            "Open App",
            "https://myselpost.com" // Replace with your URL
          ),
        ],
      ],
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
