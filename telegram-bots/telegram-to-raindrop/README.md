*Script created using Meta AI and Google AI Studio.*

> I used the .js extension in the repository for syntax highlighting, but note that this is actually Google Apps Script code, which typically uses the .gs extension.

# Personal Telegram bot for saving links to Raindrop.io
This script allows you to save links to Raindrop.io via a Telegram bot. The bot will add any valid link sent to it to your specified Raindrop.io collection. You need to host it yourself in Google Apps Script. Alternatively, you can convert this code into some other format (like for eg; Python) and run it on your own server.

## Requirement
- Basic knowledge of copying and pasting code.
- A Google account to run the script on Google Apps Script.
- A Telegram account and bot.
- A Raindrop.io account.

## Setup Instructions
### Telegram
- Create a Telegram Bot. Open Telegram and search for the [BotFather](https://t.me/BotFather).
- Start a chat with BotFather and use the `/newbot` command to create a new bot.
- Follow the instructions to set up your bot and note down the bot token.

### Get Raindrop.io API Credentials
- Go to the [Raindrop.io Integrations page](https://app.raindrop.io/settings/integrations) and create a new application to get your Test Token.

>**Note:** This script is intended for personal use only. Therefore, we only need to collect the Test token. This simplifies the process and avoids the need for additional authentication steps.
- Note down your Test Token and Collection ID.
- To get Collection ID, create a collection in Raindrop and look at the address bar. It's something like `https://app.raindrop.io/my/12345678`. We just need that number only.

### Google App Script
- Go to https://script.google.com/
- Create a new project and delete all existing code.
- Copy paste the script.
- Replace all placeholders such as **YOUR-TELEGRAM-BOT-TOKEN**, **YOUR-CHAT-ID**, **TESTRAINDROP-TEST-TOKEN**, and **COLLECTION-ID**.
- Save the script
- Deploy the Script as web app. (Deploy > New > Execute as Me > Access to Anyone).
- Copy the Script URL
- Open a new tab and construct the URL. This is to set up Webhook for Telegram Bot
```Bash
https://api.telegram.org/botYOUR-TELEGRAM-BOT-TOKEN/setWebhook?url=YOUR-WEB-APP-URL
```
- Replace `YOUR-TELEGRAM-BOT-TOKEN` with your bot token from Botfather and `YOUR-WEB-APP-URL` with the Script URL you copied earlier.
- Hit enter and you can see that Webhook is now set.
- Go to your Telegram bot and send a valid URL.

## Handling Unauthorized Access
The script includes a mechanism to handle unauthorized access attempts. If a message is received from a chat ID that does not match the authorized TELEGRAM_CHAT_ID, the bot will:

- Send a message to the authorized chat ID notifying about the unauthorized access attempt.

This ensures that you are aware of any unauthorized attempts to use the bot.