const { Telegraf } = require('telegraf');
const { logError } = require('./logger');

const sendMessage = async (chatId, message) => {
  try {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    await bot.telegram.sendMessage(chatId, message);
  } catch (error) {
    logError(`Error sending message: ${error.message}`);
  }
};

const sendFile = async (chatId, filePath, fileName) => {
  try {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    await bot.telegram.sendDocument(chatId, { source: filePath, filename: fileName });
  } catch (error) {
    logError(`Error sending file: ${error.message}`);
  }
};

const getChatId = (ctx) => {
  return ctx.chat.id;
};

const handleTelegramError = (error) => {
  logError(`Error handling Telegram interaction: ${error.message}`);
};

module.exports = {
  sendMessage,
  sendFile,
  getChatId,
  handleTelegramError,
};