const router = require('express').Router();
const protectRoute = require('../middlewares/procted');
const {getAllPosts,getFollowingPosts,getLikedPosts,getUserPosts,createPost,likeUnlikePost,commentOnPost,
    deletePost} = require('../controllers/postController');
const uplaodMideleware = require('../middlewares/multer.js');
router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", uplaodMideleware,protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

module.exports = router;