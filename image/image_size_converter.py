from PIL import Image
import os

def resize_image(image_path, sizes, output_format):
    image = Image.open(image_path)
    width, height = image.size
    
    # Check if image is square
    if width != height:
        print("Image is not square. Please use a 1:1 ratio image.")
        return
    
    # Get the file name and directory
    file_dir, file_name = os.path.split(image_path)
    file_name, file_ext = os.path.splitext(file_name)
    
    for size in sizes:
        resized_image = image.resize((size, size))
        # Save the resized image with the size in the file name and the specified output format
        resized_image.save(f"{file_dir}/{file_name}_{size}x{size}.{output_format}")

def main():
    image_path = input("Enter the image path: ")
    available_sizes = [
        8, 16, 24, 32, 40, 48, 64, 96, 128, 256, 512, 1024
    ]
    print("Available sizes:")
    for i, size in enumerate(available_sizes):
        print(f"{i+1}. {size}px")
    
    size_selection = input("Enter the size numbers (comma separated): ")
    selected_sizes = [available_sizes[int(i) - 1] for i in size_selection.split(",")]
    
    # Ask for the output format
    output_format = input("Enter the output format (e.g., png, jpg, webp): ")
    
    # Remove quotes from image path
    image_path = image_path.replace('"', '')
    
    resize_image(image_path, selected_sizes, output_format)

if __name__ == "__main__":
    main()

input("Press Enter to exit...")