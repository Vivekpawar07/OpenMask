const  mongoose = require("mongoose") ;

const postSchema = new mongoose.Schema(
	{
		text: {
			type: String,
		},
		likes: {type: Number,default: 0,},
		comments: [
			{
				text: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

const Post = mongoose.model("Anonymous_Post", postSchema);

module.exports = Post;