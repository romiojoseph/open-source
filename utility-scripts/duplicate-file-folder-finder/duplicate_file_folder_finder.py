import os
import hashlib
import sys
from datetime import datetime

def get_file_hash(file_path):
    hasher = hashlib.sha256()
    with open(file_path, 'rb') as f:
        buf = f.read()
        hasher.update(buf)
    return hasher.hexdigest()

def find_duplicate_files(root_dir):
    file_hashes = {}
    duplicates = {}

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            try:
                file_hash = get_file_hash(file_path)

                if file_hash in file_hashes:
                    if file_hash not in duplicates:
                        duplicates[file_hash] = [file_hashes[file_hash]]
                    duplicates[file_hash].append(file_path)
                else:
                    file_hashes[file_hash] = file_path
            except Exception as e:
                print(f"Error processing file {file_path}: {e}")

    return duplicates

def get_folder_hash(folder_path):
    hasher = hashlib.sha256()
    for dirpath, _, filenames in os.walk(folder_path):
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            try:
                file_hash = get_file_hash(file_path)
                hasher.update(file_hash.encode())
            except Exception as e:
                print(f"Error processing file {file_path} in folder {folder_path}: {e}")
    return hasher.hexdigest()

def find_duplicate_folders(root_dir):
    folder_hashes = {}
    duplicates = {}

    for dirpath, _, _ in os.walk(root_dir):
        try:
            folder_hash = get_folder_hash(dirpath)

            if folder_hash in folder_hashes:
                if folder_hash not in duplicates:
                    duplicates[folder_hash] = [folder_hashes[folder_hash]]
                duplicates[folder_hash].append(dirpath)
            else:
                folder_hashes[folder_hash] = dirpath
        except Exception as e:
            print(f"Error processing folder {dirpath}: {e}")

    return duplicates

def main():
    print("Select the scan location:")
    print("1. Current folder where the script is saved")
    print("2. Specific path")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        root_dir = os.path.dirname(os.path.abspath(__file__))
    elif choice == 2:
        root_dir = input("Enter the specific path: ")
    else:
        print("Invalid choice. Exiting.")
        return

    print("Select what to scan:")
    print("1. Files")
    print("2. Folders")
    print("3. Both")

    scan_choice = int(input("Enter your choice: "))

    duplicates = {}

    if scan_choice == 1:
        duplicates = find_duplicate_files(root_dir)
    elif scan_choice == 2:
        duplicates = find_duplicate_folders(root_dir)
    elif scan_choice == 3:
        file_duplicates = find_duplicate_files(root_dir)
        folder_duplicates = find_duplicate_folders(root_dir)
        duplicates = {**file_duplicates, **folder_duplicates}
    else:
        print("Invalid choice. Exiting.")
        return

    if duplicates:
        print("Duplicates found:")
        for hash_value, paths in duplicates.items():
            # Determine the original file based on the oldest modification time
            original_path = min(paths, key=lambda p: os.path.getmtime(p))
            print(f"Original: {original_path}")
            for path in paths:
                if path != original_path:
                    print(f"Duplicate: {path}")
            print()  # Add a gap between categories

        save_results = input("Do you want to save the results to a file? (y/n): ")
        if save_results.lower() == 'y':
            output_file = "duplicate-file-list.txt"
            try:
                with open(output_file, 'a') as f:
                    now = datetime.now()
                    date_time = now.strftime("%d %B %Y %I.%M.%S %p")
                    f.write(f"Scan results on {date_time}:\n")
                    for hash_value, paths in duplicates.items():
                        # Determine the original file based on the oldest modification time
                        original_path = min(paths, key=lambda p: os.path.getmtime(p))
                        f.write(f"Original: {original_path}\n")
                        for path in paths:
                            if path != original_path:
                                f.write(f"Duplicate: {path}\n")
                        f.write("\n")  # Add a gap between categories
                print(f"Results saved to {output_file}")
            except Exception as e:
                print(f"Error saving results to {output_file}: {e}")
    else:
        print("No duplicates found.")

if __name__ == "__main__":
    main()

input("Press Enter to exit...")