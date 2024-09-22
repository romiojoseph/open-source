*Script created using Mistral AI and Google AI Studio.*

> I used the .js extension in the repository for syntax highlighting, but note that this is actually Google Apps Script code, which typically uses the .gs extension.

# Personal Telegram bot for saving links to Pocket (https://getpocket.com)
This script allows you to save links to Pocket via a Telegram bot. The bot will add any valid link sent to it to your Pocket account. You need to host it yourself in Google Apps Script. Alternatively, you can convert this code into some other format (like for eg; Python) and run it on your own server.

> **Limitations**: This script runs on Google Apps Script, which has certain limitations. Please refer to the [Google Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas#current_limitations) for more information.

## Requirement
- Basic knowledge of copying and pasting code.
- A Google account to run the script on Google Apps Script.
- A Telegram account and bot.
- A Pocket account.

## Setup Instructions

### Telegram
- Create a Telegram Bot. Open Telegram and search for the [BotFather](https://t.me/BotFather).
- Start a chat with BotFather and use the `/newbot` command to create a new bot.
- Follow the instructions to set up your bot and note down the bot token.

### Pocket
- Get Pocket API Credentials
- Go to the [Pocket Developer page](https://getpocket.com/developer/) and create a new application to get your Consumer Key. (Permissions: Add, Platforms: Web)

#### Using Postman to get access token
- I used [Postman](https://www.postman.com/) to get my access token. Sign up and follow the next step.
- Click on "New Request" button in the `Send an API request` section.
- Change `GET` to `POST`.
- Copy paste this url [https://getpocket.com/v3/oauth/request](https://getpocket.com/v3/oauth/request) in the URL input field.
- Under this section there are several tabs. Select "**Body**" and then select "**x-www-form-urlencoded**". Copy paste the following parameters.
- You can see a table, in the first row, add **consumer_key** as **Key** and **YOUR-CONSUMER-KEY** (which you got it from the pocket dev website) as **Value**
- Now in the second row, add **redirect_uri** as **Key** and **A valid redirect URI (e.g., https://www.google.com)** as **Value**.
- Hit send and you'll get `200 OK` and a code in the body section.
- The response will include a code (request token). Copy this code.
- Now open a new tab and let's construct the authorization URL.
```Bash
https://getpocket.com/auth/authorize?request_token=YOUR_REQUEST_TOKEN&redirect_uri=http://www.google.com
```
- Replace YOUR_REQUEST_TOKEN with the actual token (also known as "code") you obtained from the previous step.
- Press enter and you will be prompted to authorize your application. (Make sure you're signed in). Click `Authorize'.
- After authorizing, open a new postman page in the next tab.
- Click on "New Request" button in the `Send an API request` section.
- Change `GET` to `POST`.
- Copy paste this url [https://getpocket.com/v3/oauth/authorize](https://getpocket.com/v3/oauth/authorize) in the URL input field.
- Under this section there are several tabs. Select "**Body**" and then select "**x-www-form-urlencoded**".
- You can see a table, in the first row, add **consumer_key** as **Key** and **YOUR-CONSUMER-KEY** (which you got it from the pocket dev website) as **Value**
- Now in the second row, add **code** as **Key** and **the code** you receieved in the previous step as **Value**.
- Hit send and you'll get `200 OK` and an **access_token** in the body section.

> I struggled in this part because I was careless in selecting things and some additional spaces in the copy-paste. Just be careful here, that's all.

### Google App Script
- Go to https://script.google.com/
- Create a new project and delete all existing code.
- Copy paste the script.
- Replace all placeholders such as **YOUR-TELEGRAM-BOT-TOKEN**, **YOUR-CHAT-ID**, **CONSUMER-KEY**, **POCKET-ACCESS-TOKEN**, and **email**.
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
- Send an email notification to the specified email address (YOUR_EMAIL).

This ensures that you are aware of any unauthorized attempts to use the bot.