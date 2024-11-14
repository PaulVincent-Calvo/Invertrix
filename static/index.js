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
    callGenerateKeyMatrix();
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
    callGenerateKeyMatrix();
});

async function callGenerateKeyMatrix(){
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
}
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
                <div class="step-1-container-2 type-b" id="step-1-container-2">
                
                <div class = "space-top"></div>
                <div id= "indices-grid-container"></div>
                <div class = "space-bottom"></div>

                </div>
            </div>
            <div class="step">
                <div class="step-2-container-1 type-b" id="step-2-container-1">

                    <div class = "space-top"></div>
                    <div id= "copy-key-matrix-container"></div>
                    <div class = "space-bottom"></div>

                </div>
                <div class="step-2-container-2 type-b" id="step-2-container-2">

                    <div class = "space-top"></div>
                    <div id = "copy-grid-container"></div>
                    <div class = "space-bottom"></div>

                </div>
            </div>
            <div class="step">
                <div class="step-3-container-1 type-b" id="step-3-container-1">

                    <div class = "space-top"></div>
                    <div id= "product-matrix-container"></div>
                    <div class = "space-bottom"></div>
                    
                </div>
                <div class="step-3-container-2 type-a" id="step-3-container-2">
                    <div class = "space-top"></div>
                    <textarea id="encrypted-message-container" class="output-textarea" readonly>Answer will appear here</textarea></div>
                    <div class = "space-bottom"></div>
                </div>
            </div>
        `;
    } else if (mode === 'mode2') {
        stepsContainer.innerHTML = `
        <div class = "steps-container>
            <div class="step">
                <div class = "step-1-container-1 type-a" id = "step-1-container-1">
                    <div class = "space-top"></div>
                    <p id= "encrypted-message-container"></p>
                    <div class = "space-bottom"></div>
                </div>
                <div class = "step-1-container-2 type-b" id = "step-1-container-2">
                    <div class = "space-top"></div>
                    <div id= "input-to-grid-matrix-container"></div>
                    <div class = "space-bottom"></div>
                </div>
            </div>
            <div class="step">
                <div class = "step-2-container-1 type-b" id = "step-2-container-1">
                    <div class = "space-top"></div>
                    <div id= "copy-key-matrix-container-decrypt"></div>
                    <div class = "space-bottom"></div>
                </div>

                <div class = "step-2-container-2 type-b" id = "step-2-container-2">
                    <div class = "space-top"></div>
                    <div id= "inverse-key-matrix-container"></div>
                    <div class = "space-bottom"></div>
                </div>
            </div>
            <div class="step">
                <div class = "step-3-container-1 type-b" id = "step-3-container-1">
                    <div class = "space-top"></div>
                    <div id= "inverse-key-matrix-container-2"></div>
                    <div class = "space-bottom"></div>
                </div>
                <div class = "step-3-container-2 type-b" id = "step-3-container-2">
                    <div class = "space-top"></div>
                    <div id= "input-to-grid-matrix-container-2"></div>
                    <div class = "space-bottom"></div>
                </div>
            </div>
            <div class="step">
                <div class = "step-4-container-1 type-b" id = "step-4-container-1">
                    <div class = "space-top"></div>
                    <div id= "product-matrix-container-decrypt"></div>
                    <div class = "space-bottom"></div>
                </div>

                <div class = "step-4-container-2 type-a" id = "step-4-container-2">
                    <div class = "space-top"></div>
                    <p id= "decrypted-message-container"></p>
                    <div class = "space-bottom"></div>
                </div>
            </div>
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
            console.log("Message:", data.message); // User input
            console.log("Indices:", data.indices); // User Input to Numbers
            console.log("Reshaped Indices:", data.reshaped_indices); 
            console.log("Key Matrix:", data.key_matrix); 
            console.log("Product Matrix:", data.product_matrix);  
            console.log("Encrypted Values:", data.encrypted_values);  

            displayMessageAndIndices(data.message,data.indices,gridSize);
            displayMatrix(data.reshaped_indices,'indices-grid-container');
            displayMatrix(data.reshaped_indices,'copy-grid-container');
            displayMatrix(data.key_matrix, 'copy-key-matrix-container');
            displayMatrix(data.product_matrix, 'product-matrix-container');
            displayResult(data.encrypted_values);
        }
    })
    .catch(error => console.error('Error:', error));
}

function displayResult(encryptedValues) {
    const resultArea = document.getElementById('encrypted-message-container'); 
    resultArea.textContent = encryptedValues.join(' '); 
}

function displayMatrix(Matrix, container) {
    const gridContainer = document.getElementById(container);
    gridContainer.innerHTML = ''; 

    const numRows = Matrix.length;
    const numCols = Matrix[0].length;

    // Adjust default cell size and font size based on matrix dimensions
    let minCellWidth, minCellHeight, fontSize;
    if (numCols > 9 || numRows > 9) {
        minCellWidth = 'auto';
        minCellHeight = 'auto';
        fontSize = 'auto';  // Smaller font for larger matrices
    } else if (numCols > 5 || numRows > 5) {
        minCellWidth = '4rem';
        minCellHeight = '4rem';
        fontSize = '1rem';  // Medium font size
    } else {
        minCellWidth = '5rem';
        minCellHeight = '5rem';
        fontSize = '20px';  // Larger font for smaller matrices
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

            if (cell.textContent.length > 8) {
                cell.style.minWidth = 'auto';  
                cell.style.minHeight = 'auto';  
                cell.style.fontSize = '1rem';
                
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
    container.innerHTML = ''; 

    for (let i = 0; i < indices.length; i++) {
        const cell = document.createElement('div');
        cell.className = 'message-and-index';
        cell.textContent = `${message[i]} ${indices[i]}`; 
        container.appendChild(cell);

        if ((i + 1) % gridSize === 0) {
            container.appendChild(document.createElement('br'));
        }
    }
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
            console.log("Decryption Details:", data);
            console.log("Key Matrix: ", data.key_matrix);
            console.log("User Input for decrypt: ", data.reshaped_values_array);
            console.log("Inverse of Key Matrix: ", data.inverse_key_matrix);
            console.log("Rounded Inverse Matrix: ", data.rounded_inverse_key_matrix)
            console.log("Result in Number Form: ", data.reshaped_product_matrix);
            console.log("Decrypted Message: ", data.decrypted_message)
            
            displayMessage(text, 'encrypted-message-container');
            displayMatrix(data.reshaped_values_array, 'input-to-grid-matrix-container');

            displayMatrix(data.key_matrix, 'copy-key-matrix-container-decrypt');
            displayMatrix(data.rounded_inverse_key_matrix, 'inverse-key-matrix-container');

            displayMatrix(data.rounded_inverse_key_matrix, 'inverse-key-matrix-container-2');
            displayMatrix(data.reshaped_values_array, 'input-to-grid-matrix-container-2');

            displayMatrix(data.reshaped_product_matrix, 'product-matrix-container-decrypt');
            displayMessage(data.decrypted_message, 'decrypted-message-container'); 

        }
    })
    .catch(error => console.error('Error:', error));
}

function displayMessage(text, container) {
    messageContainer = document.getElementById(container);
    messageContainer.textContent = text;
    console.log("done");
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
    callGenerateKeyMatrix();
    toggleMode();
    updateStepsHeader();
    updateStepsDisplay();
    scrollToCurrentStep();
};

document.getElementById('previous-button').addEventListener('click', previousStep);
document.getElementById('next-button').addEventListener('click', nextStep);
