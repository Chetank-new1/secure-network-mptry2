const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/user.db');

function registerUser(username, password, callback) {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) {
            callback({ success: false, message: 'Error while registering.' });
        } else if (row) {
            callback({ success: false, message: 'Username already exists.' });
        } else {
            db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], (err) => {
                if (err) {
                    callback({ success: false, message: 'Error while creating user.' });
                } else {
                    callback({ success: true, message: 'Registration successful.' });
                }
            });
        }
    });
}

module.exports = { registerUser };
