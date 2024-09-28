const express = require('express');
const { googleLogin, signup, login } = require('../controllers/authController'); 
const { signupValidation, loginValidation } = require('../middlewares/authValidation');
const uplaodMideleware = require('../middlewares/multer.js');
const router = express.Router();
require("dotenv").config();


router.post('/login',loginValidation, login);
router.post('/signup', uplaodMideleware, signupValidation, signup);

router.get('/google', googleLogin); 

module.exports = router;