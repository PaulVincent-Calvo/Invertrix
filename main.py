from flask import Flask, render_template, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import numpy as np

app = Flask(__name__, template_folder='templates')
random_numbers_limit = 10000

limiter = Limiter(get_remote_address, app=app)

@app.route('/')
def index():
    return render_template('invertrix.html')

@app.route('/generate-key', methods=['POST'])
@limiter.limit("20 per minute") # 5 requests per minute per IP address
def generate_key():
    # Retrieve the matrix size from the client (default is 2)
    data = request.get_json()
    size = data.get('size', 2)

    # Create an instance of GeneralMethods and use it to generate an invertible matrix
    general_methods = GeneralMethods()
    key_matrix = general_methods.generateInvertibleMatrix(size)

    # Return the generated matrix as a JSON response
    return jsonify(key_matrix)

@app.route('/encrypt', methods=['POST'])
@limiter.limit("10 per minute")
def encrypt_message():

    data = request.get_json()
    message = data.get('message')
    keyMatrix = data.get('keyMatrix')
    
    keyMatrix = np.array(keyMatrix)
    
    # Check if the key matrix is a valid 2D array
    if keyMatrix.ndim != 2:
        return jsonify({"error": "Key matrix must be a 2D array"}), 400
    

    keyMatrixSize = keyMatrix.shape[0]
    
    # Initialize GeneralMethods and Encryptor classes
    general_methods = GeneralMethods()
    encryptor = Encryptor(keyMatrix, general_methods)
    
    # Calculate message matrix size and pad message
    messageMatrixSize = general_methods.calculateMessageMatrixSize(message, keyMatrixSize)
    paddedMessage = general_methods.padMessageToMatrixSize(message, messageMatrixSize)
    
    # Perform encryption and gather details
    encryption_details = encryptor.encrypt(paddedMessage, messageMatrixSize)
    
    # Return the full set of encryption details
    return jsonify(encryption_details)  # Return the dictionary directly as JSON

@app.route('/decrypt', methods=['POST'])
@limiter.limit("10 per minute")
def decrypt_message():
    try:
        # Retrieve the encrypted message and key matrix from the client
        data = request.get_json()
        
        encrypted_message = data.get('message')  # Encrypted values separated by spaces or commas
        
        keyMatrix = np.array(data.get('keyMatrix'))  # Get the key matrix from client
        print(keyMatrix)
        keyMatrixSize = data.get('gridSize')
        
        # Check if the key matrix is valid (must be 2D)
        if keyMatrix.ndim != 2:
            return jsonify({"error": "Key matrix must be a 2D array"}), 400
        
        general_methods = GeneralMethods()
        # Calculate the message matrix size of the decrypted message
        messageMatrixSize = general_methods.calculateMessageMatrixSizeOfDecryptedMessage(encrypted_message, keyMatrixSize)
        
        decryptor = Decryptor(keyMatrix, general_methods)
        encrypted_message = encrypted_message.split()  # Convert to list of strings
        
        # Convert the message to a list of integers
        encrypted_message = list(map(int, encrypted_message))
        
        decryption_details = decryptor.decrypt(encrypted_message, messageMatrixSize)
        
        print(f"Decryption Message: {decryption_details}")
        # Return the decrypted message as a JSON response
        return jsonify(decryption_details)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.errorhandler(429)
def ratelimit_error(error):
    return jsonify(error="ratelimit exceeded", message="Too many requests"), 429

class GeneralMethods:
    alphabet = np.array([' ','a','b','c','d','e','f','g','h','i','j',
                    'k','l','m','n','o','p','q','r','s','t',
                    'u','v','w','x','y','z','_'])  # 0(placeholder) & _(whitespace)
    def returnAlphabetIndices(self, message):
        try:
            if not isinstance(message, str):
                raise TypeError(f"Input must be a string. Got {type(message)}.")

            indices = []

            for index, char in enumerate(message.lower()):
                try:
                    if 'a' <= char <= 'z':
                        indices.append(ord(char) - ord('a') + 1)
                    elif char in [' ', '_']:
                        indices.append(0)
                    else:
                        indices.append(None)
                except Exception as inner_error:
                    raise ValueError(f"Error processing character '{char}' at index {index}: {inner_error}")
            
            return np.array(indices)

        except TypeError as te:
            return f"TypeError: {te}"

        except ValueError as ve:
            return f"ValueError: {ve}"

        except Exception as e:
            return f"An unexpected error occurred: {e}"
        
    def reshapeAnArray(self, basisArray, size):
        try:
            reshapedArray = basisArray.reshape(size[0], size[1])
        except ValueError as e:
            print(f"An error occurred: {e}")
            return f"Error: {e}"

        return reshapedArray

    def generateInvertibleMatrix(self, size, min_condition=1, max_condition=10):
        try:
            if not isinstance(size, int) or size <= 0:
                raise ValueError(f"Expected 'size' to be a positive integer. Got {size}.")
            if not isinstance(min_condition, (int, float)) or not isinstance(max_condition, (int, float)):
                raise TypeError(f"Expected 'min_condition' and 'max_condition' to be numbers. Got {type(min_condition)} and {type(max_condition)}.")
            if min_condition > max_condition:
                raise ValueError(f"min_condition cannot be greater than max_condition. Got min_condition={min_condition}, max_condition={max_condition}.")

            # Generate a random matrix and check if it's invertible
            while True:
                matrix = np.random.randint(1, random_numbers_limit, (size, size))
                condition_number = np.linalg.cond(matrix)
                if min_condition <= condition_number <= max_condition:
                    return matrix.tolist()

        except ValueError as ve:
            return f"ValueError: {ve}"

        except TypeError as te:
            return f"TypeError: {te}"

        except np.linalg.LinAlgError as lae:
            return f"LinAlgError: {lae}"

        except Exception as e:
            return f"An unexpected error occurred: {e}"

    def calculateMessageMatrixSize(self, message, keyMatrixSize):
        try:
            if not isinstance(message, str):
                raise TypeError(f"Expected 'message' to be a string. Got {type(message)}.")
            if not isinstance(keyMatrixSize, int) or keyMatrixSize <= 0:
                raise ValueError(f"Expected 'keyMatrixSize' to be a positive integer. Got {keyMatrixSize}.")

            messageLength = len(message)
            numRows = messageLength // keyMatrixSize

            if messageLength % keyMatrixSize == 0:
                messageMatrixSize = [numRows, keyMatrixSize]
            else:
                messageMatrixSize = [numRows + 1, keyMatrixSize]

            print(f"Message Length: {messageLength}")
            print(f"Message Matrix Size(mxn): {messageMatrixSize}")

            return messageMatrixSize

        except TypeError as te:
            return f"TypeError: {te}"

        except ValueError as ve:
            return f"ValueError: {ve}"

        except Exception as e:
            return f"An unexpected error occurred: {e}"
        
    def calculateMessageMatrixSizeOfDecryptedMessage(self, message, keyMatrixSize):
        try:
            if not isinstance(message, str):
                raise TypeError(f"Expected 'message' to be a string. Got {type(message)}.")
            
            if not isinstance(keyMatrixSize, int) or keyMatrixSize <= 0:
                raise ValueError(f"Expected 'keyMatrixSize' to be a positive integer. Got {keyMatrixSize}.")
            
            # Count the number of numbers (split by spaces or commas)
            messageNumbers = [num for num in message.replace(",", " ").split() if num.isdigit()]
            messageLength = len(messageNumbers)
            
            # Calculate the number of rows for the matrix
            numRows = messageLength // keyMatrixSize
            
            # If there's a remainder, we need an additional row
            if messageLength % keyMatrixSize == 0:
                messageMatrixSize = [numRows, keyMatrixSize]
            else:
                messageMatrixSize = [numRows + 1, keyMatrixSize]

            print(f"Message Length of Decypt (counted numbers): {messageLength}")
            print(f"Message Matrix Size of Decrypt (m x n): {messageMatrixSize}")

            return messageMatrixSize

        except TypeError as te:
            return f"TypeError: {te}"

        except ValueError as ve:
            return f"ValueError: {ve}"

        except Exception as e:
            return f"An unexpected error occurred: {e}"


    def padMessageToMatrixSize(self, message, messageMatrixSize):
        try:
            if not isinstance(message, str):
                raise TypeError(f"Expected 'message' to be a string. Got {type(message)}.")
            if not isinstance(messageMatrixSize, (list, tuple)) or len(messageMatrixSize) != 2:
                raise ValueError(f"Expected 'messageMatrixSize' to be a list or tuple of two elements. Got {messageMatrixSize}.")

            numRows = messageMatrixSize[0]
            numCols = messageMatrixSize[1]
            messageLength = len(message)
            newMessageLength = numRows * numCols

            if messageLength < newMessageLength:
                message += '_' * (newMessageLength - messageLength)

            return message

        except TypeError as te:
            return f"TypeError: {te}"

        except ValueError as ve:
            return f"ValueError: {ve}"

        except Exception as e:
            return f"An unexpected error occurred during padding: {e}"


class Encryptor:
    def __init__(self, keyMatrix, general_methods):
        self.keyMatrix = keyMatrix
        self.general_methods = general_methods

    def encrypt(self, message, messageMatrixSize):
        try:
            messageIndices = self.general_methods.returnAlphabetIndices(message)
            reshapedMessageIndices = self.general_methods.reshapeAnArray(messageIndices, messageMatrixSize)
            print(f"reshapedMessageIndices: {reshapedMessageIndices}")
            productMatrix = np.matmul(reshapedMessageIndices, self.keyMatrix)
            encryptedValues = np.reshape(productMatrix, -1, order='C')

            # Return all the encryption details
            encryption_details = {
                'message': message,
                'indices': messageIndices.tolist(),  # Convert numpy array to list
                'reshaped_indices': reshapedMessageIndices.tolist(),
                'key_matrix': self.keyMatrix.tolist(),
                'product_matrix': productMatrix.tolist(),
                'encrypted_values': encryptedValues.tolist()
            }

            self.printEncryptionDetails(message, messageIndices, reshapedMessageIndices, self.keyMatrix, productMatrix, encryptedValues)
            return encryption_details  # Return all the encryption details

        except ValueError as e:
            return f"Error: {e}"

    def printEncryptionDetails(self, message, messageIndices, reshapedMessageIndices, keyMatrix, productMatrix, encryptedValues):
        try:
            print(f"ENCRYPT")
            print(f"Message: {message}")
            print(f"Indices: {messageIndices}")
            print(f"Reshaped Indices: \n {reshapedMessageIndices} \n")
            print(f"Key Matrix: \n {keyMatrix} \n")
            print(f"Product Matrix: \n{productMatrix} \n")
            print(f"Encrypted Values: {encryptedValues}\n\n")
        except Exception as e:
            return f"An error occurred while printing encryption details: {e}"


class Decryptor:
    def __init__(self, keyMatrix, general_methods):
        self.keyMatrix = keyMatrix
        self.general_methods = general_methods

    def decrypt(self, values, messageMatrixSize):
        try:
            valuesArray = np.array(values)
            reshapedValuesArray = self.general_methods.reshapeAnArray(valuesArray, messageMatrixSize)
            inverseKeyMatrix = np.linalg.inv(self.keyMatrix)
            productMatrix = np.matmul(reshapedValuesArray,inverseKeyMatrix)
            roundedProductMatrix = np.ceil(productMatrix)
            
            roundUpLimit = 10
            roundedInverseKeyMatrix = np.round(inverseKeyMatrix, roundUpLimit)

            reshapedProductMatrix = np.rint(np.reshape(productMatrix, -1, order='A')).astype(int)
            decryptedMessage = self.general_methods.alphabet[reshapedProductMatrix]
            decryptedMessage = ''.join(decryptedMessage)
            
            decryption_details = {
                'key_matrix': self.keyMatrix.tolist(), 
                'reshaped_values_array': reshapedValuesArray.tolist(), # User input
                'inverse_key_matrix': inverseKeyMatrix.tolist(),  # inverse of keymatrix
                'rounded_inverse_key_matrix': roundedInverseKeyMatrix.tolist(),
                'reshaped_product_matrix': roundedProductMatrix.tolist(), # product of user input and inverse key matrix
                'decrypted_message': decryptedMessage # messsage
            }

            self.printDecryptionDetails(reshapedValuesArray, inverseKeyMatrix, reshapedProductMatrix, decryptedMessage)
            return decryption_details

        except ValueError as e:
            return f"Error: {e}"

    def printDecryptionDetails(self, reshapedValuesArray, inverseKeyMatrix, reshapedProductMatrix, decryptedMessage):
        try:
            print(f"DECRYPT")
            print(f"Encrypted Values: \n{reshapedValuesArray}\n")
            print(f"Inverse Key Matrix: \n{inverseKeyMatrix} \n")
            print(f"1D Product Matrix: \n{reshapedProductMatrix}\n")
            print(f"Decrypted Message: {decryptedMessage}")
        except Exception as e:
            return f"An error occurred while printing decryption details: {e}"

@app.route('/information-page')
def informationPage():
    return render_template('information-page.html')

if __name__ == "__main__":
    # Ensure that the app uses the correct port provided by Render's environment
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
