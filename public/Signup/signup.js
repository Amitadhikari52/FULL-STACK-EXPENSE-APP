function signup(e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    const userDetails = {
        name,
        email,
        password
    };

    displayMessage("User registered successfully!", true);
}

function displayMessage(msg, successOrFailure) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = '';

    const messageElement = document.createElement('h2');
    messageElement.style.color = successOrFailure ? 'green' : 'red';
    messageElement.textContent = msg;

    messageDiv.appendChild(messageElement);
}
