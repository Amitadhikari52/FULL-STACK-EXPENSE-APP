const userModel = require('../models/userModel');
const connection = require('../util/db');

const userController = {
  signup: (req, res) => {
    const { username, password } = req.body;

    userModel.createUser(username, password)
      .then(() => {
        res.status(201).json({ message: 'Signup successful' });
      })
      .catch((err) => {
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'Signup failed' });
      });
  },

  login: (req, res) => {
    const { username, password } = req.body;

    userModel.getUserByUsernameAndPassword(username, password)
      .then((result) => {
        if (result.length === 0) {
          res.status(401).json({ message: 'Invalid credentials' });
        } else {
          res.status(200).json({ message: 'Login successful' });
        }
      })
      .catch((err) => {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Login failed' });
      });
  }
};

module.exports = userController;
