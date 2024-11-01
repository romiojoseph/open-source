# GitHub Folder Downloader

This script allows you to easily download a specific folder from a GitHub repository using sparse checkout. It prompts you for the necessary details, such as the target directory, repository URL, and folder path.

### Features

- **Interactive**: Prompts the user for input, making it easy to use.
- **Sparse Checkout**: Only downloads the specified folder instead of the entire repository, saving time and disk space.
### Prerequisites

- **Git**: Ensure that Git is installed on your system and added to your PATH.
- **Windows**: This script is designed for Windows systems.

### How to Use

1. **Download the Script**: Save the script as `github-folder-downloader.bat` (or your chosen name) in a directory of your choice.
2. Double click on it.
3. **Follow the Prompts**:
   - Enter the target directory where you want to download the folder.
   - Provide the GitHub repository URL.
   - Specify the path of the folder you want to download (e.g., `templates/blogspot`).

### Example

```plaintext
Enter the target directory where you want to download the folder (e.g., D:\New folder): D:\New folder
Enter the GitHub repository URL: https://github.com/romiojoseph/open-source.git
Enter the path of the folder to download (e.g., templates/blogspot): templates/blogspot
