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
    } else {
        actionButton.textContent = "Decrypt";
        textArea.placeholder = "To decrypt text, enter or paste it here. Then select the matrix size of your key matrix, input its values, and press decrypt.";
        generateKeyButton.disabled = true;
    }
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
    
    const keyMatrix = await response.json();
    const cells = document.querySelectorAll('.cell');
    keyMatrix.flat().forEach((value, index) => {
        cells[index].value = value;
    });
});


//START 

let defaultGridSize = 2;

window.onload = () => {
    updateGrid(defaultGridSize); 
    toggleMode();
};
