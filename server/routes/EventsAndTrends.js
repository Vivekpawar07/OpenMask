const {getEvents,getTrends}  = require('../controllers/EventsandTrendsController');
const router = require('express').Router();

router.get('/events',getEvents);
router.get('/trending',getTrends);
module.exports = router;