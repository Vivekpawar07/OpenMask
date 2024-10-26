const UserModel = require("../models/user");
const { oauth2client } = require("../utils/googleConfig");
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const FormData = require('form-data'); 
const fs = require('fs'); 

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
        let embedding = null; 
        console.log(req.body);
        console.log(req.file);
        if (req.file) {
            try {
                const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
                    folder: "user_profiles", 
                });
                profilePicUrl = cloudinaryUpload.secure_url;
                const formData = new FormData();
                formData.append('image', fs.createReadStream(req.file.path)); 
                const embeddingResponse = await axios.post(`${process.env.ML_BACKEND_SERVER}/get_embeddings`, formData, {
                    headers: {
                        ...formData.getHeaders() 
                    },
                });
                embedding = embeddingResponse.data.embeddings;
            } catch (err) {
                console.error("Error uploading profile picture or generating embeddings", err);
                res.status(500).json({ message: "Error processing profile picture or embeddings", success: false });
                return;
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object with the profile picture and image embedding
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            fullName,
            dob,
            profilePic: profilePicUrl,
            imgEmbedding: embedding // Save the embedding in the database
        });

        // Save the new user to the database
        await newUser.save();

        // Generate a JWT token for the user
        const jwtToken = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        const userResponse = newUser.toObject();
        delete userResponse.password; // Remove password from the response

        // Send the response with the JWT token and user data
        res.status(201).json({
            message: "Signup successful",
            success: true,
            token: jwtToken,
            user: userResponse
        });
    } catch (err) {
        console.error("Error during signup", err);
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
        const userResponse = user.toObject();
        delete userResponse.password; 
        res.status(201).json({
            message: "Login successful",
            success: true,
            token: jwtToken,
            user:userResponse
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