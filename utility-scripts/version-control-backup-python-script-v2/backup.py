import os
import shutil
import json
import logging
import hashlib
from typing import Dict, Optional, Any
import datetime
from colorama import init, Fore, Style
import sys

init()  # Initialize colorama

# --- Constants and Configuration ---
LOGS_FOLDER = 'logs'
PROJECTS_FOLDER = os.path.join(LOGS_FOLDER, 'projects')
CONFIG_FILE = os.path.join(LOGS_FOLDER, 'backup_config.json')
EXCLUDED_PATHS = {'logs', '__pycache__', '.git', '.pytest_cache'}
DELETED_LOG_FILE = os.path.join(LOGS_FOLDER, 'deleted.log')

# --- Color Constants ---
QUESTION_COLOR = Fore.YELLOW
CHOICE_COLOR = Fore.CYAN
RESET_COLOR = Style.RESET_ALL
FILE_COLOR = Fore.GREEN
ERROR_COLOR = Fore.RED

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')

# --- Helper Functions ---
def _ensure_directories() -> None:
    """Ensures that the logs and projects directories exist."""
    os.makedirs(LOGS_FOLDER, exist_ok=True)
    os.makedirs(PROJECTS_FOLDER, exist_ok=True)

def handle_file_operation_error(operation: str, path: str, error: Exception) -> None:
    """Handles file operation errors with proper messaging."""
    error_msg = f"Error during {operation} at {path}: {error}"
    logging.error(error_msg)
    print(f"\n{ERROR_COLOR}Error: {error_msg}{RESET_COLOR}\n")
    print(f"{ERROR_COLOR}Please check file permissions and try again.{RESET_COLOR}\n")

def safe_file_operation(operation: callable, *args, **kwargs) -> Optional[Any]:
    """Safely executes file operations with error handling."""
    try:
        return operation(*args, **kwargs)
    except (IOError, OSError, PermissionError) as e:
        handle_file_operation_error(operation.__name__, args[0] if args else "", e)
        return None

def load_json(file_path: str) -> Dict:
    """Loads JSON data from a file, handling common errors."""
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                return json.load(file)
        return {}
    except json.JSONDecodeError as e:
        logging.error(f"Invalid JSON in {file_path}: {e}")
        print(f"\n{ERROR_COLOR}Error: Invalid JSON format in {file_path}.{RESET_COLOR}\n")
    except Exception as e:
        handle_file_operation_error("loading JSON", file_path, e)
    return {}

def save_json(file_path: str, data: Dict) -> bool:
    """Saves JSON data to a file, handling common errors."""
    try:
        with open(file_path, 'w') as file:
            json.dump(data, file, indent=4)
        return True
    except Exception as e:
        handle_file_operation_error("saving JSON", file_path, e)
        return False

def load_config() -> Dict:
    """Loads the configuration data."""
    return load_json(CONFIG_FILE)

def save_config(config: Dict) -> bool:
    """Saves the configuration data."""
    return save_json(CONFIG_FILE, config)

def load_project_logs(project_name: str) -> Dict:
    """Loads backup logs for a specific project."""
    project_log_file = os.path.join(PROJECTS_FOLDER, f"{project_name}_log.json")
    return load_json(project_log_file)

def save_project_logs(project_name: str, logs: Dict) -> None:
    """Saves backup logs for a specific project."""
    project_log_file = os.path.join(PROJECTS_FOLDER, f"{project_name}_log.json")
    save_json(project_log_file, logs)

def get_greeting() -> str:
    """Returns a time-appropriate greeting."""
    current_hour = datetime.datetime.now().hour
    if 5 <= current_hour < 12:
        return "Good morning!"
    elif 12 <= current_hour < 18:
        return "Good afternoon!"
    else:
        return "Good evening!"

def get_last_version(project_logs: Dict) -> str:
    """Gets the last version number from project logs."""
    versions = [
        v.replace("backup_", "")
        for v in project_logs.keys()
        if v.startswith("backup_v")
    ]
    return max(versions, key=lambda x: [int(n) for n in x.lstrip('v').split('.')]) if versions else "v1.0"

def get_next_version(last_version: str, change_type: Optional[str] = None) -> str:
    """Calculates the next version number based on the last version and change type."""
    try:
        major, minor = map(int, last_version.lstrip('v').split('.'))

        if change_type is None:
            print(f"\n{QUESTION_COLOR}Select the type of change:{RESET_COLOR}")
            print(f"{CHOICE_COLOR}1. Minor change (v{major}.{minor} → v{major}.{minor + 1})")
            print(f"2. Major change (v{major}.{minor} → v{major + 1}.0){RESET_COLOR}")
            while True:
                choice = input(f"\n{QUESTION_COLOR}Enter your choice (1/2): {RESET_COLOR}")
                if choice in ("1", "2"):
                    change_type = "minor" if choice == "1" else "major"
                    break
                print("Invalid choice. Please try again.")

        if change_type == "major":
            major += 1
            minor = 0
        elif change_type == "minor":
            minor += 1

        return f"v{major}.{minor}"
    except Exception as e:
        logging.error(f"Error calculating next version: {e}")
        return "v1.0"

def get_backup_message() -> str:
    """Prompts the user for a backup message."""
    while True:
        backup_message = input(f"\n{QUESTION_COLOR}Please enter a backup message: {RESET_COLOR}").strip()
        if backup_message:
            return backup_message
        print("Backup message cannot be empty. Please enter a valid message.")

def select_project(config: Dict, initial_run: bool = False) -> Optional[str]:
    """Allows the user to select a project or enter a new one."""
    projects = list(config.keys())
    
    # If no projects exist, directly prompt for new project
    if not projects:
        print(f"{QUESTION_COLOR}No existing projects found. Please add a new project.{RESET_COLOR}")
        return "new_project"

    print(f"{QUESTION_COLOR}Select a project:{RESET_COLOR}")
    for i, project in enumerate(projects, start=1):
        print(f"{CHOICE_COLOR}{i}. {project}{RESET_COLOR}")
    print(f"{CHOICE_COLOR}{len(projects) + 1}. Enter a new project folder")
    print(f"{CHOICE_COLOR}{len(projects) + 2}. Remove project")

    # Only show "Go back" if it's not the initial run
    if not initial_run:
        print(f"{CHOICE_COLOR}{len(projects) + 3}. Exit{RESET_COLOR}")

    while True:
        try:
            choice = input(f"\n{QUESTION_COLOR}Enter the number of the project: {RESET_COLOR}").strip()
            if not choice:
                print("Please enter a number.")
                continue

            choice = int(choice)
            if 1 <= choice <= len(projects):
                selected_project = projects[choice - 1]
                if os.path.exists(config[selected_project]["project_folder"]):
                    print(f"Selected project: {selected_project}")
                    return config[selected_project]["project_folder"]
                else:
                    print(f"\n{ERROR_COLOR}Error: Project folder no longer exists: {config[selected_project]['project_folder']}{RESET_COLOR}\n")
            elif choice == len(projects) + 1:
                return "new_project"
            elif choice == len(projects) + 2:
                return "remove_project"
            elif not initial_run and choice == len(projects) + 3:
                return "exit"
            else:
                print(f"Invalid choice. Please enter a number between 1 and {len(projects) + 3 if not initial_run else len(projects) + 2}.")
        except ValueError:
            print("Invalid input. Please enter a number.")

def calculate_sha1(file_path: str) -> Optional[str]:
    """Calculates the SHA-1 hash of a file."""
    try:
        sha1 = hashlib.sha1()
        with open(file_path, 'rb') as f:
            while chunk := f.read(8192):
                sha1.update(chunk)
        return sha1.hexdigest()
    except Exception as e:
        handle_file_operation_error("calculating file hash", file_path, e)
        return None

def calculate_folder_hash(folder_path: str) -> str:
    """Calculates a combined SHA-1 hash for all files in a folder."""
    hashes = [
        calculate_sha1(os.path.join(root, file))
        for root, _, files in os.walk(folder_path)
        for file in files
    ]
    
    combined_hash = hashlib.sha1()
    for h in sorted(hashes):
      if h is not None:
        combined_hash.update(h.encode())
    return combined_hash.hexdigest()

def calculate_folder_hashes(folder_path: str) -> Dict[str, str]:
    """Calculates SHA-1 hashes for all files in a folder, excluding specified paths."""
    hashes = {}
    try:
        folder_path = os.path.abspath(folder_path)
        for root, dirs, files in os.walk(folder_path):
            dirs[:] = [d for d in dirs if d not in EXCLUDED_PATHS]

            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, folder_path)
                if not any(excluded in relative_path.split(os.sep) for excluded in EXCLUDED_PATHS):
                    file_hash = calculate_sha1(file_path)
                    if file_hash:
                        hashes[relative_path] = file_hash
    except Exception as e:
        handle_file_operation_error("calculating folder hashes", folder_path, e)
    return hashes

def get_folder_stats(folder_path: str) -> Dict[str, int]:
    """Calculates folder size, number of files, and number of folders."""
    total_size = 0
    num_files = 0
    num_folders = 0
    for root, dirs, files in os.walk(folder_path):
        num_folders += len(dirs)
        num_files += len(files)
        for file in files:
            file_path = os.path.join(root, file)
            total_size += os.path.getsize(file_path)
    return {
        "total_size": total_size,
        "num_files": num_files,
        "num_folders": num_folders
    }

def compare_hashes(current_hashes: Dict[str, str], stored_hashes: Dict[str, str]) -> bool:
    """Compares two sets of file hashes."""
    return current_hashes == stored_hashes

def detect_changes(current_hashes: Dict[str, str], stored_hashes: Dict[str, str]) -> Dict[str, list]:
    """Detects added, modified, and deleted files by comparing hashes."""
    changes = {
        "added": [],
        "modified": [],
        "deleted": []
    }

    for file_path, current_hash in current_hashes.items():
        if file_path not in stored_hashes:
            changes["added"].append(file_path)
        elif stored_hashes[file_path] != current_hash:
            changes["modified"].append(file_path)

    for file_path in stored_hashes:
        if file_path not in current_hashes:
            changes["deleted"].append(file_path)

    return changes

def validate_path(path: str, is_backup_folder: bool = False) -> Optional[str]:
    """Validates and normalizes a path."""
    try:
        full_path = os.path.abspath(os.path.normpath(path))

        if is_backup_folder:
            os.makedirs(full_path, exist_ok=True)

        if not is_backup_folder and not os.path.exists(full_path):
            print(f"\n{ERROR_COLOR}Error: Path does not exist: {path}{RESET_COLOR}\n")
            return None

        if os.path.exists(full_path) and not os.path.isdir(full_path):
            print(f"\n{ERROR_COLOR}Error: Path is not a directory: {path}{RESET_COLOR}\n")
            return None

        if is_backup_folder:
            test_file = os.path.join(full_path, "test_write_permission")
            with open(test_file, 'w') as f:
                f.write("test")
            os.remove(test_file)

        return full_path

    except Exception as e:
        print(f"\n{ERROR_COLOR}Error: Invalid path format: {e}{RESET_COLOR}\n")
        return None
        
def get_all_backup_folders(config: Dict) -> list:
    """Returns a sorted list of all unique backup folders used so far."""
    backup_folders = set()
    for project in config.values():
        folder = project.get("backup_folder")
        if folder:
            backup_folders.add(folder)
    return sorted(backup_folders)

def select_backup_folder(config: Dict) -> Optional[str]:
    """Allows the user to select a backup folder from previous ones or add a new one."""
    backup_folders = get_all_backup_folders(config)
    if not backup_folders:
        # No previous backup folders, prompt for new
        while True:
            backup_path = input(f"\n{QUESTION_COLOR}Please enter a new path for the backup folder: {RESET_COLOR}")
            validated_path = validate_path(backup_path, is_backup_folder=True)
            if validated_path:
                return validated_path
            print("Please enter a valid backup folder path.")
    else:
        print(f"{QUESTION_COLOR}Select a backup folder:{RESET_COLOR}")
        for i, folder in enumerate(backup_folders, start=1):
            print(f"{CHOICE_COLOR}{i}. {folder}{RESET_COLOR}")
        print(f"{CHOICE_COLOR}{len(backup_folders) + 1}. Enter a new backup folder{RESET_COLOR}")
        while True:
            choice = input(f"\n{QUESTION_COLOR}Enter the number of the backup folder: {RESET_COLOR}").strip()
            if not choice:
                print("Please enter a number.")
                continue
            try:
                choice = int(choice)
                if 1 <= choice <= len(backup_folders):
                    selected_folder = backup_folders[choice - 1]
                    validated_path = validate_path(selected_folder, is_backup_folder=True)
                    if validated_path:
                        return validated_path
                    else:
                        print("Selected backup folder is invalid. Please choose another or add a new one.")
                elif choice == len(backup_folders) + 1:
                    while True:
                        backup_path = input(f"\n{QUESTION_COLOR}Please enter a new path for the backup folder: {RESET_COLOR}")
                        validated_path = validate_path(backup_path, is_backup_folder=True)
                        if validated_path:
                            return validated_path
                        print("Please enter a valid backup folder path.")
                else:
                    print(f"Invalid choice. Please enter a number between 1 and {len(backup_folders) + 1}.")
            except ValueError:
                print("Invalid input. Please enter a number.")

def create_backup(project_folder: str, backup_folder: str, version: str) -> Optional[str]:
    """Creates a zip archive backup of the project folder inside a subfolder named after the project."""
    if not os.path.exists(project_folder):
        logging.error(f"Project folder does not exist: {project_folder}")
        print(f"\n{ERROR_COLOR}Error: Project folder not found: {project_folder}{RESET_COLOR}\n")
        return None

    project_name = os.path.basename(os.path.normpath(project_folder))
    project_backup_dir = os.path.join(backup_folder, project_name)
    os.makedirs(project_backup_dir, exist_ok=True)
    backup_file = os.path.join(project_backup_dir, f"{project_name}_backup_{version}.zip")

    try:
        safe_file_operation(
            shutil.make_archive,
            base_name=backup_file.replace('.zip', ''),
            format='zip',
            root_dir=project_folder
        )
        return backup_file
    except Exception as e:
        handle_file_operation_error("creating backup", backup_file, e)
        return None

def log_backup(project_name: str, version: str, backup_details: Dict[str, str]) -> None:
    """Logs backup details to the project's log file."""
    logs = load_project_logs(project_name)
    logs[f"backup_{version}"] = backup_details
    save_project_logs(project_name, logs)

def remove_projects(config: Dict) -> None:
    """Allows the user to remove projects from the configuration."""
    projects = list(config.keys())
    if not projects:
        print("No projects available to remove.")
        return

    print(f"\n{QUESTION_COLOR}Select projects to remove:{RESET_COLOR}")
    for i, project in enumerate(projects, start=1):
        print(f"{CHOICE_COLOR}{i}. {project}{RESET_COLOR}")

    while True:
        try:
            choices = input(f"\n{QUESTION_COLOR}Enter the numbers of the projects to remove (comma-separated): {RESET_COLOR}").strip()
            if not choices:
                print("Please enter at least one number.")
                continue

            selected_indices = [int(x.strip()) for x in choices.split(',')]
            selected_projects = [projects[i - 1] for i in selected_indices if 1 <= i <= len(projects)]

            if not selected_projects:
                print("No valid projects selected.")
                continue

            print(f"\n{QUESTION_COLOR}You are going to remove the following projects:{RESET_COLOR}")
            for project in selected_projects:
                print(f"{CHOICE_COLOR}- {project}{RESET_COLOR}")

            confirmation = input(f"\n{ERROR_COLOR}This action is irreversible. Are you sure? (yes/no): {RESET_COLOR}").strip().lower()
            if confirmation != "yes":
                print("Project removal cancelled.")
                return

            deleted_projects_log = []
            for project_name in selected_projects:
                project_log_file = os.path.join(PROJECTS_FOLDER, f"{project_name}_log.json")
                
                deleted_project_info = {
                    "project_name": project_name,
                    "source_folder": config[project_name]["project_folder"],
                    "backup_folder": config[project_name]["backup_folder"],
                    "last_version": config[project_name]["last_version"],
                    "deleted_at": datetime.datetime.now().strftime("%d %b %Y, %I:%M:%S %p")
                }
                deleted_projects_log.append(deleted_project_info)

                safe_file_operation(os.remove, project_log_file)
                del config[project_name]

            if save_config(config):
                print("Selected projects have been removed from the configuration.")
                if deleted_projects_log:
                    try:
                        with open(DELETED_LOG_FILE, 'a') as log_file:
                            for log_entry in deleted_projects_log:
                                log_file.write(json.dumps(log_entry) + "\n")
                        print(f"Please note that this only removes the project log entries; your saved backup zip files will remain untouched in the backup folder. A log of deleted projects has been saved to: {DELETED_LOG_FILE}")
                    except Exception as e:
                        handle_file_operation_error("saving deleted projects log", DELETED_LOG_FILE, e)
            else:
                print(f"{ERROR_COLOR}Error: Failed to update the configuration file.{RESET_COLOR}")
            break

        except ValueError:
            print("Invalid input. Please enter numbers separated by commas.")
        except IndexError:
            print("Invalid project number. Please enter valid numbers.")

# --- Main Function ---
def main() -> None:
    """Main function to run the backup script."""
    try:
        _ensure_directories()
        print(get_greeting())
        print("\nTip: You can view your backup logs using the Backup Log Viewer tool")
        print("Visit: https://romiojoseph.github.io/version-control-backup-log-viewer")
        print("Note: No data is sent anywhere—everything runs in your browser.")
        print()

        config = load_config()
        project_folder = None
        backup_folder = None

        # --- Initial Project Selection ---
        if project_folder is None:
            project_folder = select_project(config, initial_run=True)
            if project_folder == "new_project":
                project_folder = None
                while True:
                    project_path = input(f"\n{QUESTION_COLOR}Please enter the path to the project folder: {RESET_COLOR}").strip()
                    if project_path:
                        validated_path = validate_path(project_path, is_backup_folder=False)
                        if validated_path:
                            project_folder = validated_path
                            break
                    print("Please enter a valid project folder path.")
            elif project_folder == "remove_project":
                remove_projects(config)
                project_folder = None
            elif project_folder == "exit":
                print("\nClosing...")
                print("Just a heads-up to back up your files now and then, and make sure your backup folder is syncing with your cloud storage.")
                print("\nTip: Don't forget you can view your backup logs using the Backup Log Viewer tool")
                print("Visit: https://romiojoseph.github.io/version-control-backup-log-viewer")
                print("Note: No data is sent anywhere—everything runs in your browser.")
                print()
                return
            elif project_folder and not os.path.exists(project_folder):
                print(f"\n{ERROR_COLOR}Error: Project folder no longer exists: {project_folder}{RESET_COLOR}\n")
                project_folder = None

        # --- Main Loop After Initial Project Selection or Backup ---
        while True:
            try:
                if project_folder is None:
                    project_folder = select_project(config)
                    if project_folder == "new_project":
                        project_folder = None
                        while True:
                            project_path = input(f"\n{QUESTION_COLOR}Please enter the path to the project folder: {RESET_COLOR}").strip()
                            if project_path:
                                validated_path = validate_path(project_path, is_backup_folder=False)
                                if validated_path:
                                    project_folder = validated_path
                                    break
                            print("Please enter a valid project folder path.")
                    elif project_folder == "remove_project":
                        remove_projects(config)
                        project_folder = None
                    elif project_folder == "exit":
                        print("\nClosing...")
                        print("Just a heads-up to back up your files now and then, and make sure your backup folder is syncing with your cloud storage.")
                        print("\nTip: Don't forget you can view your backup logs using the Backup Log Viewer tool")
                        print("Visit: https://romiojoseph.github.io/version-control-backup-log-viewer")
                        print("Note: No data is sent anywhere—everything runs in your browser.")
                        print()
                        return

                if project_folder is not None:
                    project_name = os.path.basename(os.path.normpath(project_folder))

                    # --- Backup Folder Handling ---
                    # Check if backup folder is already set in config, validate, otherwise prompt user
                    if project_name in config and "backup_folder" in config[project_name]:
                        backup_folder = config[project_name]["backup_folder"]
                        if not validate_path(backup_folder, is_backup_folder=True):
                            backup_folder = None  # Reset if invalid
                            backup_folder = select_backup_folder(config)
                    else:
                        backup_folder = select_backup_folder(config)

                    # --- Project Analysis and Backup Decision ---
                    logs = load_project_logs(project_name)
                    current_hashes = calculate_folder_hashes(project_folder)
                    current_project_hash = calculate_folder_hash(project_folder)
                    folder_stats = get_folder_stats(project_folder)
                    
                    if project_name not in config:
                        # First-time backup for this project
                        version = "v1.0"
                        backup_message = get_backup_message()
                        # Initialize changes_info for first backup
                        changes_info = {
                            "structure_changed": False,
                            "added_files": list(current_hashes.keys()),  # All files are "new" in first backup
                            "modified_files": [],
                            "deleted_files": []
                        }
                    else:
                        # --- Change Detection and Backup Prompt ---
                        last_version = get_last_version(logs)
                        backup_key = f"backup_{last_version}"
                        stored_hashes = logs.get(backup_key, {}).get("hashes", {}) if logs else {}
                        stored_project_hash = logs.get(backup_key, {}).get("project_hash", "") if logs else {}
                        
                        print("\nChecking for changes since last backup...")

                        changes = detect_changes(current_hashes, stored_hashes)
                        has_changes = any(changes.values()) or current_project_hash != stored_project_hash

                        # Store the changes information
                        changes_info = {
                            "structure_changed": current_project_hash != stored_project_hash and not any([changes["added"], changes["modified"], changes["deleted"]]),
                            "added_files": sorted(changes["added"]),
                            "modified_files": sorted(changes["modified"]),
                            "deleted_files": sorted(changes["deleted"])
                        }

                        if not has_changes:
                            print("No changes detected since the last backup.")
                        else:
                            print("\nChanges detected since last backup:")
                            if current_project_hash != stored_project_hash and not any([changes["added"], changes["modified"], changes["deleted"]]):
                                print("  • Project structure has changed")
                            if changes["added"]:
                                print("\nNew files:")
                                for file in sorted(changes["added"]):
                                    print(f"  + {file}")
                            if changes["modified"]:
                                print("\nModified files:")
                                for file in sorted(changes["modified"]):
                                    print(f"  ~ {file}")
                            if changes["deleted"]:
                                print("\nDeleted files:")
                                for file in sorted(changes["deleted"]):
                                    print(f"  - {file}")
                        print()

                        while True:
                            create_backup_anyway = input(f"{QUESTION_COLOR}Do you want to create a backup? (1. Yes / 2. No): {RESET_COLOR}")
                            if create_backup_anyway in ["1", "2"]:
                                break
                            print(f"\n{ERROR_COLOR}Invalid choice. Please enter 1 for Yes or 2 for No.{RESET_COLOR}\n")

                        if create_backup_anyway != "1":
                            print(f"\n{QUESTION_COLOR}Current project folder: {RESET_COLOR}{project_folder}\n")
                            print(f"{CHOICE_COLOR}1. Select a different project folder")
                            print(f"2. Enter a new project folder")
                            print(f"3. Remove project")
                            print(f"4. Exit{RESET_COLOR}")

                            choice = input(f"\n{QUESTION_COLOR}Please select an option (1/2/3/4): {RESET_COLOR}")

                            if choice == "1":
                                new_project_folder = select_project(config)
                                if new_project_folder == "exit":
                                    project_folder = None
                                    print("\nClosing...")
                                    print("Just a heads-up to back up your files now and then, and make sure your backup folder is syncing with your cloud storage.")
                                    print("\nTip: Don't forget you can view your backup logs using the Backup Log Viewer tool")
                                    print("Visit: https://romiojoseph.github.io/version-control-backup-log-viewer")
                                    print("Note: No data is sent anywhere—everything runs in your browser.")
                                    print()
                                    return
                                elif new_project_folder == "new_project":
                                    project_folder = None
                                    while True:
                                        project_path = input(f"\n{QUESTION_COLOR}Please enter the path to the project folder: {RESET_COLOR}").strip()
                                        if project_path:
                                            validated_path = validate_path(project_path, is_backup_folder=False)
                                            if validated_path:
                                                project_folder = validated_path
                                                break
                                        print("Please enter a valid project folder path.")
                                elif new_project_folder == "remove_project":
                                    remove_projects(config)
                                    project_folder = None
                                else:
                                    project_folder = new_project_folder
                            elif choice == "2":
                                project_folder = None
                                while True:
                                    project_path = input(f"\n{QUESTION_COLOR}Please enter the path to the project folder: {RESET_COLOR}").strip()
                                    if project_path:
                                        validated_path = validate_path(project_path, is_backup_folder=False)
                                        if validated_path:
                                            project_folder = validated_path
                                            break
                                    print("Please enter a valid project folder path.")
                            elif choice == "3":
                                remove_projects(config)
                                project_folder = None
                            elif choice == "4":
                                project_folder = None
                                print("\nClosing...")
                                print("Just a heads-up to back up your files now and then, and make sure your backup folder is syncing with your cloud storage.")
                                print("\nTip: Don't forget you can view your backup logs using the Backup Log Viewer tool")
                                print("Visit: https://romiojoseph.github.io/version-control-backup-log-viewer")
                                print("Note: No data is sent anywhere—everything runs in your browser.")
                                print()
                                return
                            else:
                                print(f"\n{ERROR_COLOR}Error: Invalid choice. Please try again.{RESET_COLOR}\n")
                            continue

                        version = get_next_version(last_version)
                        backup_message = get_backup_message()

                    # --- Backup Creation ---
                    backup_file = create_backup(project_folder, backup_folder, version)
                    if backup_file:
                        # --- Backup Verification ---
                        if not os.path.exists(backup_file):
                            print(f"\n{ERROR_COLOR}Error: Backup file was not created successfully.{RESET_COLOR}\n")
                            continue

                        backup_size = os.path.getsize(backup_file)
                        if backup_size == 0:
                            print(f"\n{ERROR_COLOR}Error: Created backup file is empty.{RESET_COLOR}\n")
                            safe_file_operation(os.remove, backup_file)
                            continue

                        # --- Backup Details and Logging ---
                        backup_details = {
                            "version": version,
                            "date": datetime.datetime.now().strftime("%d %b %Y, %I:%M:%S %p"),
                            "message": backup_message,
                            "project_folder": project_folder,
                            "backup_folder": backup_folder,
                            "backup_file": os.path.basename(backup_file),
                            "hashes": current_hashes,
                            "project_hash": current_project_hash,
                            "changes": changes_info
                        }

                        project_info = {
                            "project_folder": project_folder,
                            "backup_folder": backup_folder,
                            "total_size": folder_stats["total_size"],
                            "num_files": folder_stats["num_files"],
                            "num_folders": folder_stats["num_folders"],
                            "project_hash": current_project_hash,
                            "last_backup": datetime.datetime.now().strftime("%d %b %Y, %I:%M:%S %p"),
                            "last_version": version,
                            "backup_message": backup_message,
                            "backup_file_name": os.path.basename(backup_file),
                            "backup_file_size": backup_size,
                            "hashes": current_hashes
                        }

                        log_backup(project_name, version, backup_details)
                        project_logs = load_project_logs(project_name) # reload to avoid overwriting
                        project_logs[f"project_info_{version}"] = project_info
                        save_project_logs(project_name, project_logs)

                        config[project_name] = project_info
                        save_config(config)

                        print(f"Backup successful! Version: {version}")
                        print(f"Backup file: {os.path.dirname(backup_file)}\\{FILE_COLOR}{os.path.basename(backup_file)}{RESET_COLOR}")
                        print(f"Logs updated: {CONFIG_FILE}")
                    else:
                        print("Backup failed.")

                    # --- Next Action Prompt ---
                    print(f"\n{QUESTION_COLOR}What would you like to do next?{RESET_COLOR}")
                    print(f"{CHOICE_COLOR}1. Standby")
                    print(f"2. Close{RESET_COLOR}")

                    while True:
                        choice = input(f"\n{QUESTION_COLOR}Please select an option (1/2): {RESET_COLOR}")
                        if choice == "1":
                            print("\nStanding by...\n")
                            project_folder = None
                            backup_folder = None # Reset backup folder to prompt for it again in next iteration
                            break
                        elif choice == "2":
                            print("\nClosing...")
                            print("Just a heads-up to back up your files now and then, and make sure your backup folder is syncing with your cloud storage.")
                            print("\nTip: You can view your backup logs using the Backup Log Viewer tool")
                            print("Visit: https://romiojoseph.github.io/version-control-backup-log-viewer")
                            print("Note: No data is sent anywhere—everything runs in your browser.")
                            print()
                            return
                        else:
                            print(f"\n{ERROR_COLOR}Error: Invalid option. Please try again.{RESET_COLOR}\n")

            except KeyboardInterrupt:
                print("\n\nBackup process interrupted by user.")
                print("Cleaning up...")
                sys.exit(0)
            except Exception as e:
                logging.error(f"Unexpected error: {e}")
                print(f"\n{ERROR_COLOR}An unexpected error occurred: {e}{RESET_COLOR}\n")
                print(f"{ERROR_COLOR}Please try again or contact support if the problem persists.{RESET_COLOR}\n")
                project_folder = None
                backup_folder = None
                continue

    except Exception as e:
        logging.critical(f"Critical error in main: {e}")
        print(f"\n{ERROR_COLOR}Critical error: {e}{RESET_COLOR}\n")
        print(f"{ERROR_COLOR}The application needs to close. Please check the logs for details.{RESET_COLOR}\n")
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nApplication terminated by user.")
        print("\nTip: You can view your backup logs using the Backup Log Viewer tool")
        print("Visit: https://romiojoseph.github.io/version-control-backup-log-viewer")
        print("Note: No data is sent anywhere—everything runs in your browser.")
        print()
        sys.exit(0)
    except Exception as e:
        logging.critical(f"Unhandled exception: {e}")
        print(f"\n{ERROR_COLOR}Critical error: {e}{RESET_COLOR}\n")
        print("\nTip: You can view your existing backup logs using the Backup Log Viewer tool")
        print("Visit: https://romiojoseph.github.io/version-control-backup-log-viewer")
        print("Note: No data is sent anywhere—everything runs in your browser.")
        print()
        sys.exit(1)