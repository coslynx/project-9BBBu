# Spotify FLAC Telegram Bot

This Node.js Telegram bot allows users to search for songs on Spotify, download them in FLAC format, and have them delivered directly to a designated Telegram channel.

## Features

* **Song Search:** Users can search for songs by title or artist name.
* **FLAC Download:** The bot downloads the requested song in FLAC format from Spotify.
* **Telegram Delivery:** The downloaded FLAC file is sent to the specified Telegram channel.
* **Error Handling:** Robust error handling mechanisms are in place to prevent crashes and ensure smooth operation.
* **User-Friendly Interface:** Users interact with the bot using simple Telegram commands.

## Getting Started

**1. Prerequisites:**

* Node.js and npm (or yarn) installed on your system.

**2. Setup:**

* **Clone the repository:**
  ```bash
  git clone https://github.com/your-username/spotify-flac-telegram-bot.git
  ```
* **Navigate to the project directory:**
  ```bash
  cd spotify-flac-telegram-bot
  ```
* **Install dependencies:**
  ```bash
  npm install
  ```

**3. Configuration:**

* Create a `.env` file in the `config` directory and add the following environment variables:
  * `TELEGRAM_BOT_TOKEN`: Your Telegram bot token.
  * `SPOTIFY_CLIENT_ID`: Your Spotify API client ID.
  * `SPOTIFY_CLIENT_SECRET`: Your Spotify API client secret.
  * `TELEGRAM_CHANNEL_ID`: The ID of the Telegram channel where downloaded files will be sent.

**4. Running the bot:**

* Start the bot:
  ```bash
  npm start
  ```

**5. Usage:**

* Send the `/start` command to the bot to receive instructions.
* Use the `/search` command followed by the song title or artist name to search for a song.
  * Example: `/search Imagine Dragons"
* Use the `/download` command followed by the Spotify URL of the song to download it.
  * Example: `/download https://open.spotify.com/track/1R017X66vS333tP1Kz0w9I`
* Use the `/help` command to see a list of available commands.

## Deployment

* **Heroku:**
  1. Create a Heroku account and install the Heroku CLI.
  2. Log in to Heroku: `heroku login`
  3. Create a new Heroku app: `heroku create spotify-flac-telegram-bot`
  4. Set environment variables on Heroku:
    * `heroku config:set TELEGRAM_BOT_TOKEN=your_telegram_bot_token`
    * `heroku config:set SPOTIFY_CLIENT_ID=your_spotify_client_id`
    * `heroku config:set SPOTIFY_CLIENT_SECRET=your_spotify_client_secret`
    * `heroku config:set TELEGRAM_CHANNEL_ID=your_telegram_channel_id`
  5. Push your code to the Heroku repository:
    * `git push heroku master`
  6. Start the bot on Heroku:
    * `heroku open`
* **AWS:**
  1. Create an AWS account and set up an EC2 instance.
  2. Install Node.js and npm on the EC2 instance.
  3. Clone the repository to the EC2 instance.
  4. Install dependencies: `npm install`
  5. Configure environment variables in the `.env` file on the EC2 instance.
  6. Start the bot: `npm start`

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License.