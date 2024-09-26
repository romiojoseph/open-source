import os
import pathlib
from datetime import datetime
from bs4 import BeautifulSoup
import markdownify

# Create main export folder
main_folder_name = f"substack-export-{datetime.now().strftime('%Y-%m-%d')}"
main_folder = pathlib.Path(main_folder_name)
main_folder.mkdir(exist_ok=True)

# Process each HTML file
for html_file in pathlib.Path().glob('*.html'):
    # Parse HTML
    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    # Convert to markdown
    md_content = markdownify.markdownify(str(soup), heading_style="ATX")

    # Get post name and create markdown file
    post_name = html_file.stem.split('.')[1]
    md_file = main_folder / f"{post_name}.md"
    with open(md_file, 'w', encoding='utf-8') as f:
        f.write(md_content)

print("Conversion completed!")