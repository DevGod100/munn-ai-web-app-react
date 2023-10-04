const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

app.use(cors());

// Middleware setup (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'userUploadedMetadata'); // Save files to 'userUploadedMetadata' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const uploadMiddleware = multer({ storage });

// Middleware for parsing JSON
app.use(express.json());

// Route for handling file upload
app.post('/api/upload', uploadMiddleware.single('metadata'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please select the metadata.jsonl file.' });
  }

  // Handle file upload and response
  res.status(200).json({ message: 'File uploaded successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});