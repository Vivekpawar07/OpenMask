const axios = require('axios');

const getEvents = async (req, res) => {
    console.log('hey');
};

const getTrends = async (req, res) => {
    const url = 'https://newsapi.org/v2/top-headlines?' +
                'country=in&' +
                'apiKey=d19c681e21a44a4d8c8f6595f8cfb011';

    try {
        const response = await axios.get(url);
        const data = response.data;
        res.status(200).json(data); 
    } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ message: 'Error fetching trends' });
    }
};

module.exports = {
    getEvents,
    getTrends
};