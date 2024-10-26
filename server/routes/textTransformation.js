const router = require('express').Router();
const  protectRoute = require("../middlewares/procted.js");
const {GEC,StyleTransfer} = require('../controllers/textTransformationController.js');
router.post('/gec',protectRoute,GEC);
router.post('/style_transfer',protectRoute,StyleTransfer);

module.exports = router;
