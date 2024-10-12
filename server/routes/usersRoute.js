const express = require('express');
const procted = require('../middlewares/procted.js');
const { getUserProfile, followUnfollow, Suggestion,updateUser,getChatList,
    suggestedChat,searchUser,getFollowersFollowings,reportUser,blockUser,searchWithImage } = require('../controllers/userController.js');
const uplaodMideleware = require('../middlewares/multer.js');
const router = express.Router();

router.get('/profile/:username', procted, getUserProfile);
router.post('/follow/:id', procted , followUnfollow);
router.post('/getSuggestion', procted, Suggestion);
router.put('/update',uplaodMideleware,procted,updateUser);
router.get('/chat/:id',procted, getChatList);
router.get('/suggestChat/:id',procted, suggestedChat);
router.get('/search/:query',procted, searchUser);
router.get('/search/followers/:id',procted, getFollowersFollowings);
router.put('/report',procted,reportUser);
router.put('/block',procted,blockUser);
router.post('/imageSearch',uplaodMideleware,procted,searchWithImage)
module.exports = router;