<p align="center"><img src="https://github.com/PaulVincent-Calvo/Invertrix/blob/main/static/assets/invertrix-favicon.png" alt="Invertrix Logo"></p>
<h3 align="center">⚠️ Status: Under Development ⚠️</h3>
<h1 align="center">Invertrix: Visual Inverse Matrix Cipher</h1>
<p align="center">by <strong>We Bare Bears</strong> 🐻🐼🐻‍❄️</p>


## ⭐ Project Overview
**Invertrix** is a Python-based web app encryption tool that encrypts messages using **matrix-based cipher**.  It shows each step of the encryption and decryption process, making it easier for users to understand the mathematical operations involved in matrix-based cryptography. Key features include dynamic key generation, detailed encryption and decryption steps, input validation, and rate-limiting to ensure security and functionality.

## 📐 System Architecture
**Key Components:**
* **Frontend (Web Interface):**
   * Built with HTML, CSS, and JavaScript to
   * Allow users to input messages, click buttons and view encryption or decryption results.

* **Backend (Flask API):**
   * Flask, a Python framework, acts as the API that handles user requests.
   * Handles matrix operations, encryption, and decryption logic using Python.
 
**Component Interactions:**
* Users input a message and keymatrix into the Frontend.
* The Frontend sends the message and keymatrix to the Backend via API calls (Flask).
* The Backend processes the message using Python (with NumPy) to perform matrix-based transformations like encryption or decryption.
* The Backend returns the processed results as JSON.
* The Frontend dynamically displays the results to the user.


## 🔒 Formula: Inverse Matrices to Encrypt and Decrypt Messages
* **Encryption Process**
    1. **Key Matrix Generation:** Create an invertible key matrix.
    2. **Encrypting the Message:** Convert the message into numeric values (M), reshape it into a matrix, and then multiply the key matrix and message matrix 
        **(C = M × K)**
* **Decryption Process**
    1. **Key Matrix Inversion:**: Compute the inverse of the key matrix (K^-1) to reverse encryption.
    2. **Decrypting the Ciphertext**: Multiply the ciphertext (C) with (K^-1), reshape it, and map values back to the alphabet
       **(M = C × K^-1)**
  
## 🤖 Applied Computer Science Concept
* **Cryptography**: Invertrix applies encryption and decryption, a branch of computer science dedicated to securing data by transforming it into unreadable formats.

## 🧬 Algorithms Used
* **Matrix Key Generation:** Randomly generates an invertible matrix using NumPy.
* **Encryption Algorithm:**
  * Maps each character of the plaintext to a numeric value.
  * Converts the numeric sequence into a matrix and multiplies it with the key matrix to produce ciphertext.
* **Decryption Algorithm:**
  * Computes the inverse of the key matrix.
  * Multiplies the ciphertext matrix by the inverse matrix.
  * Maps numeric values back to their corresponding characters.

## 🛡️ Security Mechanisms
* **Rate Limiting:** Prevents excessive API requests, mitigating DoS attacks.
* **Backend-only Processing:** Sensitive operations, such as key generation and matrix inversion, occur server-side, ensuring algorithms remain secure.
* **Input Validation:** User inputs are **validated** and **sanitized** to ensure data integrity and prevent any issues during processing.

## 🤔 Development Process and Design Decisions
The development of Invertrix focused on making the web app easy to use, visually appealing, and functional. 

1. **Modular Design:** The backend uses separate classes for tasks like encryption, decryption, and validation, making the code easy to maintain and understand.
2. **User Experience Focus:** The interface was designed with simplicity in mind, ensuring users can easily interact with the web app.
3. **Error Handling:** Real-time input validation and meaningful error messages guide users to correct issues efficiently.

## ✅ Correctness and Efficiency
**Ensuring Correctness:**
* Inputs are validated to ensure correct formats, preventing errors.
* Matrix operations are checked for invertibility to ensure accuracy.

**Ensuring Efficiency:**
  * NumPy optimizes matrix operations for faster computation.
  * Rate limiting helps prevent spamming by controlling the number of requests users can make in a given time frame

## 🏃 How to Run the Project
You can access the web app online at https://invertrix.onrender.com/
###### *Note: The app is hosted on a free Render account, so there may be a slight delay in loading initially. Please be patient.*

If you prefer to run the web app locally, ensure you have the following installed:
- **Python (version 3.x or later)** 
- **Required Python libraries**: Numpy, Flask & Flask-limiter (see below for installation)
  
1. Clone the repository:

    ```bash
    git clone https://github.com/PaulVincent-Calvo/Invertrix.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Invertrix
    ```

3. Install the required dependencies (Flask, Numpy & Flask-limiter):
   ```bash
    pip install -r requirements.txt
    ```
4. Run the main Python script:
   ```bash
    python main.py
    ```
5. After running the script, open a web browser and go to http://127.0.0.1:5000 (or the IP address shown in your terminal).
The Flask app will be served locally, and you should see it running in your browser.


## 👥 Contributors

* [Vivs](https://github.com/VivieneGarcia) - Project Manager/Fullstack Developer 🐻
* [Paul](https://github.com/PaulVincent-Calvo) - Frontend Developer 🐻‍❄️
* [Ace](https://github.com/AcePenaflorida) - Backend Developer 🐼


## 🌷 Acknowledgments
* [Ma'am Fatima](https://github.com/marieemoiselle) - Web Systems Prof
* **Sounds Used:**
  *

## 📸 Screenshots 
<!-- Hindi need. Gusto ko lng may ganto para may mabalikan ako sa future. wow future hehehe 🤓 -->

## 🔧 Built With
* Frontend: HTML, CSS, JavaScript
* Backend Logic:  Python + Numpy Library
* API: Flask
---
<p align="center"><img src="https://github.com/PaulVincent-Calvo/Invertrix/blob/main/static/assets/invertix-logo.png" alt="Invertrix Logo"></p>

---
