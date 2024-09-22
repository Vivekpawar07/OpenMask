const UserModel = require("../models/user");
const { oauth2client } = require("../utils/googleConfig");
const axios = require('axios');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const googleLogin = async(req, res) => {
    try {
        const {code} = req.query;
        const googleResponse = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleResponse.tokens);
        userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`
        )
        const data = userRes.data;
        res.send(data);

    } catch (err) {
        console.log(err);
        res.status(500).send("Google login failed");
    }
};

const signup = async(req,res)=>{
    try{
        const {username,email,password,fullName,dob} = req.body;
        const profilePic = req.file ? req.file.filename : 'defaultProfilePic.png';
        console.log(req.file)
        console.log(profilePic);
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(409)
            .json({message : "user alredy exist try another username or if its you tyr login page", success:false})
        }
        const newUser = new UserModel({username,email,password,fullName,dob,profilePic})
        newUser.password = await bcrypt.hash(password,10);
        await newUser.save();
                const jwtToken = jwt.sign(
                    { email: newUser.email },  
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                
                res.status(201).json({
                    message: "Signup successful",
                    success: true,
                    token: jwtToken,
                    email: newUser.email,
                    username: newUser.username,
                    profilePicture: newUser.profilePic,
                    fullName: newUser.fullName
                });
    }   
    catch(err){
        res.status(500)
        .json({message:"problem creating new user",success:false})

    }
}
const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(403)
            .json({message :"invalid email" , success:false})
        }
        const isPassowrd = await bcrypt.compare(password,user.password);
        console.log(isPassowrd)
        if(!isPassowrd){
            return res.status(403).json({message:"invalid password"})
        }
        const jwtToken = jwt.sign(
            {email:user.email },
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )
        res.status(201)
        .json({message:"Login Success", success:true , token:jwtToken,email:email,username:user.username,profilePicture:user.profilePic, fullName:user.fullName})
    }   
    catch(err){
        res.status(500)
        .json({message:"problem login",success:false})

    }
}
module.exports = {
    googleLogin,
    signup,
    login
};