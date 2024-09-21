// backend/routes/authRoutes.js
const express = require("express");
const db = require("../utils/db");
const router = express.Router();

// User registration
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  db.run(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Registration failed" });
      }
      res.redirect("/login.html");
    }
  );
});

// User login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!row) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.user = { id: row.id, username: row.username };
      res.redirect("/files_display.html");
    }
  );
});

module.exports = router;
