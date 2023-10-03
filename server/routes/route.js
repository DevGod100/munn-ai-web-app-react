const express = require('express');
const router = express.Router();
const { uploadMiddleware } = require('../middlewares/middleware'); // Import middleware

// Define route handlers
router.post('/upload', uploadMiddleware.single('metadata'), (req, res) => {
  // Handle file upload and response
});

module.exports = router;