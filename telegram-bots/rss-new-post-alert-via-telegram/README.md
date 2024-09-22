*Script created using Mistral AI, Perplexity and Google AI Studio.*

> I used the .js extension in the repository for syntax highlighting, but note that this is actually Google Apps Script code, which typically uses the .gs extension.

# Personal Telegram bot for sending RSS feed updates to a Telegram channel
This script allows you to fetch RSS feeds, check for new posts, and send them to a Telegram channel. The script uses Google Apps Script to handle the RSS feed fetching, Telegram messaging, and Google Sheets for tracking sent posts. 

> This script runs on Google Apps Script, which has certain limitations. Please refer to the [Google Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas#current_limitations) for more information. Alternatively, you can convert this code into some other format (like for eg; Python) and run it on your own server.

## Requirement
- Basic knowledge of copying and pasting code.
- A Google account to run the script on Google Apps Script.
- A Telegram account, a channel and a bot.
- A Google Sheets document to track Feed URLs and Sent Posts.

## Setup Instructions

### Telegram
- Create a Telegram Bot. Open Telegram and search for the [BotFather](https://t.me/BotFather).
- Start a chat with BotFather and use the `/newbot` command to create a new bot.
- Follow the instructions to set up your bot and note down the bot token.
- Create a public Telegram channel. Add the above bot to this channel and promote as Administrator and give necessary permissions.
- Now we need to find the Chat ID of this channel. To do that we have to construct a URL
```Bash
https://api.telegram.org/bot<YourBotToken>/sendMessage?chat_id=@<YourChannelUsername>&text=Hello, this is a test message from my bot!
```
- Replace `<YourBotToken>` and `<YourChannelUsername>`. Make sure @ is included and hit enter.
- You'll get a response, enable pretty print and find the Chat ID, it will be something like **-1002212341234**
- Now you can either keep the channel as public or make it private.

### Google Sheets
- Create a new Google Sheets document.
- Create two pages named **Feed URLs** and **Sent Posts**.
- In the Feed URLs sheet, list the RSS feed URLs you want to monitor in the first column, from A2 onwards (Assuming A1 will be a header).
- In the Sent Posts sheet, the script will automatically populate the sent posts with the date, link, and title.
- Now go to Extensions > App Script
- Delete any code in the script editor.
- Copy and paste the script provided into the script editor.
- Replace the placeholders with your actual credentials: **TELEGRAM-BOT-TOKEN** and **CHANNEL-CHAT-ID**.
- Save the project with a suitable name.
- No need to deploy but we have to set up Time-Driven Triggers.
- Run the `createTimeDrivenTriggers` function once to set up the triggers. This will ensure that the script runs twice a day at 8 AM and 8 PM.
- You can test the script by running the `main` function.

