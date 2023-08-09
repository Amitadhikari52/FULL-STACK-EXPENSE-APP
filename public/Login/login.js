document.getElementById('loginForm').addEventListener('submit', login);

function login(e) {
    e.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    const userCredentials = {
        email,
        password
    };

    // Simulate a network request using Axios
    simulateNetworkRequest(userCredentials)
        .then(response => {
            if (response.status === 200) {
                displayMessage(response.data.message, true);
            } else {
                throw new Error("Login failed.");
            }
        })
        .catch(error => {
            console.error(error);
            displayMessage("An error occurred during login.", false);
        });
}

function simulateNetworkRequest(userCredentials) {
    // Simulate successful response (status 200)
    const response = {
        status: 200,
        data: {
            message: 'Login successful!'
        }
    };

    // Simulate an error response (status 401) for testing
    // const response = {
    //     status: 401,
    //     data: {
    //         message: 'Unauthorized'
    //     }
    // };

    // Return a Promise that resolves with the simulated response
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(response);
        }, 1000); // Simulate a delay of 1 second
    });
}

function displayMessage(msg, successOrFailure) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = '';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${successOrFailure ? 'alert-success' : 'alert-danger'}`;
    alertDiv.textContent = msg;

    messageDiv.appendChild(alertDiv);
}
