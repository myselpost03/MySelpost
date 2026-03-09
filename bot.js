const { Telegraf, Markup } = require('telegraf');

// Replace 'YOUR_BOT_TOKEN_HERE' with the token you got from BotFather
const bot = new Telegraf('8762626172:AAEMhGw_ZpLyCQyVkcrQNLu2DflujYffT08');

// This handles the /start command
bot.start((ctx) => {
    ctx.reply('Welcome buddy! Type /view to initiate the process.');
});

bot.command('view', (ctx) => {
    ctx.reply('Click the button below to open the Insta Lens app:', {
        reply_markup: {
            inline_keyboard: [
                [
                    Markup.button.webApp(
                        'Open App', 
                        'https://myselpost.com' // Replace with your URL
                    )
                ]
            ]
        }
    });
});

// Launch the bot
bot.launch();

console.log('Bot is running... press Ctrl+C to stop.');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));