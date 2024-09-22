const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    fullName:{
        type:String,
        require: true
    },
    dob: {
        type: Date,
        required: true,
    },
    profilePic: {
        type: String, 
        default: 'defaultProfilePic.jpg',
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', 
    }],
    bio: {
        type: String,
        maxlength: 160, 
    },
}, { timestamps: true }); 

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;