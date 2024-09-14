import os

# Get the directory where the script is saved
dir_path = os.path.dirname(os.path.realpath(__file__))

# Print a heading and description
print("=== File Renaming Script ===")
print("This script will remove a specified word from the filenames in the current directory.")
print("Note: The removal is case-sensitive. If you want to remove a word followed by a space, include the space in the word to remove.")
print()

# Get the word to remove from file names
word_to_remove = input("Enter the word to remove: ")

# Ask the user what to rename
print("Choose what to rename:")
print("1. Files only")
print("2. Folders only")
print("3. Both files and folders")
choice = input("Enter your choice (1/2/3): ")

# Function to rename items based on choice
def rename_items(choice, word_to_remove, dir_path):
    for item in os.listdir(dir_path):
        item_path = os.path.join(dir_path, item)
        if choice == '1' and os.path.isfile(item_path):
            new_item = item.replace(word_to_remove, '')
            os.rename(item_path, os.path.join(dir_path, new_item))
        elif choice == '2' and os.path.isdir(item_path):
            new_item = item.replace(word_to_remove, '')
            os.rename(item_path, os.path.join(dir_path, new_item))
        elif choice == '3':
            new_item = item.replace(word_to_remove, '')
            os.rename(item_path, os.path.join(dir_path, new_item))

# Call the function to rename items based on user choice
rename_items(choice, word_to_remove, dir_path)

print("Items renamed successfully!")