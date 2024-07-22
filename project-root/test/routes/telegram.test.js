const { expect } = require('chai');
const { bot, token } = require('../../src/routes/telegram');
const { handleStartCommand, handleSearchCommand, handleDownloadCommand, handleHelpCommand, handleUnknownCommand } = require('../../src/routes/telegram');
const { sendMessage, sendFile, getChatId } = require('../../src/utils/telegram');
const { searchSong, getSongDownloadURL } = require('../../src/utils/spotify');
const { downloadFile, encodeToFLAC } = require('../../src/utils/file');
const { logError } = require('../../src/utils/logger');

describe('Telegram Routes', () => {
  beforeEach(() => {
    // Mock bot framework and its methods
    bot.context = { chat: { id: 'testChatId' }, message: { text: '' } };
    bot.telegram.sendMessage = sendMessage;
    bot.telegram.sendDocument = sendFile;

    // Mock Spotify API functions
    searchSong.mockResolvedValue({
      id: 'testSongId',
      name: 'Test Song',
      artists: [{ name: 'Test Artist' }],
      album: { name: 'Test Album' },
      external_urls: { spotify: 'testDownloadURL' },
    });
    getSongDownloadURL.mockResolvedValue('testDownloadURL');

    // Mock file handling functions
    downloadFile.mockResolvedValue();
    encodeToFLAC.mockResolvedValue();

    // Mock logging function
    logError.mockImplementation(() => {});
  });

  describe('handleStartCommand', () => {
    it('should send a welcome message', async () => {
      bot.context.message.text = '/start';
      await handleStartCommand(bot.context);
      expect(sendMessage).to.have.been.calledWith('testChatId', 'Welcome to the Spotify FLAC Downloader Bot! Use /help to see available commands.');
    });
  });

  describe('handleSearchCommand', () => {
    it('should search for a song and send the results', async () => {
      bot.context.message.text = '/search Test Song';
      await handleSearchCommand(bot.context);
      expect(searchSong).to.have.been.calledWith('Test Song');
      expect(sendMessage).to.have.been.calledWith('testChatId', 'Song found: Test Song by Test Artist from Test Album');
    });

    it('should handle errors during search', async () => {
      searchSong.mockRejectedValue(new Error('Search failed'));
      bot.context.message.text = '/search Test Song';
      await handleSearchCommand(bot.context);
      expect(sendMessage).to.have.been.calledWith('testChatId', 'Error searching for the song. Please try again later.');
    });
  });

  describe('handleDownloadCommand', () => {
    it('should download a song and send it to the channel', async () => {
      bot.context.message.text = '/download testDownloadURL';
      await handleDownloadCommand(bot.context);
      expect(getSongDownloadURL).to.have.been.calledWith('testSongId');
      expect(downloadFile).to.have.been.calledWith('testDownloadURL', 'testSongId.flac');
      expect(encodeToFLAC).to.have.been.calledWith('testSongId.flac');
      expect(sendFile).to.have.been.calledWith('testChatId', 'testSongId.flac', 'Test Song.flac');
    });

    it('should handle errors during download', async () => {
      downloadFile.mockRejectedValue(new Error('Download failed'));
      bot.context.message.text = '/download testDownloadURL';
      await handleDownloadCommand(bot.context);
      expect(sendMessage).to.have.been.calledWith('testChatId', 'Error downloading the song. Please try again later.');
    });
  });

  describe('handleHelpCommand', () => {
    it('should send a help message', async () => {
      bot.context.message.text = '/help';
      await handleHelpCommand(bot.context);
      expect(sendMessage).to.have.been.calledWith('testChatId', 'Available commands:\n/start - Start the bot\n/search - Search for a song\n/download - Download a song\n/help - Show this help message');
    });
  });

  describe('handleUnknownCommand', () => {
    it('should send an unknown command message', async () => {
      bot.context.message.text = '/unknown';
      await handleUnknownCommand(bot.context);
      expect(sendMessage).to.have.been.calledWith('testChatId', 'Unknown command. Please use /help to see available commands.');
    });
  });
});