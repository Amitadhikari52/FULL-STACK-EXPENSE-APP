const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


function isStringInvalid(string) {
  return string === undefined || string.length === 0;
}

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ err: 'Bad parameters. Something is missing.' });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    await User.create({ name, email, password: hash });
    res.status(201).json({ message: 'Successfully created a new user.' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json(err);
  }
};

const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign({ userId : id, name: name, ispremiumuser} ,process.env.TOKEN);
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ message: 'Email or password is missing.', success: false });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist.' });
    }
 
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = generateAccessToken(user.id, user.name, user.ispremiumuser); // Use user.id here
      res.status(200).json({ success: true, message: 'User logged in successfully.', token });
    } else {
      res.status(400).json({ success: false, message: 'Password is incorrect.' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: err.message, success: false });
  }
};

module.exports = {
  signup,
  login,
  generateAccessToken
};
