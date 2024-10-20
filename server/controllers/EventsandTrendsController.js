const axios = require('axios');
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const dd = String(today.getDate()).padStart(2, '0');

const formattedDate = `${yyyy}-${mm}-${dd}`;
const getEvents = async (req, res) => {
  const { lat, long } = req.query;
  const latlong = `${lat},${long}`;
  try {
    const response = await axios.get(`https://api.predicthq.com/v1/events`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EVENTS_API_KEY}` 
      },
      params: {
        "location_around.origin": latlong,
        "location_around.offset": "25km",
        "location_around.scale": "25km",
        "start_around.origin": formattedDate,
        "category": "festivals,concerts,sports,performing-arts,academic",
        "limit": 30
      }
    });
    
    const data = response.data.results;

    const events = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        end: event.end,
        venue: event.geo.address,
        rank: event.rank
      }));

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

module.exports = {
  getEvents,
};