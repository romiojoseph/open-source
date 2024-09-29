document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('action').addEventListener('change', function () {
        const action = this.value;
        const inputFields = document.getElementById('inputFields');
        const description = document.getElementById('description');
    
        inputFields.innerHTML = '';
        description.textContent = '';
    
        const fields = {
            getUpdates: {
                fields: ['Bot Token'],
                description: 'Retrieves incoming updates (messages, commands, etc.) for your bot. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getUpdates" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getUpdates</a>'
            },
            setWebhook: {
                fields: ['Bot Token', 'Web App URL'],
                description: 'Sets a webhook to receive updates via HTTP POST requests. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/setWebhook?url=<YOUR_WEB_APP_URL>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/setWebhook?url=<YOUR_WEB_APP_URL></a>'
            },
            deleteWebhook: {
                fields: ['Bot Token'],
                description: 'Removes the webhook, allowing you to receive updates via polling instead. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/deleteWebhook" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/deleteWebhook</a>'
            },
            getMe: {
                fields: ['Bot Token'],
                description: 'Returns basic information about the bot, such as its username, ID, etc. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getMe" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getMe</a>'
            },
            sendMessage: {
                fields: ['Bot Token', 'Chat ID', 'Message Text'],
                description: 'Sends a text message to a specified chat. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendMessage?chat_id=<CHAT_ID>&text=<MESSAGE_TEXT>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendMessage?chat_id=<CHAT_ID>&text=<MESSAGE_TEXT></a>'
            },
            sendPhoto: {
                fields: ['Bot Token', 'Chat ID', 'Photo URL'],
                description: 'Sends a photo to a specified chat. Specify photo file ID or URL. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendPhoto?chat_id=<CHAT_ID>&photo=<PHOTO_URL>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendPhoto?chat_id=<CHAT_ID>&photo=<PHOTO_URL></a>'
            },
            sendDocument: {
                fields: ['Bot Token', 'Chat ID', 'Document URL'],
                description: 'Sends a document file to a specified chat. Specify document file ID or URL. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendDocument?chat_id=<CHAT_ID>&document=<DOCUMENT_URL>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendDocument?chat_id=<CHAT_ID>&document=<DOCUMENT_URL></a>'
            },
            sendAudio: {
                fields: ['Bot Token', 'Chat ID', 'Audio URL'],
                description: 'Sends an audio file to a specified chat. Specify audio file ID or URL. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendAudio?chat_id=<CHAT_ID>&audio=<AUDIO_URL>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendAudio?chat_id=<CHAT_ID>&audio=<AUDIO_URL></a>'
            },
            sendVideo: {
                fields: ['Bot Token', 'Chat ID', 'Video URL'],
                description: 'Sends a video file to a specified chat. Specify video file ID or URL. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendVideo?chat_id=<CHAT_ID>&video=<VIDEO_URL>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendVideo?chat_id=<CHAT_ID>&video=<VIDEO_URL></a>'
            },
            sendSticker: {
                fields: ['Bot Token', 'Chat ID', 'Sticker URL'],
                description: 'Sends a sticker to a specified chat. Specify sticker file ID. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendSticker?chat_id=<CHAT_ID>&sticker=<STICKER_URL>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/sendSticker?chat_id=<CHAT_ID>&sticker=<STICKER_URL></a>'
            },
            forwardMessage: {
                fields: ['Bot Token', 'Chat ID (to)', 'From Chat ID', 'Message ID'],
                description: 'Forwards a message from one chat to another. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/forwardMessage?chat_id=<CHAT_ID>&from_chat_id=<FROM_CHAT_ID>&message_id=<MESSAGE_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/forwardMessage?chat_id=<CHAT_ID>&from_chat_id=<FROM_CHAT_ID>&message_id=<MESSAGE_ID></a>'
            },
            editMessageText: {
                fields: ['Bot Token', 'Chat ID', 'Message ID', 'New Text'],
                description: 'Edits the text of an existing message in a chat. Supports formatting options. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/editMessageText?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID>&text=<NEW_TEXT>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/editMessageText?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID>&text=<NEW_TEXT></a>'
            },
            getChatMembersCount: {
                fields: ['Bot Token', 'Chat ID'],
                description: 'Returns the number of members in a chat, including bots. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getChatMembersCount?chat_id=<CHAT_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getChatMembersCount?chat_id=<CHAT_ID></a>'
            },
            kickChatMember: {
                fields: ['Bot Token', 'Chat ID', 'User ID'],
                description: 'Removes a user from a chat (kicks them out). Specify chat ID and user ID. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/kickChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/kickChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID></a>'
            },
            getChatMember: {
                fields: ['Bot Token', 'Chat ID', 'User ID'],
                description: 'Retrieves information about a user in a chat, including user ID, status, and permissions. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID></a>'
            },
            banChatMember: {
                fields: ['Bot Token', 'Chat ID', 'User ID'],
                description: 'Permanently bans a user from a chat. Specify chat ID, user ID, and optional until date. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/banChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/banChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID></a>'
            },
            unbanChatMember: {
                fields: ['Bot Token', 'Chat ID', 'User ID'],
                description: 'Unbans a previously banned user from a chat. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/unbanChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/unbanChatMember?chat_id=<CHAT_ID>&user_id=<USER_ID></a>'
            },
            getGroupMembers: {
                fields: ['Bot Token', 'Chat ID'],
                description: 'Retrieves a list of member objects in a group chat. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getGroupMembers?chat_id=<CHAT_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getGroupMembers?chat_id=<CHAT_ID></a>'
            },
            addGroupMember: {
                fields: ['Bot Token', 'Chat ID', 'User ID'],
                description: 'Adds a user to a group chat. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/addGroupMember?chat_id=<CHAT_ID>&user_id=<USER_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/addGroupMember?chat_id=<CHAT_ID>&user_id=<USER_ID></a>'
            },
            removeGroupMember: {
                fields: ['Bot Token', 'Chat ID', 'User ID'],
                description: 'Removes a user from a group chat. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/removeGroupMember?chat_id=<CHAT_ID>&user_id=<USER_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/removeGroupMember?chat_id=<CHAT_ID>&user_id=<USER_ID></a>'
            },
            deleteMessage: {
                fields: ['Bot Token', 'Chat ID', 'Message ID'],
                description: 'Deletes a message from a chat. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/deleteMessage?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/deleteMessage?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID></a>'
            },
            pinMessage: {
                fields: ['Bot Token', 'Chat ID', 'Message ID'],
                description: 'Pins a message in a chat, making it visible to all members. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/pinMessage?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/pinMessage?chat_id=<CHAT_ID>&message_id=<MESSAGE_ID></a>'
            },
            unpinMessage: {
                fields: ['Bot Token', 'Chat ID'],
                description: 'Unpins a previously pinned message. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/unpinMessage?chat_id=<CHAT_ID>" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/unpinMessage?chat_id=<CHAT_ID></a>'
            },
            getWebhookInfo: {
                fields: ['Bot Token'],
                description: 'Returns information about the current webhook, including URL and updates count. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getWebhookInfo" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/getWebhookInfo</a>'
            },
            logOut: {
                fields: ['Bot Token'],
                description: 'Logs out the bot, revoking its authorization. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/logOut" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/logOut</a>'
            },
            close: {
                fields: ['Bot Token'],
                description: 'Closes the bot instance, stopping updates. API URL: <a href="https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/close" target="_blank">https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_API_KEY>/close</a>'
            }
        };
    
        if (fields[action]) {
            fields[action].fields.forEach(field => {
                const input = document.createElement('input');
                input.placeholder = field;
                input.id = field.replace(/\s+/g, '').toLowerCase();
                input.required = true;
                input.type = field === 'Bot Token' ? 'password' : 'text';
                input.className = 'input-field';
                inputFields.appendChild(input);
            });
    
            description.innerHTML = fields[action].description;
            document.getElementById('submitBtn').disabled = false;
        } else {
            document.getElementById('submitBtn').disabled = true;
        }
    });
    
    document.getElementById('submitBtn').addEventListener('click', async function () {
        const action = document.getElementById('action').value;
        const output = document.getElementById('output');
    
        const inputs = {};
        const fields = [...document.querySelectorAll('#inputFields input')];
    
        fields.forEach(field => {
            inputs[field.id] = field.value.trim();
            field.value = '';
        });
    
        let url, method = 'GET';
        switch (action) {
            case 'getUpdates':
                url = `https://api.telegram.org/bot${inputs.bottoken}/getUpdates`;
                break;
            case 'setWebhook':
                url = `https://api.telegram.org/bot${inputs.bottoken}/setWebhook?url=${encodeURIComponent(inputs.webappurl)}`;
                break;
            case 'deleteWebhook':
                url = `https://api.telegram.org/bot${inputs.bottoken}/deleteWebhook`;
                break;
            case 'getMe':
                url = `https://api.telegram.org/bot${inputs.bottoken}/getMe`;
                break;
            case 'sendMessage':
                url = `https://api.telegram.org/bot${inputs.bottoken}/sendMessage?chat_id=${inputs.chatid}&text=${encodeURIComponent(inputs.messagetext)}`;
                break;
            case 'sendPhoto':
                url = `https://api.telegram.org/bot${inputs.bottoken}/sendPhoto?chat_id=${inputs.chatid}&photo=${encodeURIComponent(inputs.photourl)}`;
                break;
            case 'sendDocument':
                url = `https://api.telegram.org/bot${inputs.bottoken}/sendDocument?chat_id=${inputs.chatid}&document=${encodeURIComponent(inputs.documenturl)}`;
                break;
            case 'sendAudio':
                url = `https://api.telegram.org/bot${inputs.bottoken}/sendAudio?chat_id=${inputs.chatid}&audio=${encodeURIComponent(inputs.audiourl)}`;
                break;
            case 'sendVideo':
                url = `https://api.telegram.org/bot${inputs.bottoken}/sendVideo?chat_id=${inputs.chatid}&video=${encodeURIComponent(inputs.videourl)}`;
                break;
            case 'sendSticker':
                url = `https://api.telegram.org/bot${inputs.bottoken}/sendSticker?chat_id=${inputs.chatid}&sticker=${encodeURIComponent(inputs.stickerurl)}`;
                break;
            case 'forwardMessage':
                url = `https://api.telegram.org/bot${inputs.bottoken}/forwardMessage?chat_id=${inputs.chatidto}&from_chat_id=${inputs.fromchatid}&message_id=${inputs.messageid}`;
                break;
            case 'editMessageText':
                url = `https://api.telegram.org/bot${inputs.bottoken}/editMessageText?chat_id=${inputs.chatid}&message_id=${inputs.messageid}&text=${encodeURIComponent(inputs.newtext)}`;
                break;
            case 'getChatMembersCount':
                url = `https://api.telegram.org/bot${inputs.bottoken}/getChatMembersCount?chat_id=${inputs.chatid}`;
                break;
            case 'kickChatMember':
                url = `https://api.telegram.org/bot${inputs.bottoken}/kickChatMember?chat_id=${inputs.chatid}&user_id=${inputs.userid}`;
                method = 'POST';
                break;
            case 'getChatMember':
                url = `https://api.telegram.org/bot${inputs.bottoken}/getChatMember?chat_id=${inputs.chatid}&user_id=${inputs.userid}`;
                break;
            case 'banChatMember':
                url = `https://api.telegram.org/bot${inputs.bottoken}/banChatMember?chat_id=${inputs.chatid}&user_id=${inputs.userid}`;
                method = 'POST';
                break;
            case 'unbanChatMember':
                url = `https://api.telegram.org/bot${inputs.bottoken}/unbanChatMember?chat_id=${inputs.chatid}&user_id=${inputs.userid}`;
                method = 'POST';
                break;
            case 'getGroupMembers':
                url = `https://api.telegram.org/bot${inputs.bottoken}/getGroupMembers?chat_id=${inputs.chatid}`;
                break;
            case 'addGroupMember':
                url = `https://api.telegram.org/bot${inputs.bottoken}/addGroupMember?chat_id=${inputs.chatid}&user_id=${inputs.userid}`;
                method = 'POST';
                break;
            case 'removeGroupMember':
                url = `https://api.telegram.org/bot${inputs.bottoken}/removeGroupMember?chat_id=${inputs.chatid}&user_id=${inputs.userid}`;
                method = 'POST';
                break;
            case 'deleteMessage':
                url = `https://api.telegram.org/bot${inputs.bottoken}/deleteMessage?chat_id=${inputs.chatid}&message_id=${inputs.messageid}`;
                method = 'POST';
                break;
            case 'pinMessage':
                url = `https://api.telegram.org/bot${inputs.bottoken}/pinMessage?chat_id=${inputs.chatid}&message_id=${inputs.messageid}`;
                method = 'POST';
                break;
            case 'unpinMessage':
                url = `https://api.telegram.org/bot${inputs.bottoken}/unpinMessage?chat_id=${inputs.chatid}`;
                method = 'POST';
                break;
            case 'getWebhookInfo':
                url = `https://api.telegram.org/bot${inputs.bottoken}/getWebhookInfo`;
                break;
            case 'logOut':
                url = `https://api.telegram.org/bot${inputs.bottoken}/logOut`;
                method = 'POST';
                break;
            case 'close':
                url = `https://api.telegram.org/bot${inputs.bottoken}/close`;
                method = 'POST';
                break;
        }
    
        try {
            const response = await fetch(url, { method });
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    
            const data = await response.json();
    
            let outputText = '';
    
            // Helper function to format key-value pairs (left-aligned)
            function formatKeyValuePairs(obj, indent = '') {
                let formattedText = '';
    
                for (const key in obj) {
                    const value = obj[key];
    
                    if (typeof value === 'object') {
                        formattedText += `\n${indent}${key}:\n`; // Add a line break before the key
                        formattedText += formatKeyValuePairs(value, indent + '  ');
                        formattedText += '\n'; // Add a line break after the nested object
                    } else {
                        formattedText += `${indent}${key}:  ${value}\n`;
                    }
                }
                return formattedText;
            }
    
            // **Instead of the switch statement, use this:**
            outputText = formatKeyValuePairs(data); // Format the entire JSON response
    
            output.textContent = outputText;
        } catch (error) {
            output.textContent = error.message || error.toString();
        }
    });
    
    
    // Get all accordion headers
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Add event listener to each header
    accordionHeaders.forEach((header) => {
        header.addEventListener('click', () => {
            // Get the corresponding content element
            const content = header.nextElementSibling;
    
            // Toggle the content visibility
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
    
            // Toggle the arrow icon
            header.querySelector('span').textContent = content.style.display === 'block' ? '▾' : '▸';
        });
    });
  });