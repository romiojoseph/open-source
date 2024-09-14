*Script created using Meta AI.*

# Image grayscale converter
This script processes images in the same directory, converting them to grayscale while preserving transparency. It supports various image formats, including PNG, JPG, JPEG, BMP, TIFF, and GIF.
## Dependencies
To run this script, you need to install the following dependencies:
- OpenCV (cv2)
- Pillow (PIL)
- NumPy (np)

You can install these dependencies using pip:

```Bash
pip install opencv-python pillow numpy
```

## Usage
- Place the script in the same directory as the images you want to process.
- Run the script using Python.
- The script will generate grayscale versions of the images with transparency, prefixed with "gray_" and saved in the same directory.
## Script Explanation
- Retrieves the directory of the script.
- Loops through each file in the directory, checking for supported image extensions.
- Converts the RGB image to grayscale using OpenCV.
- Saves the resulting image as a PNG file.
## Output
The script prints the path of each successfully saved image and indicates if any errors occur during the saving process. Once completed, it displays "Image processing completed."