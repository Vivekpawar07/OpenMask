const {getEvents}  = require('../controllers/EventsandTrendsController');
const router = require('express').Router();
const protectRoute = require('../middlewares/procted');

router.get('/events',protectRoute,getEvents);
module.exports = router;