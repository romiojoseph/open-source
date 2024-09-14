var TOKEN = 'YOUR_BOT_TOKEN'; // Replace with your actual bot token
var WEBHOOK_URL = 'YOUR_WEB_APP_URL'; // This will be set after deployment

// List of small words to exclude from capitalization in Title Case
var smallWords = ['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'in', 'on', 'at', 'by', 'with', 'from', 'under', 'above', 'over', 'through', 'during', 'including', 'he', 'she', 'it', 'they', 'them', 'their', 'its', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'as', 'at', 'to', 'into', 'onto', 'of', 'up', 'down', 'out', 'on', 'off', 'via'];

function setWebhook() {
  var url = 'https://api.telegram.org/bot' + TOKEN + '/setWebhook?url=' + WEBHOOK_URL;
  UrlFetchApp.fetch(url);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var message = data.message.text;
  var chatId = String(data.message.chat.id);
  
  // Check if the message is a command to set the case type
  if (message.startsWith('/')) {
    handleCommand(message, chatId);
  } else {
    // Process the text based on the user's selected case
    var userCase = getUserCase(chatId);
    if (!userCase) {
      sendMessage(chatId, 'Please select a case first.');
    } else {
      var result = convertText(message, userCase);
      sendMessage(chatId, result);
    }
  }
}

function handleCommand(command, chatId) {
  var userCase = command.substring(1); // Remove the '/' from the command
  if (['upper', 'lower', 'title', 'absolute', 'sentence', 'camel', 'pascal', 'snake', 'kebab'].includes(userCase)) {
    setUserCase(chatId, userCase);
    sendMessage(chatId, 'You have set the case to: ' + userCase);
  } else {
    sendMessage(chatId, 'Invalid command. Please select a valid case.');
  }
}

function getUserCase(chatId) {
  var userProperties = PropertiesService.getUserProperties();
  return userProperties.getProperty(chatId); // Return null if no case is set
}

function setUserCase(chatId, userCase) {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty(chatId, userCase);
}

function convertText(text, userCase) {
  switch (userCase) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return titleCase(text);
    case 'absolute':
      return absoluteTitleCase(text);
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'camel':
      return camelCase(text);
    case 'pascal':
      return pascalCase(text);
    case 'snake':
      return text.split(' ').join('_').toLowerCase();
    case 'kebab':
      return text.split(' ').join('-').toLowerCase();
    default:
      return 'Invalid case specified';
  }
}

function titleCase(text) {
  return text.split(' ').map(function(word) {
    return smallWords.includes(word.toLowerCase()) ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

function absoluteTitleCase(text) {
  return text.split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function camelCase(text) {
  var words = text.split(' ');
  return words[0].toLowerCase() + words.slice(1).map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

function pascalCase(text) {
  return text.split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

function sendMessage(chatId, text) {
  var url = 'https://api.telegram.org/bot' + TOKEN + '/sendMessage';
  var payload = {
    method: 'post',
    payload: {
      chat_id: chatId,
      text: text
    }
  };
  UrlFetchApp.fetch(url, payload);
}