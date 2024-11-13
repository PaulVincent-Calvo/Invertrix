let mode = 'mode1'; // Start with mode1 as default
let currentStepIndex = 0; // Track the current step index
let keyMatrix = null;

// Step names for each mode
const mode1Steps = [
    'Convert Message into a Matrix',
    'Multiply Key Matrix to the Converted Matrix',
    'Result'
];
const mode2Steps = [
    'Convert Message into a Matrix',
    'Get the Inverse of the Key Matrix',
    'Multiply Key Matrix Inverse to the Converted Matrix',
    'Result'
];

const resultsStepsContainer = document.querySelector('.results-steps');

function toggleMode() {
    const isEncryptMode = document.getElementById("encrypt-decrypt-toggle").checked;
    const actionButton = document.getElementById("encrypt-decrypt-button");
    const textArea = document.getElementById("text-box");
    const gridInputs = document.querySelectorAll('.cell'); // Select all grid input cells
    const generateKeyButton = document.getElementById("generate-key-button");
    
    if (isEncryptMode) {
        actionButton.textContent = "Encrypt";
        textArea.placeholder = "To encrypt text, enter or paste it here. Then select a matrix size, and press “Encrypt”.";
        generateKeyButton.disabled = false;
        mode = 'mode1';
    } else {
        actionButton.textContent = "Decrypt";
        textArea.placeholder = "To decrypt text, enter or paste it here. Then select the matrix size of your key matrix, input its values, and press decrypt.";
        generateKeyButton.disabled = true;
        mode = 'mode2';
    }

    currentStepIndex = 0;
    updateStepsHeader();
    updateStepsDisplay();
    scrollToCurrentStep();
}

function updateKeyMatrix() {
    const gridSize = parseInt(document.getElementById('radio-button-grid-size').value);
    keyMatrix = [];
    
    // Loop through each grid cell and store the values in the keyMatrix
    const cells = document.querySelectorAll('.cell');
    let rowIndex = -1;

    cells.forEach((cell, index) => {
        if (index % gridSize === 0) rowIndex++;
        if (!keyMatrix[rowIndex]) keyMatrix[rowIndex] = [];
        keyMatrix[rowIndex].push(parseFloat(cell.value) || 0); // Use 0 if input is empty or invalid
    });
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
    const gridSize = parseInt(document.getElementById('radio-button-grid-size').value);
    const gridContainer = document.getElementById('matrix-container');
    gridContainer.innerHTML = '';

    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 5rem)`; // WIDTH OF CELL: 5rem 
    

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

        gridContainer.appendChild(cellInput);
    }
    addCellEventListeners(); 
    // Call toggleMode after the grid is generated to set correct interaction mode
    toggleMode();
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
});

document.getElementById('generate-key-button').addEventListener('click', async () => {
    const gridSize = parseInt(document.getElementById('radio-button-grid-size').value);
    
    const response = await fetch('/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: gridSize })
    });
    
    keyMatrix = await response.json();
    const cells = document.querySelectorAll('.cell');
    keyMatrix.flat().forEach((value, index) => {
        cells[index].value = value;
    });
});

// Previous step navigation
function previousStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        updateStepsHeader();
        scrollToCurrentStep();
    }
}

// Next step navigation
function nextStep() {
    const steps = mode === 'mode1' ? mode1Steps : mode2Steps;
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
    const stepWidth = resultsStepsContainer.clientWidth;
    resultsStepsContainer.scrollTo({
        left: stepWidth * currentStepIndex,
        behavior: 'smooth'
    });
}

// Updates the displayed steps for each mode
function updateStepsDisplay() {
    const stepsContainer = document.querySelector('.results-steps');
    stepsContainer.innerHTML = ''; // Clear existing content

    if (mode === 'mode1') {
        stepsContainer.innerHTML = `
            <div class="step">
                <div class="step-1-container-1 type-a" id="step-1-container-1"></div>
                <div class="step-1-container-2 type-b" id="step-1-container-2"></div>
            </div>
            <div class="step">
                <div class="step-2-container-1 type-b" id="step-2-container-1"></div>
                <div class="step-2-container-2 type-b" id="step-2-container-2"></div>
            </div>
            <div class="step">
                <div class="step-3-container-1 type-b" id="step-3-container-1"></div>
                <div class="step-3-container-2 type-a" id="step-3-container-2"></div>
            </div>
        `;
    } else if (mode === 'mode2') {
        stepsContainer.innerHTML = `
            <div class="step">
                <div class = "step-1-container-1 type-a" id = "step-1-container-1"></div>
                <div class = "step-1-container-2 type-b" id = "step-1-container-2"></div>
            </div>
            <div class="step">
                <div class = "step-2-container-1 type-b" id = "step-2-container-1"></div>
                <div class = "step-2-container-2 type-b" id = "step-2-container-2"></div>
            </div>
            <div class="step">
                <div class = "step-3-container-1 type-b" id = "step-3-container-1"></div>
                <div class = "step-3-container-2 type-b" id = "step-3-container-2"></div>
            </div>
            <div class="step">
                <div class = "step-4-container-1 type-b" id = "step-4-container-1"></div>
                <div class = "step-4-container-2 type-a" id = "step-4-container-2"></div>
            </div>
        `;
    }
}

async function encrypt(text, gridSize) {
    console.log("Encrypting text:", text);
    console.log("Encryption done");
    fetch('/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, keyMatrix: keyMatrix, gridSize: gridSize })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
        } else {
            console.log("Encryption Details:", data);
            // Access individual properties as needed
            console.log("Message:", data.message);  // "message" instead of "Message"
            console.log("Indices:", data.indices);  // "indices" instead of "Indices"
            console.log("Reshaped Indices:", data.reshaped_indices);  // "reshaped_indices" instead of "ReshapedIndices"
            console.log("Key Matrix:", data.key_matrix);  // "key_matrix" instead of "KeyMatrix"
            console.log("Product Matrix:", data.product_matrix);  // "product_matrix" instead of "ProductMatrix"
            console.log("Encrypted Values:", data.encrypted_values);  

            // dine na maglalagay ng functions for showing the results
        }
    })
    .catch(error => console.error('Error:', error));
}

async function decrypt(text, gridSize) {
    console.log("Decrypting text:", text);
    
    const response = await fetch('/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, keyMatrix: keyMatrix, gridSize: gridSize })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
        } else {
            console.log("Decryption result:", data.decrypted_message);

            // dine na maglalagay ng functions for showing the results for decrypt bukas n uli
            //const decryptedMessageContainer = document.getElementById('decrypted-message'); SAMPLE
            //decryptedMessageContainer.textContent = data.decrypted_message;

            
        }
    })
    .catch(error => console.error('Error:', error));
}

// Toggle button function to call Encrypt or Decrypt based on mode
document.getElementById('encrypt-decrypt-button').addEventListener('click', async () => {
    const text = document.getElementById('text-box').value;
    const gridSize = parseInt(document.getElementById('radio-button-grid-size').value);

    if (mode === 'mode1') { // Encrypt mode
        await encrypt(text, gridSize);
    } else if (mode === 'mode2') { // Decrypt mode
        await decrypt(text, gridSize);
    }
});

//START 

let defaultGridSize = 2;

window.onload = () => {
    updateGrid();
    toggleMode();
    updateStepsHeader();
    updateStepsDisplay();
    scrollToCurrentStep();
};

document.getElementById('previous-button').addEventListener('click', previousStep);
document.getElementById('next-button').addEventListener('click', nextStep);
