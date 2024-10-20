const {getEvents}  = require('../controllers/EventsandTrendsController');
const router = require('express').Router();

router.get('/events',getEvents);
module.exports = router;