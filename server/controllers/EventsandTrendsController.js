const axios = require('axios');
const getEvents = async (req, res) => {
    const { lat, long } = req.query;
    const latlong = new String(lat+','+long)
    try {
        const response = await axios.get(`https://api.predicthq.com/v1/events`,{
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.EVENTS_API_KEY}` 
            },
            params:{
                "location_around.origin": latlong,
                "location_around.offset": "25km",
                "location_around.scale": "25km"
            }
        });
        const data = response.data;
        res.status(200).json(data); 
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
};
module.exports = {
    getEvents,
    getTrends
};