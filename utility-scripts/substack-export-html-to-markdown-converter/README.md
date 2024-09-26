 *Script created using Mistral AI.*
 
 # Substack HTML to Markdown converter for exported posts
This script converts HTML files from a Substack export into Markdown files and saves them in a folder named `substack-export-{current date}`. It's always smart to keep a backup of your content, but managing HTML files can be tricky. Since I use Obsidian for writing, having `.md` files makes it much easier to organize and manage my work.

## Requirements
- Python 3.x
- BeautifulSoup4
- Markdownify

## Installation
1. Install the required Python libraries:
```bash
pip install beautifulsoup4 markdownify
```

## Usage
- Place the script in the same directory as your HTML files.
- Run the script using the below command or just double click.
```bash
python substack-export-html-to-markdown-converter.py
```
## Script Explanation
The script performs the following steps:
- Creates a main folder named `substack-export-{current date}`.
- Iterates through all HTML files in the current directory.
- Parses each HTML file using BeautifulSoup.
- Converts the HTML content to Markdown using Markdownify.
- Extracts the post name from the HTML file name.
- Saves the Markdown content to a file named `{post_name}`.md in the main folder.
- All it takes is just a few seconds.

> Do this on a monthly basis just to reduce the chance of losing your content in case of any unexpected issues. [Read more](https://romio.substack.com/p/open-design-tools-data-ownership-portability).