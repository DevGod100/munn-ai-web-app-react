const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;
const { Storage } = require('@google-cloud/storage');

app.use(cors());

// Middleware setup (Multer)
const storage = multer.memoryStorage(); // Store file in memory
const uploadMiddleware = multer({ storage });

// Middleware for parsing JSON
app.use(express.json());

// Google Cloud Storage setup
const gc = new Storage({
  keyFilename: path.join(__dirname, "./munn-ai-1e8d70e12cce.json"),
  projectId: "munn-ai" 
});

gc.getBuckets().then(x => console.log(x))

const bucketName = gc.bucket('bucket-quickstart_munn-ai'); // Replace with your GCS bucket name
// i want it to end up here: https://storage.googleapis.com/bucket-quickstart_munn-ai/uploaded-by-users/...

// Route for handling file upload
app.post('/api/upload', uploadMiddleware.single('metadata'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please select the metadata.jsonl file.' });
  }

  const bucket = gc.bucket(bucketName);
  const file = bucket.file(`${req.file.originalname}`); 
  console.log('(server side) req.file.originalname =', file);

  try {
    // Upload the file to Google Cloud Storage
    await file.save(req.file.buffer);

    // Generate the public URL for the uploaded file
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${req.file.originalname}`;

    // Respond with success message and the public URL
    res.status(200).json({ message: 'File uploaded successfully', publicUrl });
  } catch (error) {
    console.error('Error uploading file to Google Cloud Storage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});