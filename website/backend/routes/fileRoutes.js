// backend/routes/fileRoutes.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const { ensureAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.get("/list-files", ensureAuthenticated, (req, res) => {
  const fileType = req.query.type; // 'audio', 'videos', 'text', 'images'
  const directoryPath = path.join(__dirname, "..", "..", "files", fileType);

  if (!fs.existsSync(directoryPath)) {
    return res
      .status(404)
      .json({ success: false, error: "Directory not found" });
  }

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, error: "Unable to retrieve files" });
    }

    const fileData = files.map((file) => ({
      name: file,
      downloadLink: `/files/${fileType}/${file}`,
    }));

    res.json({ success: true, files: fileData });
  });
});

// Create user directory
router.post("/create-directory", ensureAuthenticated, (req, res) => {
  const dirName = req.body.dirName;
  const userDirPath = path.join(
    __dirname,
    "..",
    "..",
    "files",
    "user_directories",
    req.session.user.username,
    dirName
  );

  if (!fs.existsSync(userDirPath)) {
    fs.mkdirSync(userDirPath, { recursive: true });
    res.json({ success: true, message: "Directory created successfully" });
  } else {
    res.status(400).json({ success: false, error: "Directory already exists" });
  }
});

module.exports = router;
