@echo off
setlocal

:: Ask the user for the target directory
set /p TARGET_DIR="Enter the target directory where you want to download the folder (e.g., D:\New folder): "

:: Ask the user for the GitHub repository URL
set /p REPO_URL="Enter the GitHub repository URL: "

:: Ask the user for the specific folder to download
set /p FOLDER_PATH="Enter the path of the folder to download (e.g., templates/blogspot): "

:: Change to the target directory
cd /d "%TARGET_DIR%" || (
    echo Failed to change to the target directory. Please check the path.
    exit /b
)

:: Clone the repository without checking out files
git clone --no-checkout "%REPO_URL%" temp_repo || (
    echo Failed to clone the repository. Please check the URL.
    exit /b
)

:: Navigate to the cloned repository directory
cd temp_repo || (
    echo Failed to change to the repository directory. Please check the repository structure.
    exit /b
)

:: Enable sparse checkout
git sparse-checkout init --cone

:: Specify the folder to download
git sparse-checkout set "%FOLDER_PATH%" || (
    echo Failed to set sparse checkout. Please check the folder path.
    exit /b
)

:: Checkout the main branch
git checkout main || (
    echo Failed to checkout the main branch. Please check your branch name.
    exit /b
)

:: Move the folder to the target directory
move "%FOLDER_PATH%" "%TARGET_DIR%" || (
    echo Failed to move the folder. Please check the folder path.
    exit /b
)

:: Go back to the target directory and remove the temporary repository
cd /d "%TARGET_DIR%"
rmdir /s /q temp_repo

echo Folder downloaded successfully to %TARGET_DIR%.
endlocal
