const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Import the db module

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

app.use(express.static('public'));

// Handle POST request for signup
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error while querying the database:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Insert the new user into the database
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
            if (err) {
                console.error('Error while inserting user into the database:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            return res.status(201).json({ message: 'User registered successfully!' });
        });
    });
});

// Handle POST request for login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error while querying the database:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        return res.status(200).json({ message: 'Login successful!' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
