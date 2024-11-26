_Script created using Mistral AI and Meta AI._
# Version control backup - Python script

Git feels overwhelming at times, though I know it's great. For my needs, I created a simple backup solution. It's straightforward and gives me full control.
#### Features 
 - **Versioned backups**: Creates versioned backups with major and minor versioning.
 - **Customizable backup folder**: Specify your own backup folder location.
 - **Logging**: Keeps a log of all backup operations in JSON format (Open it in VS Code or just use Notepad or change it to your own desired format by changing the script).
 - **User-friendly**: Provides clear and user-friendly messages for every step.
 - **Standby mode**: Allows you to stand by and continue backing up without restarting the script.
 - **Easy to startup:** Add the script directory to the `PATH` variable, then simply open a terminal and just run `backup_now`.

---
 
 **Ensure Python is Installed**: Make sure Python 3.x is installed on your system. You can download it from [python.org](https://www.python.org/).

---

#### Setup

- Save the Python script file `backup.py` in your usual folder where you save your utility scripts or just create new folder.
- Now either you come to this path and start a terminal every time or create a shortcut in the terminal by following the next steps (Windows, for Linux and Mac, create using any LLMs).

1. **Download the batch file**:
    - Ensure the `backup_now.bat` file is in the same directory as `backup.py`.
    - Replace the Python script path in the `backup_now.bat` file.

2. **Add the script directory to PATH**:
    - Open the System Properties dialog:
        - Press `Win + R`, type `sysdm.cpl`, and press Enter.
        - Go to the "Advanced" tab and click on "Environment Variables".
    - In the "Environment Variables" window:
        - Find the `Path` variable in the "System variables" section and select it.
        - Click "Edit".
        - Click "New" and add the path to your script directory (e.g., `E:\dev\staging\assets`).
        - Click "OK" to close all dialogs.

#### Usage

1. **Run the Script**: Open a new terminal and type `backup_now` to run the script.
2. **Follow the Prompts**:
    - The script will guide you through the backup process, asking for the project folder, backup folder, and backup message.
    - Choose between major and minor version changes.
    - The script will create a backup and log the details in a JSON file.
3. **Standby Mode**:
    - After completing a backup, the script will ask if you want to stand by or close.
    - In standby mode, you can continue to create backups without restarting the script.
#### Logging
- The script logs all backup details in a JSON file named `project-backup.json` in the project folder.
- The log includes the date, version, message, project folder path, backup folder path, and backup file name.
- This is the source of truth file. If you delete this file, then the script will consider that folder as new.

*If you delete the backup folder altogether, the script will ask for a new backup folder path, but then run as usual because of the JSON file.*