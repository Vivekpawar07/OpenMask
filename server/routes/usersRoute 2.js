const express = require('express');
const procted = require('../middlewares/procted.js');
const { getUserProfile, followUnfollow, Suggestion,updateUser } = require('../controllers/userController.js');

const router = express.Router();

router.get('/profile/:username', procted, getUserProfile);
router.post('/follow/:id', procted , followUnfollow);
router.get('/getSuggestion', procted, Suggestion);
// router.get('/update',procted,updateUser);

module.exports = router;