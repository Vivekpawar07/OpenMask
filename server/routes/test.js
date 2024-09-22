const ensureAuth = require('../middlewares/procted');
const router = require('express').Router();
router.get("/test",ensureAuth,(req,res)=>{
    res.status(200).json({
        message: "you got access to the data"
    })
})
module.exports = router;