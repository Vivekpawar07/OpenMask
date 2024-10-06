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
  { timestamps: true } // Enable timestamps for comments
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
    } // Reference the comment schema
  },
  { timestamps: true } // Enable timestamps for the post schema
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;