let mode = 'mode1'; // Start with mode1 as default
let currentStepIndex = 0; // Track the current step index
let keyMatrix = null;

const errorSound = new Audio('static/assets/sounds/error.mp3');
const generateSound = new Audio('static/assets/sounds/generate.wav');
const dropdownSound = new Audio('static/assets/sounds/213387__chewiesmissus__cupboarddoorlatchclick1.wav');
const infoSound = new Audio('static/assets/sounds/info.wav');
const cryptSound = new Audio('static/assets/sounds/577026__nezuai__ui-sound-17.wav');
const clearSound = new Audio('static/assets/sounds/342997__zenithinfinitivestudios__ui_correct_button11.wav');

function playErrorSound() {
    errorSound.currentTime = 0;
    errorSound.play();
}
function playClearSound(){
    clearSound.currentTime = 0.3;
    clearSound.play();
}

function playGenerateSound() {
    generateSound.currentTime = 0.5;
    generateSound.play();
}

function playInfoSound() {
    infoSound.currentTime = 0;
    infoSound.play();
}
function playEncryptDecryptSound() {
    cryptSound.currentTime = 0;
    cryptSound.play();
}

const dropdown = document.getElementById('radio-button-grid-size');
const matrixContainer = document.getElementById('matrix-container');
function playDropdownSound() {
    dropdownSound.currentTime = 0;
    dropdownSound.play();
}

// Step names for each mode
const mode1Steps = [
    'STEP 1: Convert Message into a Matrix',
    'STEP 2: Multiply Converted Matrix to the Key Matrix ',
    'RESULT: Encrypted Message'
];
const mode2Steps = [
    'STEP 1: Convert Message into a Matrix',
    'STEP 2: Get the Inverse of the Key Matrix',
    'STEP 3: Multiply Converted Matrix to the Key Matrix Inverse',
    'RESULT: Decrypted Message'
];

const resultsStepsContainer = document.querySelector('.results-steps');


const modeDisplay = document.getElementById('mode-display');
const toggleCheckbox = document.getElementById('encrypt-decrypt-toggle');

function toggleMode() {
    const isEncryptMode = document.getElementById("encrypt-decrypt-toggle").checked;
    const actionButton = document.getElementById("encrypt-decrypt-button");
    const textArea = document.getElementById("text-box");
    const generateKeyButton = document.getElementById("generate-key-button");

    // Remove previous event listeners to avoid duplicates
    textArea.removeEventListener('input', validateNumericInput);
    textArea.removeEventListener('input', validateEncryptInput);
    textArea.removeEventListener('paste', (e) => preventInvalidPaste(e, 'encrypt'));
    textArea.removeEventListener('paste', (e) => preventInvalidPaste(e, 'decrypt'));

    textArea.value = '';

    if (isEncryptMode) {
        actionButton.textContent = "Encrypt";
        textArea.placeholder = "To encrypt text, enter or paste it here. Then select a matrix size, and press 'Encrypt'.";
        generateKeyButton.disabled = false;
        mode = 'mode1';
        method=  'encrypt';

        // Allow only alphabetic characters in Encrypt mode
        textArea.addEventListener('input', validateEncryptInput);
        textArea.addEventListener('paste', (e) => preventInvalidPaste(e, method));

    } else {
        actionButton.textContent = "Decrypt";
        textArea.placeholder = "To decrypt text, enter or paste it here. Then select the matrix size of your key matrix, input its values, and press decrypt.";
        generateKeyButton.disabled = true;
        mode = 'mode2';
        method=  'decrypt';

        // Allow only numeric characters in Decrypt mode
        textArea.addEventListener('input', validateNumericInput);
        textArea.addEventListener('paste', (e) => preventInvalidPaste(e, method));
    }

    currentStepIndex = 0;
    updateStepsHeader();
    updateStepsDisplay();
    scrollToCurrentStep();
}

function updateKeyMatrix() {
    const gridSize = parseInt(document.getElementById('radio-button-grid-size').value);
    console.log("Keymatrix before update:", keyMatrix);

    // Reinitialize keyMatrix as a gridSize x gridSize matrix filled with zeros
    keyMatrix = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

    // Loop through each grid cell and update keyMatrix
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const rowIndex = Math.floor(index / gridSize); // Calculate correct row index
        const colIndex = index % gridSize; // Calculate correct column index
        keyMatrix[rowIndex][colIndex] = parseFloat(cell.value) || 0; // Use 0 for empty or invalid input
    });

    console.log("Updated Keymatrix:", keyMatrix);
}



// Add event listeners to each grid cell to update the keyMatrix on change
function addCellEventListeners() {
    const gridSize = parseInt(document.getElementById('radio-button-grid-size').value);
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        cell.addEventListener('input', () => {
            updateKeyMatrix(); // Update keyMatrix whenever a cell value is changed
        });
    });
}

function updateGrid() {
    const textBoxContent = document.getElementById('text-box').value;
    const gridSize = parseInt(document.getElementById('radio-button-grid-size').value);
    const gridContainer = document.getElementById('matrix-container');
    gridContainer.innerHTML = '';

    const screenWidth = window.innerWidth;
    let cellWidth = screenWidth <= 480 ? '3.5rem' : '5rem'; // 3rem for small screens, 5rem for larger screens

    // Apply the calculated cell width to the grid
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${cellWidth})`; 

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cellInput = document.createElement('input');
        cellInput.className = 'cell';
        cellInput.id = 'inputCell' + i;
        cellInput.type = 'text';
        cellInput.style.textAlign = 'center';

        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        // Add black borders for the outer cells
        if (row === 0) cellInput.classList.add('top-border');
        if (row === gridSize - 1) cellInput.classList.add('bottom-border');
        if (col === 0) cellInput.classList.add('left-border');
        if (col === gridSize - 1) cellInput.classList.add('right-border');

        // Add the event listener for arrow navigation
        cellInput.addEventListener('keydown', (e) => handleArrowNavigation(e, i, gridSize));

        // Add input validation for numbers only
        cellInput.addEventListener('input', (e) => enforceStrictPositiveNumericInput(e));
        cellInput.addEventListener('paste', (e) => blockNonPositiveNumericPaste(e)); // Prevent invalid paste
        gridContainer.appendChild(cellInput);
    }
    addCellEventListeners(); 
    callGenerateKeyMatrix();

    document.getElementById('text-box').value = textBoxContent;
}

function enforceStrictPositiveNumericInput(event) {
    const input = event.target;
    let value = input.value;

    while (value.startsWith(" ") || value.startsWith("-")) {
        if (value.startsWith(" ")) {
            value = value.slice(1); // Remove leading whitespace
        }
        if (value.startsWith("-")) {
            value = value.slice(1); // Remove leading negative sign
        }
    }

    if (!/^\d*$/.test(value)) {
        value = value.replace(/[^0-9]/g, ''); // Remove any non-numeric character
        showCustomAlert("Only positive numeric values are allowed.");
    }
    input.value = value;
}

function blockNonPositiveNumericPaste(event) {
    const pastedData = (event.clipboardData || window.clipboardData).getData('text');
    if (!/^\d*$/.test(pastedData)) {// Validate pasted data: only positive numeric values
        event.preventDefault();
        showCustomAlert("Pasted content must contain only positive numeric values.");
    }
}


function showCustomAlert(message) {
    playErrorSound();
    const modal = document.getElementById('custom-alert');
    const modalMessage = document.getElementById('custom-alert-message');
    modalMessage.textContent = message;
    modal.style.display = 'flex';
}

function closeCustomAlert() {
    const modal = document.getElementById('custom-alert');
    modal.style.display = 'none';
}

function validateNumericInput(event) {
    const input = event.target;
    let value = input.value;

    if (value.trim() === "") {
        input.value = ""; // Ensure the value is fully cleared
        return; // Skip further validation
    }

    // Allow only positive numeric values and spaces between them, with an optional space at the end
    if (!/^\d+(\s+\d+)*\s?$/.test(value)) {
        value = value.replace(/[^0-9\s]/g, ''); // Remove any non-numeric character except spaces
        showCustomAlert("Only positive numeric values and spaces between them are allowed, with an optional space at the end.");
    }

    input.value = value;
}


function validateEncryptInput(event) {
    const input = event.target;
    const value = input.value;

    if (value.trim() === "") {
        input.value = ""; // Ensure the value is fully cleared
        return; // Skip further validation
    }

    // Allow only alphabetic characters (no numbers or symbols)
    if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(value)) { // 
        input.value = value.slice(0, -1); // Remove the last invalid character
        showCustomAlert("Only alphabetic characters and spaces are allowed, and it MUST start with a letter.");
    }
}

function preventInvalidPaste(event, method) {
    const pasteData = event.clipboardData.getData('text'); // Get the pasted content

    // Allow or block based on the method
    if (method === 'encrypt' && !/^[a-zA-Z][a-zA-Z\s]*$/.test(pasteData)) {
        event.preventDefault();
        showCustomAlert("Only alphabetic characters and spaces are allowed, and it MUST start with a letter.");
    } else if (method === 'decrypt' && !/^(-?\d+(\s+-?\d+)*\s?)$/.test(pasteData)) {
        event.preventDefault();
        showCustomAlert("Pasting only positive numeric values and spaces between them are allowed.");
    }
}

async function handleRateLimitPost() {
    try {
        const response = await fetch('/rate_limit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.status === 429) {
            const errorData = await response.json(); 
            const message = errorData.message || "Rate limit exceeded. Please try again later.";
            showCustomAlert(message); 
        } else if (!response.ok) {
            // Handle other non-success responses
            throw new Error(`HTTP error! Status: ${response.status}`);
        } else {

            const result = await response.json();
            console.log("Response:", result);
        }
    } catch (error) {
        console.error("Error:", error);
        showCustomAlert("An unexpected error occurred. Please try again.");
    }
}

function handleArrowNavigation(event, currentIndex, gridSize) {
    let targetIndex;

    switch (event.key) {
        case 'ArrowRight':
            targetIndex = currentIndex + 1;
            break;
        case 'ArrowLeft':
            targetIndex = currentIndex - 1;
            break;
        case 'ArrowDown':
            targetIndex = currentIndex + gridSize;
            break;
        case 'ArrowUp':
            targetIndex = currentIndex - gridSize;
            break;
        default:
            return; 
    }

    event.preventDefault();

    const targetCell = document.getElementById('inputCell' + targetIndex);
    if (targetCell) {
        targetCell.focus();
    }
}

document.getElementById('clear-matrix-button').addEventListener('click', () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.value = '');
    keyMatrix = null;
    matrixContainer.classList.add('shake');
    setTimeout(() => matrixContainer.classList.remove('shake'), 500);
});

document.getElementById('generate-key-button').addEventListener('click', async () => {
    callGenerateKeyMatrix();
});

async function callGenerateKeyMatrix() {
    const gridSize = parseInt(document.getElementById('radio-button-grid-size').value);
    let stopAnimation = null; // Declare the stopAnimation function in a broader scope
    
    try {
        const response = await fetch('/generate-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ size: gridSize })
        });

        if (response.status === 429) {
            const errorData = await response.json();
            const message = errorData.message || "Rate limit exceeded. Please try again later.";
            showCustomAlert(message);
            return;
        } else{
            
    matrixContainer.classList.add('generating');
    setTimeout(() => matrixContainer.classList.remove('generating'), 1200);
            playGenerateSound();
            keyMatrix = await response.json();
            const cells = document.querySelectorAll('.cell');
            stopAnimation = startRandomNumberAnimation(cells);
            setTimeout(() => {
                stopAnimation(); // Stop the random number animation
                keyMatrix.flat().forEach((value, index) => {
                    cells[index].value = value;
                });
            }, 1200); // 1000ms (1 second) delay for visibility of animation
        console.log("SUCK", keyMatrix);
        }
        
    } catch (error) {
        if (stopAnimation) stopAnimation();
        console.error("Error:", error);
        modalMessage.textContent = "An unexpected error occurred in generating the key matrix. Please try again.";
        modal.style.display = 'flex';
    }
    
}

// Helper function for random number animation
function startRandomNumberAnimation(cells) {
    console.log("Starting random number animation...");
    let animationInterval;

    function generateRandomNumbers() {
        cells.forEach((cell, index) => {
            const randomValue = Math.floor(Math.random() * 10000); // Random value for animation
            cell.value = randomValue; // Display random values
        });
    }

    // Start animation
    animationInterval = setInterval(generateRandomNumbers, 100); // Update every 100ms

    return function stopAnimation() {
        clearInterval(animationInterval); // Stop the animation
        console.log("Stopping random number animation...");

    };
}


// Previous step navigation
function previousStep() {
    const stepWidth = resultsStepsContainer.offsetWidth; // Use offsetWidth for accuracy
    console.log("Scrolling to step prev", currentStepIndex, "Width:", stepWidth);
    if (currentStepIndex > 0) {
        currentStepIndex--;
        updateStepsHeader();
        scrollToCurrentStep();
    }
}

// Next step navigation
function nextStep() {
    const steps = mode === 'mode1' ? mode1Steps : mode2Steps;
    const stepWidth = resultsStepsContainer.offsetWidth; // Use offsetWidth for accuracy
    console.log("Scrolling to step next:", currentStepIndex, "Width:", stepWidth);
    if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        updateStepsHeader();
        scrollToCurrentStep();
    }
}

// Update step header text
function updateStepsHeader() {
    const stepsHeader = document.getElementById('results-header-steps');
    const steps = mode === 'mode1' ? mode1Steps : mode2Steps;
    stepsHeader.textContent = steps[currentStepIndex];
}

// Scrolls the results container to the current step
function scrollToCurrentStep() {
    const stepWidth = resultsStepsContainer.offsetWidth; // Use offsetWidth for accuracy
    console.log("Scrolling to step:", currentStepIndex, "Width:", stepWidth);
    resultsStepsContainer.scrollTo({
        left: stepWidth * currentStepIndex,
        behavior: 'smooth'
});
}

// Updates the displayed steps for each mode
function updateStepsDisplay() {
    const stepsContainer = document.querySelector('.results-steps');
    stepsContainer.innerHTML = ''; 

    if (mode === 'mode1') {
        stepsContainer.innerHTML = `
            <div class="step">
                <div class="step-1-container-1 type-a" id="step-1-container-1"></div>
                <div class="step-1-container-2 type-b" id="step-1-container-2">
                
                    <div class = "space-top"></div>
                    <div id = "indices-grid-container"></div>
                    <div class = "space-bottom"></div>

                </div>
            </div>
            <div class="step">
                <div class="step-2-container-1 type-b" id="step-2-container-1">

                    <div class = "space-top"></div>
                    <div id = "copy-grid-container"></div>
                    <div class = "space-bottom"></div>

                </div>
                <div class="step-2-container-2 type-b" id="step-2-container-2">

                    <div class = "space-top"></div>
                    
                    <div id = "copy-key-matrix-container"></div>
                    <div class = "space-bottom"></div>

                </div>
            </div>
            <div class="step">
                <div class="step-3-container-1 type-b" id="step-3-container-1">

                    <div class = "space-top"></div>
                    <div id = "product-matrix-container"></div>
                    <div class = "space-bottom"></div>
                    
                </div>
                
                <div class="step-3-container-2 type-a" id="step-3-container-2">
                    <textarea class = "results-text-box" id = "output-textarea" readonly></textarea>
                    <div class="copy-container">
                        <button class="copy-button" id="copy-button" onclick="copyText()">Copy</button>
                    </div>
                </div>
            </div>`;
    } else if (mode === 'mode2') {
        stepsContainer.innerHTML = `
            <div class="step">
                <div class = "step-1-container-1 type-a" id = "step-1-container-1">
                    <div class = "space-top"></div>
                    <p id = "encrypted-message-container"></p>
                    <div class = "space-bottom"></div>
                </div>
                <div class = "step-1-container-2 type-b" id = "step-1-container-2">
                    <div class = "space-top"></div>
                    <div id = "input-to-grid-matrix-container"></div>
                    <div class = "space-bottom"></div>
                </div>
            </div>
            <div class="step">
                <div class = "step-2-container-1 type-b" id = "step-2-container-1">
                    <div class = "space-top"></div>
                    <div id = "copy-key-matrix-container-decrypt"></div>
                    <div class = "space-bottom"></div>
                </div>

                <div class = "step-2-container-2 type-b" id = "step-2-container-2">
                    <div class = "space-top"></div>
                    <div id = "inverse-key-matrix-container"></div>
                    <div class = "space-bottom"></div>
                </div>
            </div>
            <div class="step">
                <div class = "step-3-container-1 type-b" id = "step-3-container-1">
                    <div class = "space-top"></div>
                    <div id = "input-to-grid-matrix-container-2"></div>
                    <div class = "space-bottom"></div>
                </div>
                <div class = "step-3-container-2 type-b" id = "step-3-container-2">
                    <div class = "space-top"></div>
                    <div id = "inverse-key-matrix-container-2"></div>
                    <div class = "space-bottom"></div>
                </div>
            </div>
            <div class="step">
                <div class = "step-4-container-1 type-b" id = "step-4-container-1">
                    <div class = "space-top"></div>
                    <div id = "product-matrix-container-decrypt"></div>
                    <div class = "space-bottom"></div>
                </div>

                <div class = "step-4-container-2 type-a" id = "step-4-container-2">
                    <textarea class = "results-text-box" id = "decrypted-message-container" readonly></textarea>
                    <div class = "space-bottom"></div>
                </div>
            </div>`;
    }
}
function showResultsModal() {
    const resultsModal = document.getElementById('resultsModal');
    const resultsStepsContainer = document.querySelector('.results-steps');

    resultsStepsContainer.scrollLeft = 0;
    console.log("Modal opened, scrollLeft reset to:", resultsStepsContainer.scrollLeft);

    resultsModal.classList.add('show');
}

async function encrypt(text, gridSize) { 
    if (!text || text.trim() === "") {
        showCustomAlert("Please enter text to encrypt."); 
        return false;
    }

    console.log("Encrypting text:", text);
    console.log("Key matrix: ", keyMatrix);
    try {
        const response = await fetch('/encrypt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, keyMatrix: keyMatrix, gridSize: gridSize })
        });

        // Check for 429 rate limit status code
        if (response.status === 429) {
            const errorData = await response.json();
            const message = errorData.message || "Rate limit exceeded. Please try again later.";
            showCustomAlert(message); 
            return false; 
        }
        // Process successful response
        const data = await response.json();
        
        if (data.error) {
            console.error(data.error);
            showCustomAlert(data.error);  
        } else {
            console.log("Encryption Details:", data);

            updateStepsDisplay();
            currentStepIndex = 0; // Reset to the first step
            updateStepsHeader();

            // Show modal and reset scroll
            showResultsModal();

            displayMessageAndIndices(data.message, data.indices, gridSize);
            displayMatrix(data.reshaped_indices, 'indices-grid-container');
            displayMatrix(data.reshaped_indices, 'copy-grid-container');
            displayMatrix(data.key_matrix, 'copy-key-matrix-container');
            displayMatrix(data.product_matrix, 'product-matrix-container');
            displayResult(data.encrypted_values);
            return true; 
        }
    } catch (error) {
        console.error("Error:", error);
        showCustomAlert("An unexpected error occurred in encrypting. Please try again.");
    }

    
}

function displayResult(encryptedValues) {
    const resultArea = document.getElementById('output-textarea'); 
    resultArea.textContent = encryptedValues.join(' '); 
}

function displayMatrix(Matrix, container) {
    const gridContainer = document.getElementById(container);
    gridContainer.innerHTML = '';

    const numRows = Matrix.length;
    const numCols = Matrix[0].length;

    // Determine viewport width for responsive adjustments
    const viewportWidth = window.innerWidth;

    let minCellWidth, minCellHeight, fontSize, padding;
    padding = '2px';

    if (viewportWidth <= 480) { // Mobile screens
        minCellWidth = 'auto';
        minCellHeight = 'auto';
        fontSize = '0.8rem';
    } else if (viewportWidth <= 768) { // Tablet screens
        minCellWidth = '3rem';
        minCellHeight = '3rem';
        fontSize = '0.9rem';
    } else if (numCols > 9 || numRows > 9) { // Larger matrices
        minCellWidth = '3rem';
        minCellHeight = '3rem';
        fontSize = 'auto';
    } else if (numCols > 5 || numRows > 5) {
        minCellWidth = '4rem';
        minCellHeight = '4rem';
        fontSize = '1rem';
    } else { // Default case
        minCellWidth = '5rem';
        minCellHeight = '5rem';
        fontSize = '1.3rem';
    }

    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, minmax(${minCellWidth}, 1fr))`;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${row}-${col}`;
            cell.textContent = Matrix[row][col];

            cell.style.textAlign = 'center';
            cell.style.display = 'flex';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';
            cell.style.height = minCellHeight;
            cell.style.fontSize = fontSize;
            cell.style.padding = padding;

            if (cell.textContent.length > 8) {
                cell.style.minWidth = 'auto';
                cell.style.minHeight = 'auto';
                cell.style.fontSize = '1rem'; // Reduce font size for large content

                if (viewportWidth <= 480) { // Mobile screens
                    cell.style.minWidth = 'auto';
                    cell.style.minHeight = 'auto';
                    cell.style.fontSize = '0.7rem';
                }
            }

            // Add borders for the outer cells
            if (row === 0) cell.classList.add('top-border');
            if (row === numRows - 1) cell.classList.add('bottom-border');
            if (col === 0) cell.classList.add('left-border');
            if (col === numCols - 1) cell.classList.add('right-border');

            gridContainer.appendChild(cell);
        }
    }
}



function displayMessageAndIndices(message, indices, gridSize) {
    const container = document.getElementById('step-1-container-1');
    console.log(message,indices);
    container.innerHTML = ''; 

    for (let i = 0; i < indices.length; i++) {
        const cell = document.createElement('div');
        cell.className = 'message-and-index';
        cell.textContent = `${message[i]} ➜ ${indices[i]}`; 
        container.appendChild(cell);

        if ((i + 1) % gridSize === 0) {
            container.appendChild(document.createElement('br'));
        }
    }
}

async function decrypt(text, gridSize) {
    if (!text || text.trim() === "") {
        showCustomAlert("Please enter the encrypted numeric message to decrypt.");
        return false; // Indicate failure
    }

    console.log("Decrypting text:", text);
    console.log("keyMatrix:", keyMatrix);
    
    try{
        const response = await fetch('/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, keyMatrix: keyMatrix, gridSize: gridSize })
        })

        if (response.status === 429) {
            const errorData = await response.json();
            const message = errorData.message || "Rate limit exceeded. Please try again later.";
            showCustomAlert(message); 
            return false; 
        }

        const data = await response.json();
        if (data.error) {
            showCustomAlert(data.error);
            return false;
        } else {
            console.log("Decryption Details:", data);

            updateStepsDisplay();
            currentStepIndex = 0;
            updateStepsHeader();

            showResultsModal();
            
            displayMessage(text, 'encrypted-message-container');
            displayMatrix(data.reshaped_values_array, 'input-to-grid-matrix-container');
            displayMatrix(data.key_matrix, 'copy-key-matrix-container-decrypt');
            displayMatrix(data.rounded_inverse_key_matrix, 'inverse-key-matrix-container');

            displayMatrix(data.rounded_inverse_key_matrix, 'inverse-key-matrix-container-2');
            displayMatrix(data.reshaped_values_array, 'input-to-grid-matrix-container-2');

            displayMatrix(data.reshaped_product_matrix, 'product-matrix-container-decrypt');
            displayMessage(data.decrypted_message, 'decrypted-message-container'); 
            return true; 
        }

    }catch (error) {
        console.error("Error:", error);
        showCustomAlert("Invalid key matrix or encrypted message. The resulting product matrix contains invalid indices. Please try again.");
        return false;
    }
    
}

function displayMessage(text, container) {
    messageContainer = document.getElementById(container);
    messageContainer.textContent = text;
    console.log("done");
}

// Get modal elements
const resultsModal = document.getElementById('resultsModal');
document.getElementById('encrypt-decrypt-button').addEventListener('click', async () => {
    
    const text = document.getElementById('text-box').value;
    const gridSize = parseInt(document.getElementById('radio-button-grid-size').value);

    if (mode === 'mode1') { // Encrypt mode
        isSuccessful = await encrypt(text, gridSize);
    } else if (mode === 'mode2') { // Decrypt mode
        isSuccessful = await decrypt(text, gridSize);
    }
    if (isSuccessful) {
        playEncryptDecryptSound();
        resultsModal.style.display = 'block';
    }
});

function copyText() {
    playDropdownSound();
    const textarea = document.getElementById('output-textarea');

    // Select the text content
    textarea.select();
    textarea.setSelectionRange(0, 99999);  // For mobile devices

    // Attempt to use the Clipboard API (modern approach)
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textarea.value)
            .then(() => {
                console.log('Text copied to clipboard');
                // Optionally, show a success notification or animation
            })
            .catch(err => {
                console.error('Clipboard write failed', err);
            });
    } else {
        // Fallback for browsers that don't support Clipboard API
        document.execCommand('copy');
        console.log('Text copied to clipboard using execCommand');
    }
}


function closeResultsModal() {
    const resultsModal = document.getElementById('resultsModal');
    resultsModal.classList.remove('show');
    console.log("Modal closed");
}

window.addEventListener('click', (event) => {
    const resultsModal = document.getElementById('resultsModal');
    if (event.target == resultsModal) {
        closeResultsModal();
    }
});


//START 
let defaultGridSize = 2;

window.onload = () => {
    resultsModal.style.display = 'none';
    updateGrid();
    callGenerateKeyMatrix();
    toggleMode();
    updateStepsHeader();
    updateStepsDisplay();
    scrollToCurrentStep();

};

document.getElementById('previous-button').addEventListener('click', previousStep);
document.getElementById('next-button').addEventListener('click', nextStep);
dropdown.addEventListener('mousedown', playDropdownSound);