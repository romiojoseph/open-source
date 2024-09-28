*Extension created using Google AI Studio, Mistral AI, Meta AI and Perplexity.*

# Telegram bot API assistant

## Overview

The **Telegram Bot API Assistant** is a Chrome extension designed to simplify interactions with the [Telegram Bot API](https://core.telegram.org/bots/api) directly from your browser. With this extension, you can easily send messages, manage webhooks, get updates, and perform various other actions without manually formatting URLs each time. I have also listed general info, error codes, and HTTP status codes for your convenience.

> If you've explored the Telegram Bot API, you might have encountered many API endpoints and parameters. In this extension, I've included only these specific links, but you can add more by using any LLM. I hope it makes your interactions with the Telegram Bot API easier and more efficient!

## Features

### Messaging
1. **Send Message**
   - Send a text message to a specified chat.
   - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendMessage?chat_id=<CHAT_ID>&text=<MESSAGE_TEXT>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendMessage?chat_id=<CHAT_ID>&text=<MESSAGE_TEXT>)

2. **Send Photo**
   - Send a photo to a specified chat.
   - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendPhoto?chat_id=<CHAT_ID>&photo=<PHOTO_URL>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendPhoto?chat_id=<CHAT_ID>&photo=<PHOTO_URL>)

3. **Send Document**
   - Send a document file to a specified chat.
   - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendDocument?chat_id=<CHAT_ID>&document=<DOCUMENT_URL>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendDocument?chat_id=<CHAT_ID>&document=<DOCUMENT_URL>)

4. **Send Audio**
   - Send an audio file to a specified chat.
   - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendAudio?chat_id=<CHAT_ID>&audio=<AUDIO_URL>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendAudio?chat_id=<CHAT_ID>&audio=<AUDIO_URL>)

5. **Send Video**
   - Send a video file to a specified chat.
   - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendVideo?chat_id=<CHAT_ID>&video=<VIDEO_URL>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendVideo?chat_id=<CHAT_ID>&video=<VIDEO_URL>)

6. **Send Sticker**
   - Send a sticker to a specified chat.
   - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendSticker?chat_id=<CHAT_ID>&sticker=<STICKER_URL>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendSticker?chat_id=<CHAT_ID>&sticker=<STICKER_URL>)

7. **Forward Message**
   - Forward a message from one chat to another.
   - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/forwardMessage?chat_id=<CHAT_ID>&from_chat_id=<FROM_CHAT_ID>&message_id=<MESSAGE_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/forwardMessage?chat_id=<CHAT_ID>&from_chat_id=<FROM_CHAT_ID>&message_id=<MESSAGE_ID>)

8. **Edit Message Text**
   - Edit the text of an existing message in a chat.
   - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/editMessageText?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID>&text=<NEW_TEXT>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/editMessageText?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID>&text=<NEW_TEXT>)

### Webhook Management
9. **Set Webhook**
   - Set a webhook to receive updates via HTTP POST requests.
   - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/setWebhook?url=<YOUR_WEB_APP_URL>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/setWebhook?url=<YOUR_WEB_APP_URL>)

10. **Delete Webhook**
    - Remove the webhook, allowing you to receive updates via polling instead.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/deleteWebhook](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/deleteWebhook)

11. **Get Webhook Info**
    - Retrieve information about the current webhook, including URL and updates count.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getWebhookInfo](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getWebhookInfo)

### Bot Information
12. **Get Me**
    - Retrieve basic information about the bot, such as its username and ID.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getMe](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getMe)

### Chat Management
13. **Get Chat Members Count**
    - Retrieve the number of members in a chat, including bots.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getChatMembersCount?chat_id=<CHAT_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getChatMembersCount?chat_id=<CHAT_ID>)

14. **Kick Chat Member**
    - Remove a user from a chat.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/kickChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/kickChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>)

15. **Get Chat Member**
    - Retrieve information about a user in a chat.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>)

16. **Ban Chat Member**
    - Permanently ban a user from a chat.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/banChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/banChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>)

17. **Unban Chat Member**
    - Unban a previously banned user from a chat.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/unbanChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/unbanChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>)

18. **Get Group Members**
    - Retrieve a list of member objects in a group chat.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getGroupMembers?chat_id=<CHAT_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getGroupMembers?chat_id=<CHAT_ID>)

19. **Add Group Member**
    - Add a user to a group chat.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/addGroupMember?chat_id=<CHAT_ID>&user_id=<USER_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/addGroupMember?chat_id=<CHAT_ID>&user_id=<USER_ID>)

20. **Remove Group Member**
    - Remove a user from a group chat.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/removeGroupMember?chat_id=<CHAT_ID>&user_id=<USER_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/removeGroupMember?chat_id=<CHAT_ID>&user_id=<USER_ID>)

### Message Management
21. **Delete Message**
    - Delete a message from a chat.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/deleteMessage?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/deleteMessage?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID>)

22. **Pin Message**
    - Pin a message in a chat, making it visible to all members.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/pinMessage?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/pinMessage?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID>)

23. **Unpin Message**
    - Unpin a previously pinned message.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/unpinMessage?chat_id=<CHAT_ID>](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/unpinMessage?chat_id=<CHAT_ID>)

### Bot Management
24. **Log Out**
    - Log out the bot, revoking its authorization.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/logOut](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/logOut)

25. **Close**
    - Close the bot instance, stopping updates.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/close](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/close)

### Updates
26. **Get Updates**
    - Retrieve incoming updates (messages, commands, etc.) for your bot.
    - API URL: [https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getUpdates](https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getUpdates)


## Installation
1. Download the folder.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click the "Load unpacked" button and select the directory containing the extension files.
5. And go to the extension toolbar and pin it.
5. The extension should now be installed and ready to use.

## Usage
1. Click on the extension icon in the Chrome toolbar to open the popup.
2. Select the action you want to perform from the dropdown menu.
3. Fill in the required fields that appear based on the selected action (Make sure you used @ symbol in Chat ID).
4. Click the "Submit" button to execute the action.
5. The response from the Telegram Bot API will be displayed below the submit button.

## Use cases and scenarios

### Sending a Message
1. Select "Send Message" from the dropdown.
2. Enter your bot token, chat ID, and the message text.
3. Click "Submit" to send the message.

### Setting a Webhook
1. Select "Set Webhook" from the dropdown.
2. Enter your bot token and the URL of your web app.
3. Click "Submit" to set the webhook.

### Getting Updates
1. Select "Get Updates" from the dropdown.
2. Enter your bot token.
3. Click "Submit" to retrieve updates.

### Managing Chat Members
1. Select actions like "Kick Chat Member", "Ban Chat Member", etc., from the dropdown.
2. Enter your bot token, chat ID, and user ID.
3. Click "Submit" to perform the action.

### Get your IDs
1. Get Personal Chat ID:
    - Select "Send Message" from the dropdown.
    - Enter your bot token and any chat ID (e.g., your personal chat ID if you know it).
    - Send a message to yourself.
    - Use the "Get Updates" action to retrieve the updates and find your personal chat ID in the response.

2. Get Bot ID:
    - Select "Get Me" from the dropdown.
    - Enter your bot token.
    - Click "Submit" to retrieve the bot's information, including its ID.

3. Get Channel Chat ID:
    - Add your bot to the channel as an administrator.
    - Select "Send Message" from the dropdown.
    - Enter your bot token and send a message to the channel.
    - Use the "Get Updates" action to retrieve the updates and find the channel chat ID in the response.

## Why use this extension?
- **Efficiency**: Save time by avoiding the need to manually format URLs for each API call.
- **Convenience**: Perform multiple actions directly from your browser without switching between different tools or interfaces.
- **User-Friendly**: The extension provides a simple and intuitive interface for interacting with the Telegram Bot API.
- **Open in a new window**: You can multitask without worrying about the extension closing. Plus, it opens in a small window, making it easy to keep on the side while you work on other tasks.

## File Structure
- `manifest.json`: Defines the extension's metadata and permissions.
- `popup.html`: The HTML file for the extension's popup interface.
- `popup.js`: The JavaScript file that handles the logic for interacting with the Telegram Bot API.
- `styles.css`: The CSS file for styling the popup interface.
- `images/`: Directory containing the extension's icons and other images.
- `background.js`: Currently empty, but you can add any background tasks or event listeners here if needed.

> **API Key Security**: Keep your Telegram Bot API key secure. Never share it publicly or store it insecurely.

## Related tool
### Telegram broadcaster deck
Telegram broadcaster deck is a simple web-based tool designed to manage multiple Telegram bots and channels, streamlining communication by sending messages, files, and polls. This tool is useful for individuals who need to manage multiple Telegram channels and bots efficiently. It is intended for local use only.

<iframe src="https://github.com/romiojoseph/open-source-scripts/tree/main/telegram-bots/telegram-broadcaster-deck" frameborder="0" width="100%" height="500"></iframe>