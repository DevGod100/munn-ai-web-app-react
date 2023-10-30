const multer = require('multer');

// Multer setup and other middleware functions here

module.exports = {
  uploadMiddleware: multer(/* configuration */),
  // Other middleware functions
};