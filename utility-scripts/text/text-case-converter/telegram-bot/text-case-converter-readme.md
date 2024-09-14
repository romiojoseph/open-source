_Script created using Meta AI._

**Important Notes:**
- I'm a non-coder learning through LLMs! I use language models to generate scripts that meet my needs, and I'm sharing them as open-source resources.
- Please keep in mind that I don't have formal coding knowledge, so the code structure, syntax, or best practices might not be optimal or conventional.
- I appreciate any feedback, suggestions, or contributions from experienced coders to improve these scripts and make them more efficient, readable, and maintainable.

---
# Text Converter Bot

**Important:** This bot will only work if the script is running on your PC. If you want the bot to be available 24/7, you will need to host the script on a server or use a cloud-based service.
## Description
This python script (Text Converter Telegram Bot) transforms text into various cases and formats, including uppercase, lowercase, title case, sentence case, camel case, pascal case, snake case, and kebab case.
## Usage
- Download the `TextConverterBot.py` file.
- Create a Telegram bot using [BotFather](https://t.me/BotFather) and obtain the API token
- Replace `TOKEN` in the script with your bot's API token
- Run the script using `python TextConverterBot.py` or double click on it
- Interact with the bot using Telegram
- The bot will respond with the converted text in the selected style
## Requirements
- Operating system
- PowerShell or any terminal (comes pre-installed on most modern Windows systems)
- Python 3.x download and install Python from the official website: [https://www.python.org/downloads](https://www.python.org/downloads)
- `python-telegram-bot` library (install with `pip install python-telegram-bot`)

## Supported Transformations
### Case Conversions
- **UPPERCASE**: Converts text to ALL UPPERCASE LETTERS
- **lowercase**: converts text to all lowercase letters
- **Title Case**: Converts text to Title Case, capitalizing the first letter of each word (with exceptions for small words like "a", "an", etc.)
- **Absolute Title Case**: Converts text to Absolute Title Case, capitalizing the first letter of each word without exceptions
### Sentence and Word Formats
- **Sentence case**: Converts text to Sentence case, capitalizing the first letter of each sentence
- **camelCase**: Converts text to camelCase, capitalizing the first letter of each word except the first word
- **PascalCase**: Converts text to PascalCase, capitalizing the first letter of each word
## Special Formats
- **snake_case**: Converts text to snake_case, separating words with underscores (_)
- **kebab-case**: Converts text to kebab-case, separating words with hyphens (-)
## Other
##### What is pip?
pip is the package installer for Python. It allows you to easily install, update, and manage additional libraries and dependencies that are not part of the Python standard library.
Think of pip like an app store for Python packages. Just as you'd use an app store to download and install apps on your phone, you use pip to download and install Python packages (like python-chess) that can enhance your Python experience.

- Type `python -m ensurepip` and press Enter
- If pip is already installed, you'll see a message saying it's already up-to-date
