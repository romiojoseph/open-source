*Scripts created using Mistral AI and Meta AI.*

# Hash calculator scripts
This README file provides an overview of the scripts provided for calculating file hashes.

## Script 1: SHA256 hash calculator (.bat)
This script calculates the SHA256 hash of all files in a specified directory, excluding the script itself and a file named HashValue.txt. The results are then appended to a file named HashValue.txt in the same directory. The script also includes a timestamp for each hash calculation and a separator with the current date and time.
#### Usage
- Save the script with a .bat extension (e.g., hash-checker-sha256.bat).
- Open a command prompt and navigate to the directory containing the script or just right click in the folder and "Open in terminal"
- Run the script by typing its name and pressing Enter (e.g., hash-checker-sha256.bat) or simply double click on it.

## Script 2: SHA256 hash calculator (.py)
This script calculates the SHA256 hash of all files in a specified directory, excluding the script itself, a file named HashValue.txt, and a temporary file. The results are then appended to a file named HashValue.txt in the same directory. The script also includes a timestamp for each hash calculation and a separator with the current date and time.
#### Usage
- Save the script with a .py extension (e.g., hash_checker_sha256.py).
- Install Python 3 on your system if it's not already installed.
- Open a command prompt and navigate to the directory containing the script or just right click in the folder and "Open in terminal"
- Run the script by typing python hash_checker_sha256.py and pressing Enter or simply double click on it.

## Script 3: SHA3-256 hash calculator (.py)
This script calculates the SHA3-256 hash of all files in a specified directory, excluding the script itself, a file named HashValue.txt, and a temporary file. The results are then appended to a file named HashValue.txt in the same directory. The script also includes a timestamp for each hash calculation and a separator with the current date and time.
#### Usage
- Save the script with a .py extension (e.g., hash_checker_sha3.py).
- Install Python 3 on your system if it's not already installed.
- Open a command prompt and navigate to the directory containing the script or just right click in the folder and "Open in terminal"
- Run the script by typing python hash_checker_sha3.py and pressing Enter or simply double click on it.

> A .bat script for SHA3-256 is not possible with the default items because the built-in Windows command-line tools do not support SHA3-256 hashing. However, you can use a third-party tool like OpenSSL to calculate SHA3-256 hashes in a .bat script, but this may require additional installation and configuration.

## Here's simple command if you want avoid running scripts.

- Open [PowerShell](https://github.com/PowerShell/PowerShell/releases)
- Type or copy paste this `Get-FileHash -Path <file_path> -Algorithm <algorithm>`.

Eg, `Get-FileHash -Path E:\filename.txt -Algorithm SHA256`
- Hit Enter