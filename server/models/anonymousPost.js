const  mongoose = require("mongoose") ;
const commentSchema = new mongoose.Schema(
	{
	  text: {
		type: String,
		required: true,
	  }
	},
	{ timestamps: true } 
  );
const postSchema = new mongoose.Schema(
	{
		text: {
			type: String,
		},
		likes: [
			{
			  type: mongoose.Schema.Types.ObjectId,
			  ref: "User",
			},
		  ],
		  comments: [commentSchema],
	},
	{ timestamps: true }
);

const Post = mongoose.model("Anonymous_Post", postSchema);

module.exports = Post;