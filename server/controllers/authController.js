const UserModel = require("../models/user");
const { oauth2client } = require("../utils/googleConfig");
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;
        const googleResponse = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleResponse.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`
        );
        const data = userRes.data;
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Google login failed");
    }
};

const signup = async (req, res) => {
    try {
        const { username, email, password, fullName, dob } = req.body;
        let profilePicUrl = null;
        if (req.file) {
            try {
                if (req.file) {
                    const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
                        folder: "user_profiles", 
                    });
                    profilePicUrl = cloudinaryUpload.secure_url; 
                }
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Error uploading profile picture", success: false });
                return;
            }
    
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            fullName,
            dob,
            profilePic: profilePicUrl
        });

        await newUser.save();

        const jwtToken = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            message: "Signup successful",
            success: true,
            token: jwtToken,
            email: newUser.email,
            username: newUser.username,
            profilePicture: newUser.profilePic,
            fullName: newUser.fullName
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Problem creating new user", success: false });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "Invalid email", success: false });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid password", success: false });
        }
        const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            message: "Login successful",
            success: true,
            token: jwtToken,
            email: email,
            username: user.username,
            profilePicture: user.profilePic,
            fullName: user.fullName
        });
    } catch (err) {
        res.status(500).json({ message: "Problem logging in", success: false });
    }
};

module.exports = {
    googleLogin,
    signup,
    login
};