const { expect } = require('chai');
const { getSpotifyClient, searchSong, getSongDownloadURL, handleSpotifyError } = require('../../src/utils/spotify');
const Spotify = require('node-spotify-api');
const sinon = require('sinon');
const dotenv = require('dotenv');

describe('Spotify Utils', () => {
  let sandbox;
  let spotifyClientStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dotenv.config();
    spotifyClientStub = sandbox.stub(Spotify, 'Spotify').returns({
      search: sinon.stub().resolves({
        tracks: {
          items: [{
            id: 'testSongId',
            name: 'Test Song',
            artists: [{ name: 'Test Artist' }],
            album: { name: 'Test Album' },
            external_urls: { spotify: 'testDownloadURL' },
          }],
        },
      }),
      getTrack: sinon.stub().resolves({
        external_urls: { spotify: 'testDownloadURL' },
      }),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getSpotifyClient', () => {
    it('should return the Spotify API client', () => {
      const spotifyClient = getSpotifyClient();
      expect(spotifyClientStub.calledOnce).to.be.true;
      expect(spotifyClientStub.calledWith({
        id: process.env.SPOTIFY_CLIENT_ID,
        secret: process.env.SPOTIFY_CLIENT_SECRET,
      })).to.be.true;
      expect(spotifyClient).to.deep.equal(spotifyClientStub.returnValues[0]);
    });
  });

  describe('searchSong', () => {
    it('should search for a song and return the first result', async () => {
      const query = 'Test Song';
      const result = await searchSong(query);
      expect(spotifyClientStub.returnValues[0].search.calledOnce).to.be.true;
      expect(spotifyClientStub.returnValues[0].search.calledWith({
        type: 'track',
        query,
      })).to.be.true;
      expect(result).to.deep.equal({
        id: 'testSongId',
        name: 'Test Song',
        artists: [{ name: 'Test Artist' }],
        album: { name: 'Test Album' },
        external_urls: { spotify: 'testDownloadURL' },
      });
    });

    it('should handle errors during search', async () => {
      spotifyClientStub.returnValues[0].search.rejects(new Error('Search failed'));
      const query = 'Test Song';
      const result = await searchSong(query);
      expect(spotifyClientStub.returnValues[0].search.calledOnce).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe('getSongDownloadURL', () => {
    it('should retrieve the download URL for a song', async () => {
      const songId = 'testSongId';
      const downloadURL = await getSongDownloadURL(songId);
      expect(spotifyClientStub.returnValues[0].getTrack.calledOnce).to.be.true;
      expect(spotifyClientStub.returnValues[0].getTrack.calledWith(songId)).to.be.true;
      expect(downloadURL).to.equal('testDownloadURL');
    });

    it('should handle errors during download URL retrieval', async () => {
      spotifyClientStub.returnValues[0].getTrack.rejects(new Error('Download URL retrieval failed'));
      const songId = 'testSongId';
      const downloadURL = await getSongDownloadURL(songId);
      expect(spotifyClientStub.returnValues[0].getTrack.calledOnce).to.be.true;
      expect(downloadURL).to.be.null;
    });
  });

  describe('handleSpotifyError', () => {
    it('should log the Spotify error', () => {
      const error = new Error('Spotify error');
      const logErrorStub = sandbox.stub(console, 'error');
      handleSpotifyError(error);
      expect(logErrorStub.calledOnce).to.be.true;
      expect(logErrorStub.calledWith(`Error interacting with Spotify API: ${error.message}`)).to.be.true;
    });
  });
});