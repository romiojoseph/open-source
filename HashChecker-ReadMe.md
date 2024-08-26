*Script created using Claude.*

Windows might block the script from running. Just click 'More info' and then select 'Run anyway'.

# File Hash Checker Script
This Windows batch script automatically calculates SHA256 hashes for all files in its directory.

## Usage
1. Download the `HashChecker.bat` file.
2. Place it in the directory where you want to check file hashes.
3. Double-click the `HashChecker.bat` file to run it.
4. View the results in the command prompt window that opens.

## Requirements
- Windows operating system
- PowerShell (comes pre-installed on most modern Windows systems)

## Precautions and Notes
- This script is designed to be safe, but always review scripts before running them.
- The script only processes files in its immediate directory, not subdirectories.
- It may take some time to complete if there are many or large files in the directory.
- The script requires read access to the files it's checking. It may not work for files that require elevated permissions.
- Very long file paths or names with special characters might cause issues.
- If you modify the script, be careful not to introduce unintended behavior.

*Important: The hash value of a file is determined by its content, not its name. This means that if you change only the file name, the hash value will stay the same. The hash will only change if the content of the file itself is modified.*
