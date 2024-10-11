const mongoose = require("mongoose");

// Comment schema
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } 
);

// Post schema
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
    type:{
      type:String,
      enum:['text','image']
    },
    hashtags:[{
      type:String
    }],
    report:[{
      reportedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',  // Reference to the user who submitted the report
          required: true
      },
      reason: {
          type: String,
          enum: ['spam', 'abuse', 'religous hate', 'false speech', 'toxic','identity hate','viloence'],
          default: 'other'
      },
      reportedAt: {
          type: Date,
          default: Date.now
      }
    }]
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;