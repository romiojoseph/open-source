import os
import hashlib
import datetime

# Set the directory to search in (current directory in this case)
search_dir = os.path.dirname(os.path.abspath(__file__))

# Set the output file name
output_file = os.path.join(search_dir, "HashValue.txt")

# Create a temporary file to store results
temp_file = os.path.join(search_dir, "hash_results_temp.txt")
if os.path.exists(temp_file):
    os.remove(temp_file)

# Add a separator with current date and time to the temp file
current_date = datetime.datetime.now().strftime('%d %B %Y')
with open(temp_file, 'a') as temp:
    temp.write(f"\n===== Hash Check Run on {current_date} =====\n\n")

# Loop through all files in the directory
for file_name in os.listdir(search_dir):
    file_path = os.path.join(search_dir, file_name)

    # Skip the script file itself, the HashValue.txt file, and the temporary file
    if file_name != os.path.basename(__file__) and file_name != "HashValue.txt" and file_name != os.path.basename(temp_file):
        if os.path.isfile(file_path):
            print(f"Calculating hash for: {file_name}")

            # Calculate SHA3-256 hash
            sha3_hash = hashlib.sha3_256()
            with open(file_path, "rb") as f:
                for byte_block in iter(lambda: f.read(4096), b""):
                    sha3_hash.update(byte_block)
            hash_value = sha3_hash.hexdigest().upper()  # Convert to uppercase

            # Get current date and time
            current_datetime = datetime.datetime.now().strftime('%d %B %Y %I:%M:%S %p')

            # Write the results to the temp file
            with open(temp_file, 'a') as temp:
                temp.write(f"Algorithm : SHA3-256\n")
                temp.write(f"Hash      : {hash_value}\n")
                temp.write(f"Path      : {file_path}\n")
                temp.write(f"{current_datetime}\n\n")

            print(f"Algorithm : SHA3-256")
            print(f"Hash      : {hash_value}")
            print(f"Path      : {file_path}")
            print(f"{current_datetime}\n")

print("Hash calculation complete.")
input("Press any key to append this info to HashValue.txt and close.")

# Append the temp file to the final output file
with open(temp_file, 'r') as temp:
    with open(output_file, 'a') as output:
        output.write(temp.read())

print(f"Results appended to {output_file}")
os.remove(temp_file)
input()