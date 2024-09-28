const express = require('express');
const { googleLogin, signup, login } = require('../controllers/authController'); 
const { signupValidation, loginValidation } = require('../middlewares/authValidation');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require("dotenv").config();
const uploadDir = process.env.PROFILE_PICTURE_DIR;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const username = req.body.username; 
        const extension = path.extname(file.originalname); 
        cb(null, `${username}_${Date.now()}${extension}`); 
    },
});
const upload = multer({ storage });

router.post('/login',loginValidation, login);
router.post('/signup', upload.single('profilePicture'), signupValidation, signup);

router.get('/google', googleLogin); 

module.exports = router;