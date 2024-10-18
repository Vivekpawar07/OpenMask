const router = require('express').Router();
const protectRoute = require('../middlewares/procted');
const multer = require('../middlewares/multer');
const {getAllPosts,createPost,likeUnlikePost,commentOnPost,deletePost} = require('../controllers/anonymousPostController.js');
router.get("/all", protectRoute, getAllPosts);
router.post("/create",multer,protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

module.exports = router;