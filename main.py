import numpy as np

class GeneralMethods:
    alphabet = np.array(['0','a','b','c','d','e','f','g','h','i','j',
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
                        indices.append(27)
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

            while True:
                matrix = np.random.randint(0, 10000, (size, size))
                condition_number = np.linalg.cond(matrix)
                if min_condition <= condition_number <= max_condition:
                    return matrix

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
            reshapedMessageIndices = self.general_methods.reshapeAnArray(messageIndices, messageMatrixSize).T
            productMatrix = np.matmul(self.keyMatrix, reshapedMessageIndices)
            encryptedValues = np.reshape(productMatrix, -1, order='F')

            self.printEncryptionDetails(message, messageIndices, reshapedMessageIndices, self.keyMatrix, productMatrix, encryptedValues)
            return encryptedValues

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
            reshapedValuesArray = self.general_methods.reshapeAnArray(valuesArray, messageMatrixSize).T

            inverseKeyMatrix = np.linalg.inv(self.keyMatrix)
            productMatrix = np.matmul(inverseKeyMatrix, reshapedValuesArray)

            reshapedProductMatrix = np.rint(np.reshape(productMatrix, -1, order='F')).astype(int)
            decryptedMessage = self.general_methods.alphabet[reshapedProductMatrix]
            decryptedMessage = ''.join(decryptedMessage)
            
            self.printDecryptionDetails(reshapedValuesArray, inverseKeyMatrix, reshapedProductMatrix, decryptedMessage)
            return decryptedMessage

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


def main(message, keyMatrixSize):
    general_methods = GeneralMethods()

    # tentative, since it's much ideal to generate the key matrix in JavaScript
    keyMatrix = general_methods.generateInvertibleMatrix(keyMatrixSize)

    messageMatrixSize = general_methods.calculateMessageMatrixSize(message, keyMatrixSize)
    paddedMessage = general_methods.padMessageToMatrixSize(message, messageMatrixSize)
    print(f"Original Message: {message}\nPadded Message: {paddedMessage}\n\n")

    # encryption
    encryptor = Encryptor(keyMatrix, general_methods)
    encryptedMessage = encryptor.encrypt(paddedMessage, messageMatrixSize)

    # decryption
    decryptor = Decryptor(keyMatrix, general_methods)
    decryptedMessage = decryptor.decrypt(encryptedMessage, messageMatrixSize)


main('livelovelaufey', 4)
