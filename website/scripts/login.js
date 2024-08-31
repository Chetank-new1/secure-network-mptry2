const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/user.db');

function loginUser(username, password, callback) {
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            callback({ success: false, message: 'Error while logging in.' });
        } else if (row) {
            callback({ success: true, message: 'Login successful.' });
        } else {
            callback({ success: false, message: 'Invalid username or password.' });
        }
    });
}

module.exports = { loginUser };
