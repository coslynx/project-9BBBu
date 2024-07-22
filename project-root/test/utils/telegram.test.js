const { expect } = require('chai');
const { sendMessage, sendFile, getChatId, handleTelegramError } = require('../../src/utils/telegram');
const sinon = require('sinon');

describe('Telegram Utils', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('sendMessage', () => {
    it('should send a message to a Telegram chat', async () => {
      const chatId = 'testChatId';
      const message = 'Test message';
      const telegrafStub = sandbox.stub(require('telegraf'), 'Telegraf').returns({
        telegram: {
          sendMessage: sinon.stub().resolves(),
        },
      });
      const logErrorStub = sandbox.stub(console, 'error');

      await sendMessage(chatId, message);

      expect(telegrafStub.calledOnce).to.be.true;
      expect(telegrafStub.calledWith(process.env.TELEGRAM_BOT_TOKEN)).to.be.true;
      expect(telegrafStub.returnValues[0].telegram.sendMessage.calledOnce).to.be.true;
      expect(telegrafStub.returnValues[0].telegram.sendMessage.calledWith(chatId, message)).to.be.true;
      expect(logErrorStub.notCalled).to.be.true;
    });

    it('should handle errors during message sending', async () => {
      const chatId = 'testChatId';
      const message = 'Test message';
      const error = new Error('Error sending message');
      const telegrafStub = sandbox.stub(require('telegraf'), 'Telegraf').returns({
        telegram: {
          sendMessage: sinon.stub().rejects(error),
        },
      });
      const logErrorStub = sandbox.stub(console, 'error');

      try {
        await sendMessage(chatId, message);
        expect.fail('Error should have been thrown');
      } catch (err) {
        expect(err).to.equal(error);
        expect(telegrafStub.calledOnce).to.be.true;
        expect(telegrafStub.calledWith(process.env.TELEGRAM_BOT_TOKEN)).to.be.true;
        expect(telegrafStub.returnValues[0].telegram.sendMessage.calledOnce).to.be.true;
        expect(telegrafStub.returnValues[0].telegram.sendMessage.calledWith(chatId, message)).to.be.true;
        expect(logErrorStub.calledOnce).to.be.true;
        expect(logErrorStub.calledWith(`Error sending message: ${error.message}`)).to.be.true;
      }
    });
  });

  describe('sendFile', () => {
    it('should send a file to a Telegram chat', async () => {
      const chatId = 'testChatId';
      const filePath = 'test.flac';
      const fileName = 'Test Song.flac';
      const telegrafStub = sandbox.stub(require('telegraf'), 'Telegraf').returns({
        telegram: {
          sendDocument: sinon.stub().resolves(),
        },
      });
      const logErrorStub = sandbox.stub(console, 'error');

      await sendFile(chatId, filePath, fileName);

      expect(telegrafStub.calledOnce).to.be.true;
      expect(telegrafStub.calledWith(process.env.TELEGRAM_BOT_TOKEN)).to.be.true;
      expect(telegrafStub.returnValues[0].telegram.sendDocument.calledOnce).to.be.true;
      expect(telegrafStub.returnValues[0].telegram.sendDocument.calledWith(chatId, { source: filePath, filename: fileName })).to.be.true;
      expect(logErrorStub.notCalled).to.be.true;
    });

    it('should handle errors during file sending', async () => {
      const chatId = 'testChatId';
      const filePath = 'test.flac';
      const fileName = 'Test Song.flac';
      const error = new Error('Error sending file');
      const telegrafStub = sandbox.stub(require('telegraf'), 'Telegraf').returns({
        telegram: {
          sendDocument: sinon.stub().rejects(error),
        },
      });
      const logErrorStub = sandbox.stub(console, 'error');

      try {
        await sendFile(chatId, filePath, fileName);
        expect.fail('Error should have been thrown');
      } catch (err) {
        expect(err).to.equal(error);
        expect(telegrafStub.calledOnce).to.be.true;
        expect(telegrafStub.calledWith(process.env.TELEGRAM_BOT_TOKEN)).to.be.true;
        expect(telegrafStub.returnValues[0].telegram.sendDocument.calledOnce).to.be.true;
        expect(telegrafStub.returnValues[0].telegram.sendDocument.calledWith(chatId, { source: filePath, filename: fileName })).to.be.true;
        expect(logErrorStub.calledOnce).to.be.true;
        expect(logErrorStub.calledWith(`Error sending file: ${error.message}`)).to.be.true;
      }
    });
  });

  describe('getChatId', () => {
    it('should retrieve the chat ID for a Telegram chat', () => {
      const ctx = { chat: { id: 'testChatId' } };

      const chatId = getChatId(ctx);

      expect(chatId).to.equal('testChatId');
    });
  });

  describe('handleTelegramError', () => {
    it('should log the Telegram error', () => {
      const error = new Error('Telegram error');
      const logErrorStub = sandbox.stub(console, 'error');

      handleTelegramError(error);

      expect(logErrorStub.calledOnce).to.be.true;
      expect(logErrorStub.calledWith(`Error handling Telegram interaction: ${error.message}`)).to.be.true;
    });
  });
});