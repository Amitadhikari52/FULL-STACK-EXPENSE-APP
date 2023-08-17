const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk')
const bcrypt = require('bcrypt');

const User = require('../models/userModel');
const Forgotpassword = require('../models/forgotpasswordModel');

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY

const tranEmailApi = new Sib.TransactionalEmailsApi()

const forgotPassword = async (req, res) => {
  try {
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
        html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset Password</a>`,
      };

      await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        ...emailContent,
      });

      return res.status(200).json({ message: 'Password reset email sent', success: true });
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing request', success: false });
  }
};


const resetpassword = (req, res) => {
  const id = req.params.id;
  Forgotpassword.findOne({ where: { id } }).then(forgotpasswordrequest => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
                                  <script>
                                      function formsubmitted(e){
                                          e.preventDefault();
                                          console.log('called')
                                      }
                                  </script>
                                  <form action="/password/updatepassword/${id}" method="get">
                                      <label for="newpassword">Enter New password</label>
                                      <input name="newpassword" type="password" required></input>
                                      <button>reset password</button>
                                  </form>
                              </html>`
      )
      res.end()

    }
  })
}

const updatepassword = (req, res) => {

  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    Forgotpassword.findOne({ where: { id: resetpasswordid } }).then(resetpasswordrequest => {
      User.findOne({ where: { id: resetpasswordrequest.userId } }).then(user => {
        // console.log('userDetails', user)
        if (user) {
          //encrypt the password

          const saltRounds = 10;
          bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
              console.log(err);
              throw new Error(err);
            }
            bcrypt.hash(newpassword, salt, function (err, hash) {
              // Store hash in your password DB.
              if (err) {
                console.log(err);
                throw new Error(err);
              }
              user.update({ password: hash }).then(() => {
                res.status(201).json({ message: 'Successfuly update the new password' })
              })
            });
          });
        } else {
          return res.status(404).json({ error: 'No user Exists', success: false })
        }
      })
    })
  } catch (error) {
    return res.status(403).json({ error, success: false })
  }

}

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword
}