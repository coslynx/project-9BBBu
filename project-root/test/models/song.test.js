const { expect } = require('chai');
const Song = require('../../src/models/song');

describe('Song Model', () => {
  describe('constructor', () => {
    it('should initialize the song object with the correct properties', () => {
      const title = 'Test Song';
      const artist = 'Test Artist';
      const album = 'Test Album';
      const downloadURL = 'testDownloadURL';

      const song = new Song(title, artist, album, downloadURL);

      expect(song.title).to.equal(title);
      expect(song.artist).to.equal(artist);
      expect(song.album).to.equal(album);
      expect(song.downloadURL).to.equal(downloadURL);
    });
  });
});