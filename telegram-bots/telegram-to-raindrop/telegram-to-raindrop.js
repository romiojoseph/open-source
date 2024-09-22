// Replace with your Telegram Bot Token
var telegramBotToken = 'YOUR-TELEGRAM-BOT-TOKEN'; 

// Replace with your Raindrop.io Test Token
var raindropTestToken = 'RAINDROP-TEST-TOKEN'; 

// Replace with your Telegram Chat ID 
var authorizedChatId = 'YOUR-CHAT-ID'; 

// Replace with your Raindrop.io Collection ID
var raindropCollectionId = 'COLLECTION-ID'; 

function doPost(e) {
  // Parse Telegram webhook data
  var update = JSON.parse(e.postData.contents);

  // Check if it's a message
  if (update.message && update.message.text) {
    var chatId = update.message.chat.id;
    var messageText = update.message.text;

    // Authorize user (check if it's your chat ID)
    if (chatId == authorizedChatId) { 
      // Extract link from message (assuming it's the entire message)
      var linkToSave = messageText;

      // Save link to Raindrop.io
      saveLinkToRaindrop(linkToSave);

    } else {
      // Send unauthorized message
      sendMessage(chatId, "You are not authorized to use this bot.");
    }
  }
}


function saveLinkToRaindrop(link) {
  // Prepare Raindrop.io API request data 
  var data = {
    "link": link,
    "collectionId": raindropCollectionId 
  };

  // Make API request to Raindrop.io (using Test token)
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Bearer ' + raindropTestToken
    },
    'payload': JSON.stringify(data)
  };

  // Try to save the link and handle potential errors
  try {
    var response = UrlFetchApp.fetch('https://api.raindrop.io/rest/v1/raindrop', options);
    // Check the response status code
    if (response.getResponseCode() === 200) {
      sendMessage(authorizedChatId, "Link saved to Raindrop.io");
    } else {
      Logger.log("Error saving link: " + response.getContentText());
      sendMessage(authorizedChatId, "Error saving link. Please check the logs.");
    }
  } catch (error) {
    // If there's an error, log it and send an error message to Telegram
    Logger.log("Error saving link: " + error);
    sendMessage(authorizedChatId, "Error saving link. Please check the logs.");
  }
}


function getCollectionName(collectionId) {
  var options = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + raindropTestToken
    }
  };
  var response = UrlFetchApp.fetch('https://api.raindrop.io/rest/v1/collections', options);
  var collections = JSON.parse(response.getContentText()).items;

  for (var i = 0; i < collections.length; i++) {
    if (collections[i]._id == collectionId) {
      return collections[i].title;
    }
  }
  return "Collection not found";
}


function sendMessage(chatId, message) {
  // Send message to Telegram
  var url = 'https://api.telegram.org/bot' + telegramBotToken + '/sendMessage';
  var payload = {
    'chat_id': chatId,
    'text': message
  };
  UrlFetchApp.fetch(url, {'method': 'post', 'payload': payload});
}


// Set up webhook (run this function once to set up the webhook)
function setWebhook() {
  var url = 'https://script.google.com/macros/s/' + ScriptApp.getScriptId() + '/exec';
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramBotToken + '/setWebhook?url=' + url);
  Logger.log(response);
}