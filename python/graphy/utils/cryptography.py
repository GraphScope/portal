from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
import os
import base64
import hashlib

# Example usage
passphrase = "this_must_be_a_very_luck_day"
DEFAULT_KEY = hashlib.sha256(passphrase.encode()).digest()[
    :16
]  # AES-128 key (16 bytes)


# Function to encrypt (hash) a key
def encrypt_key(data, key=DEFAULT_KEY):
    # AES requires a 16-byte IV (Initialization Vector)
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    # Padding the data to make it compatible with block size (AES block size = 128 bits)
    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(data.encode()) + padder.finalize()

    # Encrypt the data
    encrypted = encryptor.update(padded_data) + encryptor.finalize()

    # Return the IV and encrypted data (you need IV for decryption)
    return base64.b64encode(iv + encrypted).decode("utf-8")


# Function to decrypt (revert the hash)
def decrypt_key(encrypted_data, key=DEFAULT_KEY):
    encrypted_data = base64.b64decode(encrypted_data)
    iv = encrypted_data[:16]  # Extract the first 16 bytes (IV)
    encrypted = encrypted_data[16:]  # The rest is the encrypted data

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()

    # Decrypt the data
    decrypted_padded = decryptor.update(encrypted) + decryptor.finalize()

    # Remove padding
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    decrypted = unpadder.update(decrypted_padded) + unpadder.finalize()

    return decrypted.decode()
