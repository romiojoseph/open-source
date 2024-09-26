*This web-based tool was completely created using Mistral AI and Google AI Studio.*

> Please note that I don't have formal coding knowledge, so the structure, syntax, or best practices in the code might not be perfect. Every line was generated using language models.

# Telegram broadcaster deck
Telegram broadcaster deck is a simple web-based tool designed to manage multiple Telegram bots and channels, streamlining communication by sending messages, files, and polls. This tool is useful for individuals who need to manage multiple Telegram channels and bots efficiently. It is intended for local use only.

## Use cases and scenarios
- **Personal communication**: Efficiently manage personal messages, announcements, and updates across multiple Telegram channels.
- **Content creators**: Manage multiple channels and bots to engage with your audience effectively. Send reminders, updates, and polls related to personal events to keep attendees informed and engaged.
- **Promoting products/services**: Use the broadcaster to announce new product releases, sales, or special offers to your subscribers. Include buttons to your online store or landing pages.
- **Internal communication**: Share important announcements, updates, or reminders with your team or employees using a dedicated Telegram channel.
- **Sharing resources**: Distribute course materials, readings, or supplementary resources with direct links.
- **Breaking news alerts**: Deliver breaking news updates to your subscribers instantly.
- **Sharing articles and content**: Distribute links to news articles, videos, and other media content.

## Installation and setup
### 1. Clone the repository

### 2. File Structure

```bash
telegram-broadcaster-deck/
│
├── app.py
├── templates/
│   └── index.html
├── static/
│   ├── images/
│   │   └── favicon.png
│   ├── script.js
│   └── styles.css
├── .env
```
- `app.py`: The main application file containing the Flask routes and Telegram sending functions.
- `index.html`: The main HTML template for the tool.
- `script.js`: JavaScript file for handling client-side logic.
- `styles.css`: CSS file for styling the tool.
- `.env`: Environment variables file. Store your secret keys here.

### 3. Create a virtual environment and activate it
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```
These commands create and activate a virtual environment, which is a best practice to isolate project dependencies and avoid conflicts with other projects.

### 4. Install the dependencies
```bash
pip install Flask python-telegram-bot requests python-dotenv werkzeug
```
- Flask: Web framework for Python.
- `python-telegram-bot`: Telegram bot API wrapper.
- `requests`: HTTP library for Python.
- `python-dotenv`: Reads key-value pairs from a .env file and sets them as environment variables.
- `werkzeug`: WSGI web application library.

### 5. Create a .env file in the root directory and add your environment variables

```bash
FLASK_SECRET_KEY=your_strong_secret_key
BOT_TOKEN_MY_BOT_1=your_bot_token_1
CHANNEL_ID_MY_CHANNEL_1=your_channel_id_1
CHANNEL_USERNAME_MY_CHANNEL_1=your_channel_username_1
BOT_TOKEN_MY_BOT_2=your_bot_token_2
CHANNEL_ID_MY_CHANNEL_2=your_channel_id_2
CHANNEL_USERNAME_MY_CHANNEL_2=your_channel_username_2
```
- FLASK_SECRET_KEY: A secret key for Flask sessions.
- BOT_TOKEN_MY_BOT_1: The token for your first Telegram bot.
- CHANNEL_ID_MY_CHANNEL_1: The ID of your first Telegram channel.
- CHANNEL_USERNAME_MY_CHANNEL_1: The username of your first Telegram channel.
- BOT_TOKEN_MY_BOT_2: The token for your second Telegram bot.
- CHANNEL_ID_MY_CHANNEL_2: The ID of your second Telegram channel.
- CHANNEL_USERNAME_MY_CHANNEL_2: The username of your second Telegram channel.

> You can add more bots and channels as needed, following the same pattern. Also update that in the `app.py`. You can give a uniqe name there for usability. (Check the comment - # Load bot tokens, channel IDs, and channel usernames from environment variables 
)

### 6. Usage
- Run the application
```bash
python app.py
```
- You can see a local port in the terminal. Ctrl + click on it to open the tool in your browser.
- Select the bot and channel you want to use.
- Choose between sending a message or creating a poll.
- Fill in the required fields and submit the form.
    - For text messages: Enter your message in the text area. You can use [Markdown or HTML formatting](https://www.perplexity.ai/search/telegram-supported-markdown-fo-kPujVzSDQOevxSpuLRLK3A) and hashtags.
    - For files: Choose a file to upload and select the appropriate file type from the dropdown.
    - For polls: Fill in the poll question, options, and quiz settings (if applicable).

### 7. Important notes
- **Bot permissions**: Make sure your Telegram bot is an administrator in the channels you want to send messages to.

- **File size limits**: The application currently supports files up to 20MB. For larger files, consider using a file-sharing service and sending the link.

- **Security**: Never share your .env file or commit it to version control. It contains sensitive information.

- **Rate limits**: Be aware of Telegram's API rate limits. You might encounter errors if you send too many requests in a short time period.


```
Bot Token: For authenticating your bot with the Telegram API.

Channel ID: The exact "address" to send messages to your channel.

Channel Username: User-friendly names for display and for retrieving the channel ID.
```

_This README was partially generated with the assistance of AI._