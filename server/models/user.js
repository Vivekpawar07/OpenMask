const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const report =[{
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the user who submitted the report
        required: true
    },
    reason: {
        type: String,
        enum: ['spam', 'abuse', 'fake account', 'other'],
        default: 'other'
    },
    reportedAt: {
        type: Date,
        default: Date.now
    }
}]
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
        maxlength:50,
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
    gender: {
        type: String, 
        enum: ['male', 'female', 'others']
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post'  
    }, 
    interests: [{
        type: String,
        enum: ['technology', 'sports', 'music', 'art', 'gaming', 'fitness', 'cooking', 'travel', 'science', 'education'] // example interests
    }],
    blocked:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    }],
    reports: report
}, { timestamps: true }); 

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;