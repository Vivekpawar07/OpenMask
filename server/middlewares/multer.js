const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the folder path
const uploadFolder = 'public/assets/';

// Check if the folder exists, and if not, create it
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);  // Save files to 'public/assets/'
  },
  
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));  // File name with extension
  }
});

// Set file size limit and file type filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },  // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

module.exports = upload.single('profilePicture');