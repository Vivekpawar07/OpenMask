const express = require('express');
const{ getMessages, sendMessage } = require("../controllers/messageController.js");
const  protectRoute = require("../middlewares/procted.js");

const router = express.Router();

router.post("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;