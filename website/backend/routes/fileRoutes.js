const express = require("express");
const fs = require("fs");
const path = require("path");
const { ensureAuthenticated } = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
  uploadFileWithProxy,
  listFilesWithProxy,
  deleteFileWithProxy
} = require("../utils/firebase");

// Upload file to Firebase through proxy
router.post("/upload", ensureAuthenticated, upload.single("file"), async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false, message: "Unauthorized" });

  const userId = req.session.user.id;
  const file = req.file;
  if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

  const firebaseFilePath = `users/${userId}/${file.originalname}`;
  try {
    const fileUrl = await uploadFileWithProxy(file.buffer, firebaseFilePath, file.mimetype);
    res.status(200).json({ success: true, message: "File uploaded to Firebase", url: fileUrl });
  } catch (err) {
    console.error("Firebase upload error:", err);
    res.status(500).json({ success: false, message: "Upload error" });
  }
});

// Get user-specific files from Firebase through proxy
router.get("/files", ensureAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const userFolder = `users/${userId}/`;

  try {
    const [files] = await listFilesWithProxy(userFolder);
    const fileList = files.map(file => ({
      name: file.name.split("/").pop(),
      url: `https://firebasestorage.googleapis.com/v0/b/major-project-try2.appspot.com/o/${encodeURIComponent(file.name)}?alt=media`
    }));
    res.json({ success: true, files: fileList });
  } catch (err) {
    console.error("Error retrieving files from Firebase:", err);
    res.status(500).json({ success: false, message: "Error retrieving files" });
  }
});

// Serve a specific local file
router.get("/:type/:filename", ensureAuthenticated, (req, res) => {
  const { type, filename } = req.params;
  const filePath = path.join(__dirname, "..", "..", "files", type, filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, err => {
      if (err) {
        console.error("Error serving file:", err);
        res.status(500).send("Error downloading file");
      }
    });
  } else {
    res.status(404).send("File not found");
  }
});

// List local files by type
router.get("/list-files", ensureAuthenticated, (req, res) => {
  const fileType = req.query.type; // audio, videos, text, images
  const directoryPath = path.join(__dirname, "..", "..", "files", fileType);

  if (!fs.existsSync(directoryPath)) {
    return res.status(404).json({ success: false, error: `Directory for ${fileType} not found` });
  }

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ success: false, error: "Unable to retrieve files" });
    }

    const fileData = files.map(file => ({
      name: file,
      downloadLink: `/files/${fileType}/${file}`
    }));

    res.json({ success: true, files: fileData });
  });
});

// Delete a file from Firebase through proxy
router.delete("/delete/:fileName", ensureAuthenticated, async (req, res) => {
  const fileName = req.params.fileName;
  const userId = req.session.user.id;
  const firebaseFilePath = `users/${userId}/${fileName}`;

  try {
    await deleteFileWithProxy(firebaseFilePath);
    res.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error("Firebase deletion error:", err);
    res.status(500).json({ success: false, error: "Error deleting file from Firebase" });
  }
});

module.exports = router;
