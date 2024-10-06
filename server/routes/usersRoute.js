const express = require('express');
const procted = require('../middlewares/procted.js');
const { getUserProfile, followUnfollow, Suggestion,updateUser,getChatList,suggestedChat,searchUser } = require('../controllers/userController.js');

const router = express.Router();

router.get('/profile/:username', procted, getUserProfile);
router.post('/follow/:id', procted , followUnfollow);
router.post('/getSuggestion', procted, Suggestion);
// router.get('/update',procted,updateUser);
router.get('/chat/:id',procted, getChatList);
router.get('/suggestChat/:id',procted, suggestedChat);
router.get('/search/:query',procted, searchUser);

module.exports = router;