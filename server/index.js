const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
require('./models/mongoConnection.js');
const PORT = process.env.PORT;
const AuthRouter = require('./routes/authRouter.js');
const userRoutes = require('./routes/usersRoute.js');
const cloudinary = require('cloudinary').v2;
const uploadMiddleware = require('./middlewares/multer.js');  
const post = require('./routes/post.js');
const app = express();
const messages = require('./routes/messagesRoute.js');
const Anonymous = require('./routes/AnonymousPost.js');
// Middleware
app.use(cors());
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

// Set up multer
app.post('/upload', (req, res) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).send(err.message);  
    }
    res.send('File uploaded successfully');
  });
});

// Routes
app.use('/auth',  AuthRouter); 
app.use('/user', userRoutes);
app.use('/feed',post);
app.use('/chat', messages);
app.use('/anonymous',Anonymous);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});