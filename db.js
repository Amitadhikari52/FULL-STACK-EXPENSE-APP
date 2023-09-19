const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',  
    user: 'root',      
    password: 'root123',   
    database: 'expense_tracker'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to database');
});

module.exports = db;
