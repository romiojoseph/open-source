*Script created using Perplexity and Mistral AI.*

# Python script for file encryption and decryption
This script provides a simple command-line interface for encrypting and decrypting files using a password-based key generation.
## Installation
To install the required dependencies, run the following command:
```Bash
pip install cryptography
```
## Usage
- Run the script.
- Choose an operation: Encrypt, Decrypt, or Quit.
- Follow the prompts based on your requirments.
### Functions
- `generate_key(password, salt)`: Generate a key from the password and salt (Salt is a random value added to the password before generating the encryption key. This salt value is stored alongside the encrypted data.) using PBKDF2HMAC (PBKDF2 stands for Password-Based Key Derivation Function 2. HMAC is Hash-based Message Authentication Code) with SHA3-256.
- `hash_file(file_path)`: Generate SHA3-256 hash of the file.
- `encrypt_file(file_path, key, salt)`: Encrypt the file using the provided key and salt, and save it as a new file.
- `decrypt_file(file_path)`: Decrypt the file using the stored salt and password.
- The `main` function provides a simple command-line interface for the script.
## Logging
The script logs important events, such as file encryption and decryption, to a file named file_encryptor_decryptor.log.
## Notes
The script uses a random salt for each encryption operation.
The password is not stored anywhere; it is only used to generate the key.
The encrypted file contains the salt and the encrypted data.