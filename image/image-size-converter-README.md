*Script created using Meta AI.*

# Image resizer script
This script resizes a given image to specified sizes while maintaining the aspect ratio (Only supports 1:1). It supports various output formats and provides a simple command-line interface.
## Dependencies
- Python 3.x
- Pillow library (install using `pip install pillow`)
## Usage
- Save this script as `image_resizer.py`.
- Run the script using `python image_resizer.py` or simply double click.
- Enter the image path (including extension, not just the folder path) when prompted.
- Select the desired sizes from the available options.
- Enter the output format (e.g., png, jpg, webp).
## Available Sizes
The script provides the following sizes:
- 8px
- 16px
- 24px
- 32px
- 40px
- 48px
- 64px
- 96px
- 128px
- 256px
- 512px
- 1024px
## Output
- The resized images will be saved in the same directory as the original image, with the size appended to the file name.
## Note
- The script checks if the image is square (1:1 ratio). If not, it prints an error message and exits.
- The script removes any quotes from the input image path.