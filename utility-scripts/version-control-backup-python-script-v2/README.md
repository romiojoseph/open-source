_Script created using Google AI Studio, Claude and Mistral AI._

# Version control backup - Python script v2.0

Again, I created a simple backup solution. It includes features for selecting projects, calculating file hashes, detecting changes, and creating backup archives.
## Tips

- **Backup Log Viewer**: You can view your backup logs using the [Backup log viewer tool](https://romiojoseph.github.io/version-control-backup-log-viewer). It's a progressive web app! Please note that no data is sent anywhere—everything runs in your browser. (Heads up; you need to load the individual project JSON files, not the `backup_config.json`)
- **Cloud Sync**: Make sure your backup and script folders are synced with your cloud storage for extra safety.

## Features

- **Project folder management**: Allows you to add, select and remove multiple projects.
- **Change detection**: Detects added, modified, and deleted files by comparing file hashes.
- **Hash calculation**: The script uses SHA-1 hashes to detect changes in files and folders. It calculates individual file hashes and combined folder hashes to compare against stored hashes from previous backups.
- **Versioning**: Automatically calculates the next version number based on the type of change (minor or major).
- **Backup creation**: Creates a zip archive of the project folder and logs backup details.
- **Logging**: Maintains logs of backup operations for each project.

## Requirements

- Python 3.x
- `colorama` library (for colored terminal output)

You can install the required library using pip:

``` python
pip install colorama
```

## Usage

1. **Run the script:** Open a terminal in the script directory and type this command `python backup.py`
2. **Select a project**:
    - Choose an existing project from the list.
    - Enter a new project folder path if the project is not listed.
    - Remove a project from the configuration if needed.
3. **Backup folder**:
    - You will be prompted to enter a new backup folder path for each new projects, and if it's deleted in another run, it will be automatically created again.
4. **Change detection**:
    - The script will detect changes since the last backup.
5. **Backup creation**:
    - The script will create a zip archive of the project folder and log the backup details.
6. **Next actions**:
    - After creating a backup, you can choose to stand by or close the application.

## Configuration

The script uses a JSON configuration file (`backup_config.json`) to store project and backup folder paths. This file is automatically managed by the script.

## Logs

Backup logs for each project are stored in the `logs/projects` directory. Each project has its own log file (e.g., `project_name_log.json`). A log of deleted projects is saved to `logs/deleted.log`. Open it in any note editor or use the above mentioned tool.

## Error Handling

The script includes robust error handling for file operations, JSON loading/saving, and other potential issues. Errors are logged and displayed with colored output for better visibility.

## Add on

#### Setup
- Save the Python script file `backup.py` in your usual folder where you save your utility scripts or just create new folder.
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
3. **Usage:** Open a new terminal from anywhere and just type `backup_now` to run the script.

### Note

It’s a good practice to write clear and meaningful backup messages to help you easily understand the context of each version.

The `logs` folder will be created in the same directory as the Batch and Python scripts. Deleted logs are retained for safety and clarity. Ensure the script path stays synchronized with a secure cloud storage service using [**Syncthing**](https://syncthing.net) or any alternative of your choice.

While the script includes safeguards to prevent data loss, it is always a good practice to manually verify backups every now and then and ensure that important data is not accidentally deleted or overwritten.

If you have any concerns, **review the code using any LLMs** thoroughly to understand what it does. Ensure that it aligns with your expectations and does not perform any unwanted actions.

Before running the script on critical data, test it in a safe environment with non-essential data to ensure it behaves as expected.

Because this script was created with the help of LLMs, I used another LLM to review its safety. The following was its conclusion:

> *"The script appears to be designed with safety in mind, but it is always important to review and test any script before running it on critical data. Ensure you understand what the script does and trust the source of the code."*

*If you find any irregularities or errors, please let me know.*


