const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();

// Middleware for parsing request bodies and serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "Public")));

// Connect to SQLite database
const db = new sqlite3.Database(
  path.join(__dirname, "..", "database", "user.db")
);

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password TEXT
)`);

// Route for user registration
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
  stmt.run(username, email, password, (err) => {
    if (err) {
      return res.status(500).json({ error: "User registration failed" });
    }
    res.redirect("/login.html");
  });
  stmt.finalize();
});

// Route for user login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }
      if (row) {
        res.redirect("/files_display.html");
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  );
});

// Route to display files
app.get("/list-files", (req, res) => {
  const { type } = req.query;
  const dirPath = path.join(__dirname, "..", "files", type);

  const fs = require("fs");
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load files" });
    }

    const fileList = files.map((file) => ({
      name: file,
      downloadLink: `/files/${type}/${file}`,
    }));

    res.json({ success: true, files: fileList });
  });
});

// Serve files from the /files directory
app.use("/files", express.static(path.join(__dirname, "..", "files")));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
