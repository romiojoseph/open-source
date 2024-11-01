import requests
import subprocess
import os

# Replace with your GitHub username and personal access token
username = 'USERNAME'
token = 'YOUR-TOKEN'

# Directory to save the repositories
output_dir = 'downloaded-repos'

# Create the output directory if it doesn't exist
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Get a list of all repositories
url = f'https://api.github.com/user/repos?per_page=100'
headers = {'Authorization': f'token {token}'}
response = requests.get(url, headers=headers)

if response.status_code != 200:
    print(f"Error: {response.status_code}")
    print(response.json())
    exit(1)

repos = response.json()

# Check if Git is installed
try:
    subprocess.run(['git', '--version'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
except subprocess.CalledProcessError:
    print("Git is not installed or not added to the system PATH.")
    exit(1)

# Clone each repository
for repo in repos:
    repo_name = repo['name']
    repo_url = repo['clone_url']
    repo_path = os.path.join(output_dir, repo_name)

    print(f"Cloning {repo_name} from {repo_url} to {repo_path}")

    try:
        subprocess.run(['git', 'clone', repo_url, repo_path], check=True)
        print(f"Successfully cloned {repo_name}")
    except subprocess.CalledProcessError as e:
        print(f"Failed to clone {repo_name}: {e}")

print("All repositories have been cloned.")