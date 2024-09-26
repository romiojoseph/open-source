import asyncio
import os
import requests
from flask import Flask, render_template, request, flash, jsonify, redirect, url_for
from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.error import TelegramError
from werkzeug.debug import DebuggedApplication
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import logging
import math
import time

logging.basicConfig(level=logging.INFO)

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY')

# Load bot tokens, channel IDs, and channel usernames from environment variables 
bot_tokens = {
    "My Bot 1": os.getenv('BOT_TOKEN_MY_BOT_1'),
    "My Bot 2": os.getenv('BOT_TOKEN_MY_BOT_2'),
    # ... add more bots ...
}

channel_ids = {
    "My Channel 1": os.getenv('CHANNEL_ID_MY_CHANNEL_1'),
    "My Channel 2": os.getenv('CHANNEL_ID_MY_CHANNEL_2'),
    # ... add more channels ...
}

channel_usernames = {
    "My Channel 1": os.getenv('CHANNEL_USERNAME_MY_CHANNEL_1'),
    "My Channel 2": os.getenv('CHANNEL_USERNAME_MY_CHANNEL_2'),
    # ... add more channels ...
}

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'doc', 'xlsx', 'mp3', 'wav', 'ogg', 'mp4', 'mkv', 'csv', 'txt', 'zip', '7z'}
MAX_FILE_SIZE = 20 * 1024 * 1024

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Telegram Sending Functions (All modified to accept reply_markup) ---

async def send_message_with_timeout(bot, chat_id, text, parse_mode, reply_markup=None, timeout=120):
    try:
        await asyncio.wait_for(bot.send_message(chat_id=chat_id, text=text, parse_mode=parse_mode, reply_markup=reply_markup), timeout=timeout)
    except asyncio.TimeoutError:
        raise TelegramError("Request timed out")

async def send_document_with_timeout(bot, chat_id, document_path, caption, parse_mode, reply_markup=None, timeout=120):
    try:
        with open(document_path, 'rb') as f:
            await asyncio.wait_for(bot.send_document(chat_id=chat_id, document=f, caption=caption, parse_mode=parse_mode, reply_markup=reply_markup), timeout=timeout)
    except asyncio.TimeoutError:
        raise TelegramError("Request timed out")

async def send_photo_with_timeout(bot, chat_id, photo_path, caption, parse_mode, reply_markup=None, timeout=120):
    try:
        with open(photo_path, 'rb') as f:
            await asyncio.wait_for(bot.send_photo(chat_id=chat_id, photo=f, caption=caption, parse_mode=parse_mode, reply_markup=reply_markup), timeout=timeout)
    except asyncio.TimeoutError:
        raise TelegramError("Request timed out")

async def send_video_with_timeout(bot, chat_id, video_path, caption, parse_mode, reply_markup=None, timeout=120):
    try:
        with open(video_path, 'rb') as f:
            await asyncio.wait_for(bot.send_video(chat_id=chat_id, video=f, caption=caption, parse_mode=parse_mode, reply_markup=reply_markup), timeout=timeout)
    except asyncio.TimeoutError:
        raise TelegramError("Request timed out")

async def send_audio_with_timeout(bot, chat_id, audio_path, caption, parse_mode, reply_markup=None, timeout=120):
    try:
        with open(audio_path, 'rb') as f:
            await asyncio.wait_for(bot.send_audio(chat_id=chat_id, audio=f, caption=caption, parse_mode=parse_mode, reply_markup=reply_markup), timeout=timeout)
    except asyncio.TimeoutError:
        raise TelegramError("Request timed out")

async def send_poll_with_timeout(bot, chat_id, question, options, type="regular", is_anonymous=True, allows_multiple_answers=False, close_date=None, correct_option_id=None, explanation=None, timeout=120):
    try:
        await asyncio.wait_for(bot.send_poll(
            chat_id=chat_id,
            question=question,
            options=options,
            type=type,
            is_anonymous=is_anonymous,
            allows_multiple_answers=allows_multiple_answers,
            close_date=close_date,
            correct_option_id=correct_option_id,
            explanation=explanation
        ), timeout=timeout)
    except asyncio.TimeoutError:
        raise TelegramError("Request timed out")

async def send_large_file_with_timeout(bot, chat_id, file_path, caption, parse_mode, reply_markup=None, timeout=120):
    try:
        file_size = os.path.getsize(file_path)
        chunk_size = 524288 
        num_chunks = math.ceil(file_size / chunk_size)

        with open(file_path, 'rb') as f:
            for i in range(num_chunks):
                offset = i * chunk_size
                data = f.read(chunk_size)

                if i == 0: 
                    await asyncio.wait_for(bot.send_document(
                        chat_id=chat_id,
                        document=data,
                        filename=os.path.basename(file_path),
                        caption=caption,
                        parse_mode=parse_mode,
                        reply_markup=reply_markup 
                    ), timeout=timeout)
                else: 
                    await asyncio.wait_for(bot.send_document(
                        chat_id=chat_id,
                        document=data
                    ), timeout=timeout)

    except asyncio.TimeoutError:
        raise TelegramError("Request timed out")
    except Exception as e:
        raise TelegramError(f"Error sending file: {e}")

# --- Flask Routes ---

@app.route("/", methods=["GET", "POST"])
async def index():
    if request.method == "POST":
        selected_bot = request.form.get("selected_bot")
        selected_channel = request.form.get("selected_channel")
        message_text = request.form.get("message_text")
        button_name = request.form.get("button_name")
        button_url = request.form.get("button_url")
        parse_mode = request.form.get("parse_mode")
        file = request.files.get("file")
        file_type = request.form.get("file_type")
        poll_question = request.form.get("poll_question")
        poll_options = request.form.getlist("poll_options[]")
        poll_type = request.form.get("poll_type")
        allows_multiple_answers = request.form.get("allows_multiple_answers") is not None
        close_date_selection = int(request.form.get("close_date")) if request.form.get("close_date") else None
        correct_option_id = int(request.form.get("correct_option_id")) if request.form.get("correct_option_id") else None
        explanation = request.form.get("explanation")

        poll_selected_bot = request.form.get("poll_selected_bot")
        poll_selected_channel = request.form.get("poll_selected_channel")

        if poll_question and poll_options:
            selected_bot = poll_selected_bot
            selected_channel = poll_selected_channel

        bot_token = bot_tokens.get(selected_bot)
        channel_id = channel_ids.get(selected_channel)

        if not bot_token or not channel_id:
            flash("Invalid bot or channel selection!", "error")
            return render_template("index.html", bot_tokens=bot_tokens, channel_ids=channel_ids, channel_usernames=channel_usernames)

        try:
            bot = Bot(token=bot_token)

            if poll_question and poll_options:
                if close_date_selection > 0:
                    close_date = int(time.time()) + close_date_selection
                else:
                    close_date = None
                poll_params = {
                    "question": poll_question,
                    "options": poll_options,
                    "type": poll_type,
                    "is_anonymous": True,
                    "allows_multiple_answers": allows_multiple_answers,
                    "close_date": close_date
                }
                if poll_type == "quiz":
                    if correct_option_id is not None:
                        poll_params["correct_option_id"] = correct_option_id
                    if explanation:
                        poll_params["explanation"] = explanation
                await send_poll_with_timeout(bot, channel_id, **poll_params)
                flash("Poll sent successfully!", "success")

            reply_markup = None
            if button_name and button_url:
                reply_markup = InlineKeyboardMarkup(
                    [[InlineKeyboardButton(text=button_name, url=button_url)]]
                )

            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)

                if file.content_length > 20 * 1024 * 1024:
                    await send_large_file_with_timeout(bot, channel_id, file_path, message_text, parse_mode, reply_markup=reply_markup)
                elif file_type == "image":
                    await send_photo_with_timeout(bot, channel_id, file_path, message_text, parse_mode, reply_markup=reply_markup)
                elif file_type == "video":
                    await send_video_with_timeout(bot, channel_id, file_path, message_text, parse_mode, reply_markup=reply_markup)
                elif file_type == "audio":
                    await send_audio_with_timeout(bot, channel_id, file_path, message_text, parse_mode, reply_markup=reply_markup)
                else:
                    await send_document_with_timeout(bot, channel_id, file_path, message_text, parse_mode, reply_markup=reply_markup)

                os.remove(file_path)
                flash("File sent successfully!", "success")

            elif message_text:
                await send_message_with_timeout(bot, channel_id, message_text, parse_mode, reply_markup=reply_markup)
                flash("Message sent successfully!", "success")

        except TelegramError as e:
            flash(f"Error sending message: {e}", "error")

        return redirect(url_for('index'))

    return render_template("index.html", bot_tokens=bot_tokens, channel_ids=channel_ids, channel_usernames=channel_usernames)


@app.route("/get_channel_id", methods=["POST"])
async def get_channel_id():
    selected_bot = request.form.get("selected_bot")
    selected_channel_username = request.form.get("selected_channel_username")

    bot_token = bot_tokens.get(selected_bot)
    channel_username = channel_usernames.get(selected_channel_username)

    if not bot_token or not channel_username:
        return jsonify({"error": "Invalid bot or channel username selection!"}), 400

    try:
        response = requests.get(
            f"https://api.telegram.org/bot{bot_token}/sendMessage?chat_id=@{channel_username}&text=Hello, this is a test message from my bot!")
        response_data = response.json()

        logging.info(f"Response data: {response_data}")

        if response_data.get("ok"):
            return jsonify(response_data["result"])
        else:
            return jsonify({"error": "Failed to get chat ID"}), 500
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.config['UPLOAD_FOLDER'] = 'uploads'
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.wsgi_app = DebuggedApplication(app.wsgi_app, evalex=True)
    app.run(debug=True, threaded=True)