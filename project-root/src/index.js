const { Telegraf } = require('telegraf');
const { bot, token } = require('./routes/telegram');
const { logError } = require('./utils/logger');

const startBot = async () => {
  try {
    // Start the Telegram bot
    await bot.launch();
    console.log('Bot started successfully!');
  } catch (error) {
    logError(error);
    console.error('Error starting bot:', error);
    process.exit(1);
  }
};

// Start the bot
startBot();

// Graceful shutdown on SIGINT or SIGTERM
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));