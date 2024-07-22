const { expect } = require('chai');
const { startBot } = require('../src/index');
const { bot, token } = require('../src/routes/telegram');
const { searchSong, getSongDownloadURL } = require('../src/utils/spotify');
const { downloadFile, encodeToFLAC } = require('../src/utils/file');
const { sendMessage, sendFile, getChatId } = require('../src/utils/telegram');
const { logError } = require('../src/utils/logger');

describe('Integration Tests', () => {
  beforeEach(() => {
    // Mock the bot framework and its methods
    bot.launch = () => Promise.resolve();
    bot.stop = () => Promise.resolve();
    bot.telegram.sendMessage = sendMessage;
    bot.telegram.sendDocument = sendFile;
    bot.context = { chat: { id: 'testChatId' } };

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

  it('should start the bot successfully', async () => {
    await startBot();
    expect(bot.launch).to.have.been.calledOnce;
  });

  it('should handle the /search command', async () => {
    const ctx = { message: { text: '/search Test Song' } };
    await bot.handleUpdate(ctx);
    expect(searchSong).to.have.been.calledWith('Test Song');
    expect(sendMessage).to.have.been.calledWith('testChatId', 'Song found: Test Song by Test Artist from Test Album');
  });

  it('should handle the /download command', async () => {
    const ctx = { message: { text: '/download testDownloadURL' } };
    await bot.handleUpdate(ctx);
    expect(getSongDownloadURL).to.have.been.calledWith('testSongId');
    expect(downloadFile).to.have.been.calledWith('testDownloadURL', 'testSongId.flac');
    expect(encodeToFLAC).to.have.been.calledWith('testSongId.flac');
    expect(sendFile).to.have.been.calledWith('testChatId', 'testSongId.flac', 'Test Song.flac');
  });

  it('should handle the /help command', async () => {
    const ctx = { message: { text: '/help' } };
    await bot.handleUpdate(ctx);
    expect(sendMessage).to.have.been.calledWith('testChatId', 'Available commands:\n/search - Search for a song\n/download - Download a song\n/help - Show this help message');
  });

  it('should handle unknown commands', async () => {
    const ctx = { message: { text: '/unknown' } };
    await bot.handleUpdate(ctx);
    expect(sendMessage).to.have.been.calledWith('testChatId', 'Unknown command. Please use /help to see available commands.');
  });
});