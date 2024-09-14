import os
import logging
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import base64
import getpass
import secrets
from hashlib import sha3_256

# Configure logging
logging.basicConfig(filename='file_encryptor_decryptor.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def generate_key(password: str, salt: bytes) -> bytes:
    """Generate a key from the password and salt."""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA3_256(),  # Use SHA3-256 for key generation
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    return base64.urlsafe_b64encode(kdf.derive(password.encode()))

def hash_file(file_path: str) -> str:
    """Generate SHA3-256 hash of the file."""
    hasher = sha3_256()
    with open(file_path, 'rb') as file:
        while chunk := file.read(8192):  # Read in chunks
            hasher.update(chunk)
    return hasher.hexdigest()

def encrypt_file(file_path: str, key: bytes, salt: bytes) -> None:
    """Encrypt the file and save it as a new file along with the salt."""
    fernet = Fernet(key)
    with open(file_path, 'rb') as file:
        original_data = file.read()
    encrypted_data = fernet.encrypt(original_data)
    
    new_file_path = f"{file_path}.encrypted"
    with open(new_file_path, 'wb') as file:
        file.write(salt)  # Write the salt to the beginning of the file
        file.write(encrypted_data)
    
    # Log the hash of the encrypted file
    encrypted_hash = hash_file(new_file_path)
    logging.info(f"Encrypted file created: {new_file_path}, Hash: {encrypted_hash}")
    print(f"Encrypted file created: {new_file_path}, Hash: {encrypted_hash}")

def decrypt_file(file_path: str) -> None:
    """Decrypt the file using the stored salt."""
    with open(file_path, 'rb') as file:
        salt = file.read(16)  # Read the first 16 bytes as the salt
        encrypted_data = file.read()
    
    password = getpass.getpass("Enter your password for key generation: ")
    key = generate_key(password, salt)  # Generate the key using the provided password and the read salt
    
    fernet = Fernet(key)
    decrypted_data = fernet.decrypt(encrypted_data)
    
    new_file_path = file_path[:-10]  # Remove the ".encrypted" extension
    with open(new_file_path, 'wb') as file:
        file.write(decrypted_data)
    
    # Log the hash of the decrypted file
    decrypted_hash = hash_file(new_file_path)
    logging.info(f"Decrypted file created: {new_file_path}, Hash: {decrypted_hash}")
    print(f"Decrypted file created: {new_file_path}, Hash: {decrypted_hash}")

def main():
    while True:
        print("Welcome to the File Encryptor/Decryptor")
        print()
        
        # Choose operation
        print("What do you want to do?")
        options = ["1. Encrypt", "2. Decrypt", "3. Quit"]
        for option in options:
            print(option)

        # Input validation for operation choice
        operation = input("Enter your choice (1, 2, or 3): ").strip()
        while operation not in ['1', '2', '3']:
            print("Invalid choice. Please enter 1 to Encrypt, 2 to Decrypt, or 3 to Quit.")
            operation = input("Enter your choice: ").strip()
        
        if operation == '3':
            print("Exiting the program. Goodbye!")
            break
        
        # Get file path
        print()
        print("Just drag and drop the file here, also make sure no double quotes included in the path.")
        file_path = input("Enter the path of the file: ").strip()
        if not os.path.isfile(file_path):
            print("Error: File does not exist.")
            logging.error("File does not exist: %s", file_path)
            input("Press Enter to continue...")  # Keep terminal open
            continue
        
        if operation == '1':
            # Choose password option for encryption
            print()
            password_option = input("Do you want to provide your own password for key generation? (y/n): ").strip().lower()
            
            if password_option == 'y':
                password = getpass.getpass("Enter your password for key generation: ")
            elif password_option == 'n':
                password = secrets.token_urlsafe(16)  # Generate a random password
                print()
                print(f"A random password has been generated for key generation: {password}")
                print()
                print("Please store this password securely. You will need it to decrypt the file later.")
                print()
            else:
                print("Invalid option selected. Please choose 'y' or 'n'.")
                print()
                logging.error("Invalid password option selected: %s", password_option)
                input("Press Enter to continue...")
                continue
            
            salt = os.urandom(16)  # Generate a random salt
            key = generate_key(password, salt)

            # Encrypt the file
            print("Encrypting the file...")
            encrypt_file(file_path, key, salt)

        elif operation == '2':
            # Decrypt the file
            print()
            print("Decrypting the file...")
            decrypt_file(file_path)

        print()
        print("Operation completed. Press Enter to continue...")
        input()

if __name__ == "__main__":
    main()