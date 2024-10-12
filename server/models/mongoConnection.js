require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

const mongo_url = process.env.MONGO_URL;

mongoose.connect(mongo_url)
.then(() => {
    console.log('Mongoose is connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB database:', err);
});