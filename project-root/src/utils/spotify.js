const Spotify = require('node-spotify-api');
const { logError } = require('./logger');
const dotenv = require('dotenv');

dotenv.config();

const spotifyClient = new Spotify({
  id: process.env.SPOTIFY_CLIENT_ID,
  secret: process.env.SPOTIFY_CLIENT_SECRET,
});

const getSpotifyClient = () => spotifyClient;

const searchSong = async (query) => {
  try {
    const searchResults = await spotifyClient.search({
      type: 'track',
      query,
    });
    return searchResults.tracks.items[0];
  } catch (error) {
    handleSpotifyError(error);
    return null;
  }
};

const getSongDownloadURL = async (songId) => {
  try {
    const track = await spotifyClient.getTrack(songId);
    return track.external_urls.spotify;
  } catch (error) {
    handleSpotifyError(error);
    return null;
  }
};

const handleSpotifyError = (error) => {
  logError(`Error interacting with Spotify API: ${error.message}`);
};

module.exports = {
  getSpotifyClient,
  searchSong,
  getSongDownloadURL,
};