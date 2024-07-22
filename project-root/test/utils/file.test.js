const { expect } = require('chai');
const { downloadFile, encodeToFLAC, handleFileError } = require('../../src/utils/file');
const axios = require('axios');
const fs = require('fs');
const sinon = require('sinon');

describe('File Utils', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('downloadFile', () => {
    it('should download a file successfully', async () => {
      const url = 'https://example.com/test.txt';
      const filePath = 'test.txt';
      const response = {
        data: {
          pipe: sinon.stub(),
        },
      };
      const axiosStub = sandbox.stub(axios, 'get').resolves(response);
      const createWriteStreamStub = sandbox.stub(fs, 'createWriteStream').returns({
        on: sinon.stub(),
      });

      await downloadFile(url, filePath);

      expect(axiosStub.calledOnce).to.be.true;
      expect(axiosStub.calledWith(url, { responseType: 'stream' })).to.be.true;
      expect(createWriteStreamStub.calledOnce).to.be.true;
      expect(createWriteStreamStub.calledWith(filePath)).to.be.true;
      expect(response.data.pipe.calledOnce).to.be.true;
    });

    it('should handle errors during download', async () => {
      const url = 'https://example.com/test.txt';
      const filePath = 'test.txt';
      const error = new Error('Download failed');
      const axiosStub = sandbox.stub(axios, 'get').rejects(error);

      try {
        await downloadFile(url, filePath);
        expect.fail('Error should have been thrown');
      } catch (err) {
        expect(err).to.equal(error);
        expect(axiosStub.calledOnce).to.be.true;
        expect(axiosStub.calledWith(url, { responseType: 'stream' })).to.be.true;
      }
    });
  });

  describe('encodeToFLAC', () => {
    it('should encode the file to FLAC format (stubbed)', async () => {
      const filePath = 'test.mp3';
      const flacStub = sandbox.stub().resolves();

      await encodeToFLAC(filePath);

      expect(flacStub.calledOnce).to.be.true;
      expect(flacStub.calledWith(filePath)).to.be.true;
    });
  });

  describe('handleFileError', () => {
    it('should log the file error', () => {
      const error = new Error('File error');
      const logErrorStub = sandbox.stub(console, 'error');

      handleFileError(error);

      expect(logErrorStub.calledOnce).to.be.true;
      expect(logErrorStub.calledWith(`Error handling file: ${error.message}`)).to.be.true;
    });
  });
});