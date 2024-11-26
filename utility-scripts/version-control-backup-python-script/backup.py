import os
import shutil
import json
import logging
from typing import Dict
import datetime

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')

def get_greeting() -> str:
    """Return a greeting based on the current time."""
    current_hour = datetime.datetime.now().hour
    if 5 <= current_hour < 12:
        return "Good morning!"
    elif 12 <= current_hour < 18:
        return "Good afternoon!"
    else:
        return "Good evening!"

def create_backup(project_folder: str, backup_folder: str, version: str) -> str:
    """Create a backup of the project folder."""
    backup_file = os.path.join(backup_folder, f"{os.path.basename(project_folder)}_backup_{version}.zip")
    try:
        shutil.make_archive(base_name=backup_file.replace('.zip', ''), format='zip', root_dir=project_folder)
        return backup_file
    except Exception as e:
        logging.error(f"Error creating backup: {e}")
        return None

def log_backup(log_file: str, version: str, backup_details: Dict[str, str]) -> None:
    """Log backup details to the specified log file."""
    try:
        with open(log_file, 'r') as file:
            logs = json.load(file)
    except FileNotFoundError:
        logs = {}
    logs[version] = backup_details
    with open(log_file, 'w') as file:
        json.dump(logs, file, indent=4)

def get_next_version(last_version: str, change_type: str) -> str:
    """Get the next version based on the last version and change type."""
    # Remove the leading 'v' from the version string
    last_version = last_version.lstrip('v')

    major, minor = map(int, last_version.split('.'))
    if change_type == "major":
        major += 1
        minor = 0
    elif change_type == "minor":
        minor += 1
    return f"v{major}.{minor}"

def get_backup_message() -> str:
    """Prompt the user to enter a backup message and ensure it is not empty."""
    while True:
        backup_message = input("Please enter a backup message: ")
        if backup_message.strip():
            return backup_message
        else:
            print("Backup message cannot be empty. Please enter a valid message.")

def main() -> None:
    print(get_greeting())
    project_folder = None

    while True:
        if project_folder is None:
            project_folder = input("Please enter the path to the project folder: ")
        else:
            print(f"Current project folder: {project_folder}")
            print("1. Use the same project folder")
            print("2. Enter a new project folder")
            while True:
                choice = input("Please select an option (1/2): ")
                if choice == "1":
                    break
                elif choice == "2":
                    project_folder = input("Please enter the path to the project folder: ")
                    break
                else:
                    print("Invalid option. Please try again.")

        if not os.path.exists(project_folder):
            logging.error(f"Error: The project folder '{project_folder}' does not exist.")
            continue

        log_file = os.path.join(project_folder, 'project-backup.json')

        if not os.path.exists(log_file):
            version = "v1.0"
            backup_message = get_backup_message()
        else:
            with open(log_file, 'r') as file:
                logs = json.load(file)
            last_version = list(logs.keys())[-1]
            print("1. Major change")
            print("2. Minor change")
            while True:
                change_type = input("Please select the type of change (1/2): ").lower()
                if change_type == "1":
                    change_type = "major"
                    break
                elif change_type == "2":
                    change_type = "minor"
                    break
                else:
                    print("Invalid option. Please try again.")
            version = get_next_version(last_version, change_type)
            backup_message = get_backup_message()

        backup_folder = None
        if os.path.exists(log_file):
            with open(log_file, 'r') as file:
                logs = json.load(file)
                last_log = logs[last_version]
                backup_folder = last_log.get("backup_folder")

        if not backup_folder or not os.path.exists(backup_folder):
            backup_folder = input("Please enter a new path for the backup folder: ")
            if not os.path.exists(backup_folder):
                os.makedirs(backup_folder)

        backup_file = create_backup(project_folder, backup_folder, version)
        if backup_file:
            backup_details = {
                "date": datetime.datetime.now().strftime("%d %b %Y, %I:%M:%S %p"),
                "message": backup_message,
                "project_folder": project_folder,
                "backup_folder": backup_folder,
                "backup_file": os.path.basename(backup_file)
            }
            log_backup(log_file, version, backup_details)
            print(f"Backup successful! Version: {version}")
            print(f"Backup file: {backup_file}")
            print(f"Logs updated: {log_file}")
        else:
            print("Backup failed.")

        print("\nWhat would you like to do next?")
        print("1. Standby")
        print("2. Close")

        while True:
            choice = input("Please select an option (1/2): ")
            if choice == "1":
                print("Standing by...")
                break
            elif choice == "2":
                print("Closing...")
                print("Just a heads-up to back up your files now and then, and make sure your backup folder is syncing with your cloud storage.")
                print()
                return
            else:
                print("Invalid option. Please try again.")

if __name__ == "__main__":
    main()
