var TELEGRAM_BOT_TOKEN = 'YOUR-TELEGRAM-BOT-TOKEN';
var TELEGRAM_CHAT_ID = 'YOUR-CHAT-ID';
var POCKET_CONSUMER_KEY = 'CONSUMER-KEY';
var POCKET_ACCESS_TOKEN = 'POCKET-ACCESS-TOKEN';
var YOUR_EMAIL = 'username@email.com';

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var chatId = data.message.chat.id;
  var text = data.message.text;

  Logger.log('Incoming chat ID: ' + chatId);
  Logger.log('Incoming message: ' + text);

  if (chatId == TELEGRAM_CHAT_ID) {
    if (text.startsWith('http')) {
      addToPocket(text);
      sendMessage("Link added to Pocket!");
    } else {
      sendMessage("Please send a valid link.");
    }
  } else {
    sendMessage("You are not authorized to use this bot.");
    sendUnauthorizedNotification(chatId, text);
  }
}

function sendMessage(message) {
  var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
  var options = {
    'method': 'post',
    'payload': {
      'chat_id': TELEGRAM_CHAT_ID,
      'text': message
    }
  };
  UrlFetchApp.fetch(url, options);
}

function addToPocket(link) {
  Logger.log('Adding link to Pocket: ' + link);
  var url = 'https://getpocket.com/v3/add';
  var options = {
    'method': 'post',
    'payload': {
      'consumer_key': POCKET_CONSUMER_KEY,
      'access_token': POCKET_ACCESS_TOKEN,
      'url': link
    }
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log('Pocket API response: ' + response.getContentText());
}

function sendUnauthorizedNotification(chatId, text) {
  var message = 'Unauthorized access attempt from chat ID: ' + chatId + '\nMessage: ' + text;
  sendMessage(message);
  sendEmailNotification(message);
}

function sendEmailNotification(message) {
  var subject = 'Unauthorized Access Attempt';
  MailApp.sendEmail(YOUR_EMAIL, subject, message);
}