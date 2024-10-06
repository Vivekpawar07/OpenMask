const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
require('./models/mongoConnection.js');
const PORT = process.env.PORT;
const AuthRouter = require('./routes/authRouter.js');
const userRoutes = require('./routes/usersRoute.js');
const cloudinary = require('cloudinary').v2;
// const uploadMiddleware = require('./middlewares/multer.js');  
const post = require('./routes/post.js');
// const app = express();
const messages = require('./routes/messagesRoute.js');
const Anonymous = require('./routes/AnonymousPost.js');
const { app, server } = require ("./sockets/socket.js");


// Middleware
app.use(cors({
    origin : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});


// Routes
app.use('/auth',  AuthRouter); 
app.use('/user', userRoutes);
app.use('/feed',post);
app.use('/chat', messages);
app.use('/anonymous',Anonymous);


// server is listning through sockets
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});