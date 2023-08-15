async function login(e) {
    try {
        e.preventDefault();

        const loginDetails = {
            email: e.target.email.value,
            password: e.target.password.value
        };
        console.log(loginDetails);
        const response = await axios.post('http://localhost:3000/user/login', loginDetails).then(response => {
            if (response.status === 200) {
                alert(response.data.message);
                localStorage.setItem('token',response.data.token)
                window.location.href = "/expenses"
            } else {
                throw new Error(response.data.message);
            }        
        }).catch(err => {
            console.log(JSON.stringify(err));
            document.body.innerHTML += `<div style="color: red;">${err.message}</div>`;
        });
    } catch (err) {
        console.error(err);
    }
}


// Show the forgot password modal when the button is clicked
document.getElementById('forgotPasswordBtn').addEventListener('click', function () {
    $('#forgotPasswordModal').modal('show');
  });
  
  // Handle the form submission
  document.getElementById('forgotPasswordForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
  
    try {
      // Replace the URL with the actual backend route
      const response = await axios.post('http://localhost:3000/password/forgotpassword', { email });
  
      // Display a success message to the user
      alert('Password reset email sent! Check your inbox.');
  
      // Hide the modal
      $('#forgotPasswordModal').modal('hide');
    } catch (error) {
      // Display an error message if something goes wrong
      alert('Failed to send password reset email.');
      console.error(error);
    }
  });
  
  
  

