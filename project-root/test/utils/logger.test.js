const { expect } = require('chai');
const { logError, logInfo, logDebug } = require('../../src/utils/logger');
const sinon = require('sinon');

describe('Logger', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('logError', () => {
    it('should log an error message with the error details', () => {
      const error = new Error('Test error');
      const logErrorStub = sandbox.stub(console, 'error');

      logError(error);

      expect(logErrorStub.calledOnce).to.be.true;
      expect(logErrorStub.calledWith(error.message, { stack: error.stack })).to.be.true;
    });
  });

  describe('logInfo', () => {
    it('should log an informational message', () => {
      const message = 'Test info message';
      const logInfoStub = sandbox.stub(console, 'info');

      logInfo(message);

      expect(logInfoStub.calledOnce).to.be.true;
      expect(logInfoStub.calledWith(message)).to.be.true;
    });
  });

  describe('logDebug', () => {
    it('should log a debug message', () => {
      const message = 'Test debug message';
      const logDebugStub = sandbox.stub(console, 'debug');

      logDebug(message);

      expect(logDebugStub.calledOnce).to.be.true;
      expect(logDebugStub.calledWith(message)).to.be.true;
    });
  });
});