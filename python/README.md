*Script created using Meta AI.*

# List installed Python libraries script
The script uses the subprocess module to run the pip freeze command, which generates a list of installed Python libraries. The output is then parsed and formatted to display the library names and versions. The results are saved to a Markdown file if the user chooses to do so.

Regularly running this script helps maintain a backup list of installed libraries, ensuring easy reinstallation in the event of system issues.

## Dependencies
- Python 3.x
- To install the dependencies, run the following command:
```Bash
pip install subprocess os datetime
```
However, these are built-in Python modules, so installation is not required.
## Usage
- Run the script using Python: python script.py
- The script will prompt you to save the results to a Markdown file. Enter 'y' to save or 'n' to discard.
- Note that the output file will be saved to `E:/Code` by default; modify the `file_path` variable to change this location.