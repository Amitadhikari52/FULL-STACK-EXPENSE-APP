const connection = require('../util/db');

const userModel = {
  createUser: (username, password) => {
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
      connection.query(sql, [username, password], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  },

  getUserByUsernameAndPassword: (username, password) => {
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    return new Promise((resolve, reject) => {
      connection.query(sql, [username, password], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
};

module.exports = userModel;
