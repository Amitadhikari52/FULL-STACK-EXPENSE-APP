const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk')
const bcrypt = require('bcrypt');

const User = require('../models/userModel');
const Forgotpassword = require('../models/forgotpasswordModel');


const forgotpassword = async (req, res) => {
  try {

    const client = Sib.ApiClient.instance;

    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.API_KEY

    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const id = uuid.v4();
      await user.createForgotpassword({ id, active: true });

      const sender = {
        email,
      };

      const receivers = [
        {
          email: 'adhikariamit098@gmail.com',
        },
      ];

      const emailContent = {
        subject: 'Sending with Sendinblue is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset Password</a>`,
      };

      await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        ...emailContent,
      });

      return res.status(200).json({ message: 'Password reset email sent', success: true });
    } else {
      return res.status(404).json({ message: 'User not found', success: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing request', success: false });
  }
};

const resetpassword = async (req, res) => {
  try {
    const id = req.params.id;
    const forgotpasswordrequest = await Forgotpassword.findOne({ where: { id } });

    if (forgotpasswordrequest) {
      await forgotpasswordrequest.update({ active: false });

      const htmlResponse = `
        <html>
          <head>
          <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .form-container {
            background-color: #f5f5f5;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
            width: 350px;
          }
          .form-container h1 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #333;
            text-align: center;
          }
          label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
          }
          input {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
          }
          button {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 12px 18px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
          }
          button:hover {
            background-color: #0056b3;
          }
        </style>
        
          </head>
          <body>
            <div class="form-container">
              <form action="/password/updatepassword/${id}" method="get">
                <label for="newpassword">Enter New Password</label>
                <input name="newpassword" type="password" required>
                <button>Reset Password</button>
              </form>
            </div>
          </body>
        </html>
      `;

      res.status(200).send(htmlResponse);
    }
  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    res.status(500).json({ error: 'An error occurred', success: false });
  }
};


const updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    const resetpasswordrequest = await Forgotpassword.findOne({ where: { id: resetpasswordid } });

    if (!resetpasswordrequest) {
      return res.status(404).json({ error: 'No user exists', success: false });
    }

    const user = await User.findOne({ where: { id: resetpasswordrequest.userId } });

    if (!user) {
      return res.status(404).json({ error: 'No user exists', success: false });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(newpassword, saltRounds);

    await user.update({ password: hash });

    // Send an alert message
    const alertScript = `
      <script>
        alert('Password updated successfully. You will be redirected to the login page.');
        window.location.href = '/login'; // Redirect to login page
      </script>
    `;

    res.status(200).send(alertScript); // Respond with the alert script
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred', success: false });
  }
};

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword
}