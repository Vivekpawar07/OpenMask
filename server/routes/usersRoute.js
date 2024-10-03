const express = require('express');
const procted = require('../middlewares/procted.js');
const { getUserProfile, followUnfollow, Suggestion,updateUser,getChatList } = require('../controllers/userController.js');

const router = express.Router();

router.get('/profile/:username', procted, getUserProfile);
router.post('/follow/:id', procted , followUnfollow);
router.post('/getSuggestion', procted, Suggestion);
// router.get('/update',procted,updateUser);
router.get('/chat/:id',procted, getChatList);


module.exports = router;