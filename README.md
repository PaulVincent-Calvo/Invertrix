<p align="center"><img src="https://github.com/PaulVincent-Calvo/Invertrix/blob/main/static/assets/invertrix-favicon.png" alt="Invertrix Logo"></p>
<h3 align="center">⚠️ Status: Under Development ⚠️</h3>
<h1 align="center">Invertrix: Visual Inverse Matrix Cipher</h1>
<p align="center">by <strong>We Bare Bears</strong> 🐻🐼🐻‍❄️</p>



## ⭐ About
**Invertrix** is a Python-based web app encryption tool that encrypts messages using **matrix-based cipher**.  It shows each step of the encryption and decryption process, making it easier for users to understand the mathematical operations and data structures involved in matrix-based cryptography.

## 🔒 Inverse Matrices to Encrypt and Decrypt Messages
* **Encryption Process Using the Key Matrix**
    1. **Generate the Key Matrix**: A key matrix is created as a crucial part of the encryption process. This matrix should be invertible to allow for successful decryption.
    2. **Encrypt the Message**: The plaintext is divided into blocks, each converted to numeric values. Each block is then multiplied by the key matrix to produce the encrypted ciphertext.
* **Decryption Process Using the Inverse of the Key Matrix**
    1. **Find the Inverse of the Key Matrix**: The key matrix’s inverse is calculated to reverse the encryption process.
    2. **Decrypt the Ciphertext**: The ciphertext is divided into blocks, each multiplied by the inverse of the key matrix, which reconstructs the original plaintext message.

## ✔️ Prerequisites
Before you begin, ensure you have the following installed:
- **Python (version 3.x or later)**
    Ensure that Python is installed on your machine. You can check by running:
    ```bash
    python --version
    ```
- **Required Python libraries**: Numpy and Flask (see below for installation)
  
## ⚙️ Setup
1. Clone the repository:

    ```bash
    git clone https://github.com/PaulVincent-Calvo/Invertrix.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Invertrix
    ```

3. Install the required dependencies (Flask, Python, Numpy):
   ```bash
    pip install -r requirements.txt
    ```
4. Run the main Python script:
   ```bash
    python main.py
    ```
5. After running the script, open a web browser and go to http://127.0.0.1:5000 (or the IP address shown in your terminal).
The Flask app will be served locally, and you should see it running in your browser.

<!-- 6. You can also access the webapp online at [https://invertrix.onrender.com/](https://invertrix.onrender.com/)  
   * *Note: There may be a delay on startup due to the testing phase and free hosting.* -->


## 🔧 Built With

* Frontend: HTML, CSS, JavaScript
* Backend Logic:  Python
* Python Libraries: Numpy
* API: Flask
  
## 📸 Screenshots


## 👥 Members

* [Vivs](https://github.com/VivieneGarcia) - Project Manager/Fullstack Developer 🐻
* [Paul](https://github.com/PaulVincent-Calvo) - Frontend Developer 🐻‍❄️
* [Ace](https://github.com/AcePenaflorida) - Backend Developer 🐼


## 🌷 Acknowledgments
* [Ma'am Fatima](https://github.com/marieemoiselle) - Web Systems Prof 

---
<p align="center"><img src="https://github.com/PaulVincent-Calvo/Invertrix/blob/main/static/assets/invertix-logo.png" alt="Invertrix Logo"></p>

---
