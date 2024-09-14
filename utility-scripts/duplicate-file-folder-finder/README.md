*Script created using Google AI Studio and Perplexity.*

# Duplicate file and folder finder using a Python script
This script finds duplicate files and folders in a specified directory.
## Installation
To run this script, you'll need Python installed on your system. Additionally, you'll need to install the following dependencies:
```Bash
pip install hashlib
```
## Usage
- Run the script.
- Select the scan location
- Select what to scan
## Output
The script will print out the duplicate files and folders found. If you choose to save the results to a file, they will be saved in a file named `duplicate-file-list.txt`.
### Functions
- `get_file_hash(file_path)`: Calculates the SHA-256 hash of a file.
- `find_duplicate_files(root_dir)`: Finds duplicate files in a directory and its subdirectories.
- `get_folder_hash(folder_path)`: Calculates the SHA-256 hash of a folder's contents.
- `find_duplicate_folders(root_dir)`: Finds duplicate folders in a directory and its subdirectories.
- `main()`: The main function that runs the script.
## Notes
- The script uses the SHA-256 hash algorithm to identify duplicates.
- The script considers files with the same hash value as duplicates.
- The script considers folders with the same hash value as duplicates.
- The script saves the results to a file if chosen by the user.