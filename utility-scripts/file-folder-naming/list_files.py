import os

def list_names(include_extensions):
    for filename in os.listdir("."):
        if include_extensions:
            print(filename)
        else:
            print(os.path.splitext(filename)[0])

# Print a heading and description
print("=== List file and folder names ===")
print("This script will list file and folder names, giving the user the option to include or exclude extensions.")

print()

print("Choose an option:")
print("1. Include file extensions")
print("2. Exclude file extensions")

choice = int(input("Enter your choice (1/2): "))

if choice == 1:
    list_names(True)
elif choice == 2:
    list_names(False)
else:
    print("Invalid choice. Exiting.")

input("Press Enter to exit...")