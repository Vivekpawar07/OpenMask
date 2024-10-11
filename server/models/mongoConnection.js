require('dotenv').config(); 
const mongoose = require('mongoose');
const mongo_url = process.env.MONGO_URL
mongoose.connect(mongo_url)
.then(
    console.log('Mongoose is connected to mongodb')
).catch((err)=>{

    console.log("Erro rconnection mongo database:", err)
}
)