// Placeholders for your Telegram Bot Token and Chat ID
const TELEGRAM_BOT_TOKEN = 'TELEGRAM-BOT-TOKEN';
const TELEGRAM_CHAT_ID = 'CHANNEL-CHAT-ID';

// Google Sheet details
const FEED_URLS_SHEET = 'Feed URLs';
const SENT_POSTS_SHEET = 'Sent Posts';

function fetchRSSFeed(url) {
  try {
    const response = UrlFetchApp.fetch(url);
    const contentType = response.getHeaders()['Content-Type'][0];

    if (contentType.includes('application/json')) {
      // JSON feed
      const json = JSON.parse(response.getContentText());
      const posts = json.entries.map(entry => ({
        title: entry.title,
        link: entry.link
      }));
      return posts;
    } else {
      // XML feed (Atom or RSS)
      const xml = response.getContentText();
      const document = XmlService.parse(xml);
      const root = document.getRootElement();

      let posts = [];
      if (root.getName() === 'feed') {
        // Atom feed
        const namespace = XmlService.getNamespace('http://www.w3.org/2005/Atom');
        const entries = root.getChildren('entry', namespace);
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const title = entry.getChild('title', namespace).getText();
          const link = entry.getChild('link', namespace).getAttribute('href').getValue();
          posts.push({ title, link });
        }
      } else if (root.getName() === 'rss') {
        // RSS feed
        const channel = root.getChild('channel');
        const items = channel.getChildren('item');
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const title = item.getChild('title').getText();
          const link = item.getChild('link').getText();
          posts.push({ title, link });
        }
      } else {
        Logger.log(`Unknown feed format for URL: ${url}`);
      }

      return posts;
    }
  } catch (error) {
    Logger.log(`Error fetching feed from ${url}: ${error.message}`);
    return [];
  }
}

function sendMessageToTelegram(title, link) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const options = {
    method: 'post',
    payload: {
      chat_id: TELEGRAM_CHAT_ID,
      text: `${title}\nRead more: ${link}`
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();

  if (responseCode === 429) {
    const retryAfter = JSON.parse(response.getContentText()).parameters.retry_after;
    Utilities.sleep(retryAfter * 1000);
    sendMessageToTelegram(title, link);
  } else if (responseCode !== 200) {
    Logger.log(`Failed to send message: ${response.getContentText()}`);
  }
}

function getFeedUrls() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(FEED_URLS_SHEET);
  const data = sheet.getDataRange().getValues();
  const feedUrls = data.slice(1).map(row => row[0]); // Assuming feed URLs are in the first column
  return feedUrls;
}

function getSentPosts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SENT_POSTS_SHEET);
  const data = sheet.getDataRange().getValues();
  const sentPosts = data.slice(1).map(row => row[1]); // Assuming links are in the second column
  return sentPosts;
}

function updateSentPosts(posts) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SENT_POSTS_SHEET);
  const data = sheet.getDataRange().getValues();
  let lastRow = data.length + 1;

  posts.forEach(post => {
    sheet.getRange(lastRow, 1).setValue(new Date());
    sheet.getRange(lastRow, 2).setValue(post.link);
    sheet.getRange(lastRow, 3).setValue(post.title);
    lastRow++;
  });
}

function cleanupOldPosts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SENT_POSTS_SHEET);
  const data = sheet.getDataRange().getValues();
  const now = new Date();
  const oneHundredEightyDaysAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  for (let i = data.length - 1; i >= 0; i--) {
    const date = new Date(data[i][0]);
    if (date < oneHundredEightyDaysAgo) {
      sheet.deleteRow(i + 1);
    }
  }
}

function main() {
  const feedUrls = getFeedUrls();
  const sentPosts = getSentPosts();
  const newPosts = [];

  feedUrls.forEach(url => {
    Logger.log(`Processing feed URL: ${url}`);
    const posts = fetchRSSFeed(url);
    Logger.log(`Found ${posts.length} posts for feed URL: ${url}`);
    if (posts.length > 0) {
      const mostRecentPost = posts[0];
      if (!sentPosts.includes(mostRecentPost.link)) {
        newPosts.push(mostRecentPost);
        Logger.log(`New post found: ${mostRecentPost.title}`);
      } else {
        Logger.log(`Post already sent: ${mostRecentPost.title}`);
      }
    } else {
      Logger.log(`No new posts found for feed URL: ${url}`);
    }
  });

  newPosts.forEach(post => {
    sendMessageToTelegram(post.title, post.link);
    Utilities.sleep(1000); // Add a delay between messages to avoid rate limiting
  });

  if (newPosts.length > 0) {
    updateSentPosts(newPosts);
  }

  cleanupOldPosts();
}

function createTimeDrivenTriggers() {
  ScriptApp.newTrigger('main')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  ScriptApp.newTrigger('main')
    .timeBased()
    .everyDays(1)
    .atHour(20)
    .create();
}