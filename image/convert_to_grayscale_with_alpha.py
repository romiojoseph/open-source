import cv2
import os
import numpy as np
from PIL import Image

# Get the directory of the script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Supported image extensions
supported_extensions = ['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.tif', '.gif']

# Loop through each file in the directory
for filename in os.listdir(script_dir):
    # Check if the file has a supported image extension
    if any(filename.lower().endswith(ext) for ext in supported_extensions):
        file_path = os.path.join(script_dir, filename)

        # Open the image using Pillow to handle various formats
        pil_image = Image.open(file_path)

        # Convert the image to RGBA if it doesn't have an alpha channel
        if pil_image.mode != 'RGBA':
            pil_image = pil_image.convert('RGBA')

        # Convert the Pillow image to a NumPy array
        image = np.array(pil_image)

        # Split the image into RGB and alpha channels
        rgb_image = image[:, :, :3]
        alpha_channel = image[:, :, 3]

        # Convert the RGB image to grayscale
        gray_image = cv2.cvtColor(rgb_image, cv2.COLOR_BGR2GRAY)

        # Merge the grayscale image with the original alpha channel
        gray_image_with_alpha = np.dstack((gray_image, gray_image, gray_image, alpha_channel))

        # Save the grayscale image with transparency
        output_path = os.path.join(script_dir, 'gray_' + os.path.splitext(filename)[0] + '.png')
        success = cv2.imwrite(output_path, gray_image_with_alpha)

        if not success:
            print(f"Error: Unable to save image {output_path}")
        else:
            print(f"Successfully saved grayscale image with transparency: {output_path}")

print("Image processing completed.")

os.system("pause")