*Script created using Mistral AI.*

# Clone your entire GitHub repositories
This script downloads all GitHub repositories of a user to a local directory.
## Usage
Replace `USERNAME` and `YOUR-TOKEN` with your GitHub username and [personal access token](https://github.com/settings/tokens?type=beta) respectively.
Run the script using Python 3.
## Requirements
- Python 3
- Git installed and added to the system PATH
- GitHub personal access token
## Script Explanation
- The script first checks if the output directory exists, and creates it if it doesn't.
- It then uses the GitHub API to get a list of all repositories of the user.
- The script checks if Git is installed and added to the system PATH.
- Finally, it clones each repository to the output directory using Git.
## Note
- Make sure to keep your personal access token secure.
- This script downloads all repositories, including private ones. Be cautious when using it.