const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./models/mongoConnection.js');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const AuthRouter = require('./routes/authRouter.js');
const userRoutes =  require('./routes/usersRoute.js');
const test = require('./routes/test.js')

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use('/profile_picture', express.static('profile_picture'));


app.use('/auth', AuthRouter);
app.use('/user',userRoutes );


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});