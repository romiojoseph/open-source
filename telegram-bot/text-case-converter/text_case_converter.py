import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Enable logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# Replace 'YOUR_BOT_TOKEN' with the token you received from BotFather
TOKEN = 'YOUR_BOT_TOKEN'

# List of small words to exclude from capitalization in Title Case
small_words = ['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'in', 'on', 'at', 'by', 'with', 'from', 'under', 'above', 'over', 'through', 'during', 'including', 'he', 'she', 'it', 'they', 'them', 'their', 'its', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'as', 'at', 'to', 'into', 'onto', 'of', 'up', 'down', 'out', 'on', 'off', 'via']

async def upper(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Enter the text to convert to UPPERCASE:')
    context.user_data['case'] = 'upper'
    context.user_data.pop('original_message', None)

async def lower(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Enter the text to convert to lowercase:')
    context.user_data['case'] = 'lower'
    context.user_data.pop('original_message', None)

async def title(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Enter the text to convert to Title Case:')
    context.user_data['case'] = 'title'
    context.user_data.pop('original_message', None)

async def absolute(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Enter the text to convert to Absolute Title Case:')
    context.user_data['case'] = 'absolute'
    context.user_data.pop('original_message', None)

async def sentence(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Enter the text to convert to Sentence case:')
    context.user_data['case'] = 'sentence'
    context.user_data.pop('original_message', None)

async def camel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Enter the text to convert to camelCase:')
    context.user_data['case'] = 'camel'
    context.user_data.pop('original_message', None)

async def pascal(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Enter the text to convert to PascalCase:')
    context.user_data['case'] = 'pascal'
    context.user_data.pop('original_message', None)

async def snake(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Enter the text to convert to snake_case:')
    context.user_data['case'] = 'snake'
    context.user_data.pop('original_message', None)

async def kebab(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Enter the text to convert to kebab-case:')
    context.user_data['case'] = 'kebab'
    context.user_data.pop('original_message', None)

async def convert_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    text = update.message.text
    case = context.user_data.get('case')

    if case:
        if case == 'upper':
            result = text.upper()
        elif case == 'lower':
            result = text.lower()
        elif case == 'title':
            words = text.split()
            result = ' '.join(word if word.lower() in small_words else word.capitalize() for word in words)
        elif case == 'absolute':
            result = ' '.join(word.capitalize() for word in text.split())
        elif case == 'sentence':
            result = text.capitalize()
        elif case == 'camel':
            words = text.split()
            result = words[0].lower() + ''.join(word.capitalize() for word in words[1:])
        elif case == 'pascal':
            result = ''.join(word.capitalize() for word in text.split())
        elif case == 'snake':
            result = '_'.join(text.split()).lower()
        elif case == 'kebab':
            result = '-'.join(text.split()).lower()

        context.user_data['original_message'] = update.message
        await update.message.reply_text(result)
    else:
        await update.message.reply_text('Please select a case first.')

def main() -> None:
    application = Application.builder().token(TOKEN).build()

    application.add_handler(CommandHandler("upper", upper))
    application.add_handler(CommandHandler("lower", lower))
    application.add_handler(CommandHandler("title", title))
    application.add_handler(CommandHandler("absolute", absolute))
    application.add_handler(CommandHandler("sentence", sentence))
    application.add_handler(CommandHandler("camel", camel))
    application.add_handler(CommandHandler("pascal", pascal))
    application.add_handler(CommandHandler("snake", snake))
    application.add_handler(CommandHandler("kebab", kebab))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, convert_text))

    application.run_polling()

if __name__ == '__main__':
    main()