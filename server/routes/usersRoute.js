const express = require('express');
const procted = require('../middlewares/procted.js');
const { getUserProfile, followUnfollow, Suggestion,updateUser,getChatList,suggestedChat,searchUser,getUserById } = require('../controllers/userController.js');
const uplaodMideleware = require('../middlewares/multer.js');
const router = express.Router();

router.get('/profile/:username', procted, getUserProfile);
router.post('/follow/:id', procted , followUnfollow);
router.post('/getSuggestion', procted, Suggestion);
router.put('/update',uplaodMideleware,procted,updateUser);
router.get('/chat/:id',procted, getChatList);
router.get('/suggestChat/:id',procted, suggestedChat);
router.get('/search/:query',procted, searchUser);
router.post('/search/bulk',procted, getUserById);
module.exports = router;