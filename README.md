<p align="center"><img src="https://github.com/PaulVincent-Calvo/Invertrix/blob/main/static/assets/invertrix-favicon.png" alt="Invertrix Logo"></p>
<h3 align="center">⚠️ Status: Under Development ⚠️</h3>
<h1 align="center">Invertrix: Visual Inverse Matrix Cipher</h1>
<p align="center">by <strong>We Bare Bears</strong> 🐻🐼🐻‍❄️</p>



## ⭐ Project Overview
**Invertrix** is a Python-based web app encryption tool that encrypts messages using **matrix-based cipher**.  It shows each step of the encryption and decryption process, making it easier for users to understand the mathematical operations and data structures involved in matrix-based cryptography.
## 📐 System Architecture
**The system consists of two main components:**

* **Frontend (Web Interface):** Built with HTML/CSS and JavaScript, it provides users with an interactive interface to input messages and view encrypted/decrypted outputs
  * bla bla bla ...
* **Backend (Python)**: The server-side logic handles the encryption and decryption processes, utilizing matrix operations to transform plaintext to ciphertext and vice versa.
   * show formula
 
<!-- ## 🔒 Core Concept: Inverse Matrices to Encrypt and Decrypt Messages
* **Encryption Process Using the Key Matrix**
    1. **Generate the Key Matrix**: A key matrix is created as a crucial part of the encryption process. This matrix should be invertible to allow for successful decryption.
    2. **Encrypt the Message**: The plaintext is divided into blocks, each converted to numeric values. Each block is then multiplied by the key matrix to produce the encrypted ciphertext.
* **Decryption Process Using the Inverse of the Key Matrix**
    1. **Find the Inverse of the Key Matrix**: The key matrix’s inverse is calculated to reverse the encryption process.
    2. **Decrypt the Ciphertext**: The ciphertext is divided into blocks, each multiplied by the inverse of the key matrix, which reconstructs the original plaintext message -->
  
## 🤖 Applied Computer Science Concept
* **Cryptography**: Invertrix applies encryption and decryption, a branch of computer science dedicated to securing data by transforming it into unreadable formats.

## 🧬 Algorithms Used
* **Matrix Multiplication:** The core algorithm for both encryption and decryption, where each message block is multiplied by the key matrix (or its inverse) to generate encrypted or decrypted data.
* **Matrix Inversion:** Used to decrypt the message, involving calculating the inverse of the key matrix to reverse the encryption.

## 🛡️ Security Mechanisms
* Sensitive operations like **encryption and decryption are handled on the backend**. This ensures that the core algorithms are not exposed to the client-side, preventing unauthorized users from accessing or modifying the encryption keys or processes.
* User inputs are **validated** and **sanitized** to ensure data integrity and prevent any issues during processing.

## 🤔 Development Process and Design Decisions

## ✅ Correctness and Efficiency

## 🏃 How to Run the Project
   Before you begin, ensure you have the following installed:
- **Python (version 3.x or later)** 
- **Required Python libraries**: Numpy and Flask (see below for installation)
  
1. Clone the repository:

    ```bash
    git clone https://github.com/PaulVincent-Calvo/Invertrix.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Invertrix
    ```

3. Install the required dependencies (Flask and Numpy):
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


## 👥 Contributors

* [Vivs](https://github.com/VivieneGarcia) - Project Manager/Fullstack Developer 🐻
* [Paul](https://github.com/PaulVincent-Calvo) - Frontend Developer 🐻‍❄️
* [Ace](https://github.com/AcePenaflorida) - Backend Developer 🐼


## 🌷 Acknowledgments
* [Ma'am Fatima](https://github.com/marieemoiselle) - Web Systems Prof 

---
<p align="center"><img src="https://github.com/PaulVincent-Calvo/Invertrix/blob/main/static/assets/invertix-logo.png" alt="Invertrix Logo"></p>

---
