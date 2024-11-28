const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const report = [{
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
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
}];

const userSchema = new Schema({
    fullName: {
        type: String,
        maxlength: 50,
    },
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
    profilePic: {
        type: String, 
        default: 'defaultProfilePic.jpg',
    },
    imgEmbedding: {
        type: [Number],
    },
    latestActiveLocation: {
        lat: { type: Number },
        lng: { type: Number },
    },
    loginTime: {
        type: Date,
        default: Date.now
    },
    contentLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    }],
    contentTimeSpent: [{
        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Content'
        },
        timeSpent: { 
            type: Number,
            default: 0
        }
    }],
    contentUserInterested: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    }],
    contentUserContext: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content' 
    }],
    recentSearch: [{
        query: { type: String },
        searchedAt: { type: Date, default: Date.now }
    }],
    mostInteractionWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    locality: {
        type: String 
    },
    trendsInLocality: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    }],
    dob: {
        type: Date,
        required: true,
    },
    bio: {
        type: String,
        maxlength: 160, 
    },
    reports: report,
    isVerified: {
        type: Boolean,
        default: false
    },
    engagementScore: {
        type: Number,
        default: 0
    },
    recommendedForUser: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    }],
    behavioralCluster: { 
        type: String 
    },
    recommendationFeedback: [{ 
        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Content'
        },
        feedback: {
            type: String,
            enum: ['like', 'dislike', 'neutral']
        }
    }],
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;