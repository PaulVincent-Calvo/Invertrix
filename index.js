function toggleMode() {
    const isEncryptMode = document.getElementById("encrypt-decrypt-toggle").checked;
    const actionButton = document.getElementById("encrypt-decrypt-button");
    const textArea = document.getElementById("text-box");

    if (isEncryptMode) {
        actionButton.textContent = "Encrypt";
        textArea.placeholder = "To encrypt text, enter or paste it here. Then select a matrix size, and press “Encrypt”. Alternatively, you can enter values to the matrix before pressing “Encrypt”.";
    } else {
        actionButton.textContent = "Decrypt";
        textArea.placeholder = "To decrypt text, enter or paste it here. Then select the matrix size of your key matrix, input its values, and press decrypt. Note that if any of the values are incorrect, the output will not be the intended message.";

    }
}

window.onload = toggleMode;