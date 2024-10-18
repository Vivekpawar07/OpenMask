const Post = require('../models/anonymousPost.js') ;
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const createPost = async (req, res) => {
    try {
        // Log the request body
        console.log(req.body);

        // Extract the caption text
        const text = req.body.caption;
        if (!text) {
            return res.status(400).json({ error: "Post must have text" });
        }

        // Send the input to the ML backend for toxicity prediction
        const getValidation = await axios.post(`${process.env.ML_BACKEND_SERVER}/predict_toxicity`, {
            'input': text
        });

        const result = getValidation.data;

        // Check if the message is 'OK' (i.e., safe to post)
        if (result.predictions) {
            const newPost = new Post({
                text
            });
            await newPost.save();
            return res.status(201).json(newPost);
        } else if (result.error) {
            return res.status(400).json({
                error: "Post content violates your guidelines",
                reason: result.reason || "Unknown reason"
            });
        }

    } catch (error) {
        // Handle different errors
        if (error.response && error.response.data) {
            // Error from the ML backend
            return res.status(error.response.status || 500).json({
                error: error.response.data.error || "Error from toxicity API",
                reason: error.response.data.reason || null
            });
        } else {
            // Generic server error
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};
const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		if (post.user.toString() !== req.body._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
const commentOnPost = async (req, res) => {
	try {
		const text  = req.body.text;
		const postId = req.params.id;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const comment = { text };

		post.comments.push(comment);
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.body._id;
		const post = await Post.findById(postId);
		
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		post.likes.push(userId);
		await post.save();
		res.status(200).json({ likes: post.likes }); 
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			;

		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
module.exports = {
    getAllPosts,createPost,likeUnlikePost,commentOnPost,
    deletePost
};