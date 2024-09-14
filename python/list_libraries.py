import subprocess
import os
from datetime import datetime

# Get the current date and time
now = datetime.now()
last_checked = now.strftime("%d %B %Y %I:%M:%S %p")

# Run pip freeze to get the list of installed packages
output = subprocess.check_output(["pip", "freeze"])

# Print the list of installed packages in a simple format
print(f"Last checked: {last_checked}")
print("Installed Python Libraries:")
print()
for line in output.decode().splitlines():
    package, version = line.split("==")
    print(f"{package} v {version}")
    print(f"pip install {package}")
    print()  # Add a blank line between libraries

# Define the file path
file_path = "E:/Code/installed-python-libraries.md"

# Create the directory if it does not exist
directory = os.path.dirname(file_path)
if not os.path.exists(directory):
    os.makedirs(directory)
    print(f"Created directory: {directory}")

# Prompt the user to save the results to a Markdown file
save_results = input("Save the results to 'installed-python-libraries.md'? (y/n): ")

if save_results.lower() == 'y':
    with open(file_path, 'w') as f:
        f.write(f"# Installed Python Libraries (Last checked: {last_checked})\n\n")
        for line in output.decode().splitlines():
            package, version = line.split("==")
            f.write(f"* {package} v {version}\n")
            f.write(f"`pip install {package}`\n\n")
    print(f"Results saved to '{file_path}'")
else:
    print("Results not saved.")