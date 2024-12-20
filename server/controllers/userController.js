const User = require('../models/user')
const Notification = require('../models/notification');
const Message = require('../models/message');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const FormData = require('form-data'); 
const fs = require('fs'); 

const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password","email"); 
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        return res.status(200).json(user); 
    } 
    catch (err) {
        console.log("Error while fetching user:", err);
        return res.status(500).json({ message: "problem fetching user" }); 
    }
}

const followUnfollow = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.body._id);
        if (!userToModify || !currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Prevent user from following/unfollowing themselves
        if (id === req.body._id.toString()) {
            return res.status(400).json({ error: "You can't follow or unfollow yourself" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.body._id } });
            await User.findByIdAndUpdate(req.body._id, { $pull: { following: id } });
            return res.status(200).json({ message: "Unfollowed user successfully" });
        } else {
            // Follow user
            await User.findByIdAndUpdate(id, { $push: { followers: req.body._id } });
            await User.findByIdAndUpdate(req.body._id, { $push: { following: id } });
            const newNotification = new Notification({
                type:'follow',
                from: req.body._id,
                to:userToModify._id
            })
            await newNotification.save();
            return res.status(200).json({ message: "Followed user successfully" });
        }
    } catch (err) {
        console.log("Error while following/unfollowing user:", err);
        return res.status(500).json({ message: "Error following or unfollowing user" });
    }
};
const Suggestion = async (req, res) => {
    try {
        const currentUserId = req.body._id;

        const currentUser = await User.findById(currentUserId).select('following');
        if (!currentUser || !currentUser.following) {
            return res.status(404).json({ message: "User not found or no users followed" });
        }

        const usersFollowed = currentUser.following;

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: currentUser._id },
                    _id: { $nin: usersFollowed } 
                }
            },
            { $sample: { size: 10 } }, 
            {
                $project: {                 
                    password: 0,
                    email: 0,               
                    __v: 0
                }
            }
        ]);

        const suggestedUsers = users.slice(0, 4);

        return res.status(200).json({
            message: "Suggested users",
            suggestedUsers
        });
    } catch (err) {
        console.error("Error getting suggestion:", err);
        return res.status(500).json({ message: "Error getting suggestion" });
    }
}
const updateUser = async (req, res) => {
    const { fullName, username, currentPassword, newPassword, bio,gender} = req.body;
    let profilePic = req.file ? req.file.path : null; 
    const userId = req.body._id;
    let embedding = null; 
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        if (profilePic) {
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic);
            }
            const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
                folder: "user_profiles", 
            });
            const formData = new FormData();
            formData.append('image', fs.createReadStream(req.file.path)); 
            const embeddingResponse = await axios.post(`${process.env.ML_BACKEND_SERVER}/get_embeddings`, formData, {
                headers: {
                    ...formData.getHeaders() 
                },
            });
            embedding = embeddingResponse.data.embeddings;
            user.profilePic = cloudinaryUpload.secure_url;
            user.imgEmbedding = embedding;
        }
        if (username) user.username = username; 
        if (fullName) user.fullName = fullName; 
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;

        user = await user.save();
        
        user.password = null;

        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateUser: ", error.message);
        return res.status(500).json({ error: error.message });
    }
};
const getChatList = async (req, res) => {
	try {
		const loggedInUserId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(loggedInUserId)) {
			return res.status(400).json({ error: "Invalid user ID" });
		}

		const messages = await Message.find({
			$or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }]
		}).sort({ createdAt: -1 }); 

		const conversationMap = new Map();

		messages.forEach((message) => {
			const otherUserId =
				message.senderId.toString() === loggedInUserId
					? message.receiverId.toString()
					: message.senderId.toString();

			if (!conversationMap.has(otherUserId)) {
				conversationMap.set(otherUserId, message);
			}
		});

		const userIdsInConversation = Array.from(conversationMap.keys());
		const usersInConversation = await User.find({
			_id: { $in: userIdsInConversation }
		}).select("-password");

		const response = usersInConversation.map((user) => {
			const lastMessage = conversationMap.get(user._id.toString());
			return {
				user,
				lastMessage: {
					text: lastMessage.message, 
					createdAt: lastMessage.createdAt,
                    senderId: lastMessage.senderId,
                    receiverId: lastMessage.receiverId
				}
			};
		});

		res.status(200).json(response);
	} catch (error) {
		console.error("Error in getChatList: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
const suggestedChat = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);

        const currentUser = await User.findById(userId).select('following followers');
        if (!currentUser || (!currentUser.following && !currentUser.followers)) {
            return res.status(404).json({ message: "User not found or no followers/following" });
        }

        const usersFollowing = currentUser.following; 
        const usersFollowers = currentUser.followers;

        const userNetwork = [...new Set([...usersFollowing, ...usersFollowers])];

        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        });

        const userIdsInChat = new Set();
        messages.forEach(message => {
            userIdsInChat.add(message.senderId.toString());
            userIdsInChat.add(message.receiverId.toString());
        });
        const usersWithoutChat = userNetwork.filter(userId => !userIdsInChat.has(userId.toString()));

        if (usersWithoutChat.length === 0) {
            return res.status(200).json({ message: "No new users to suggest for chat" });
        }
        const suggestedUsers = await User.aggregate([
            {
                $match: {
                    _id: { $in: usersWithoutChat.map(id => new mongoose.Types.ObjectId(id)) }
                }
            },
            { $sample: { size: 10 } }, 
            {
                $project: {
                    password: 0,
                    email: 0,
                    __v: 0
                }
            }
        ]);
        const finalSuggestedUsers = suggestedUsers.slice(0, 4);

        return res.status(200).json({
            message: "Suggested users for chat",
            suggestedUsers: finalSuggestedUsers
        });
    } catch (error) {
        console.error("Error in suggestedChat: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const searchUser = async (req, res) => {
    try {
        const searchText = req.params.query;
        const users = await User.find({
            username: { $regex: searchText, $options: 'i' }
        }).select('-password'); 

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error searching users:", error); 
        res.status(500).json({ message: "An error occurred while searching for users." });
    }
};
const getFollowersFollowings = async (req, res) => {
    const userId = req.params.id;
    try {
        const userProfile = await User.findById(userId).select('followers following');

        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }
        const populatedUserProfile = await userProfile.populate([
            { path: 'followers', select: 'username fullName profilePic _id followers following posts bio' },
            { path: 'following', select: 'username fullName profilePic _id followers following posts bio' }
        ]);

        return res.status(200).json(populatedUserProfile);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};
const reportUser = async (req, res) => {
    const { userId, reportedUserId, reason } = req.body;
    console.log(req.body)
    try {
      const user = await User.findByIdAndUpdate(
        reportedUserId,
        {
          $push: { reports: { reportedBy: userId, reason: reason } } 
        },
        { new: true } 
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({ message: "User reported successfully", user });
    } catch (error) {
      return res.status(500).json({ message: "Error reporting user", error });
    }
  };
const blockUser = async(req,res)=>{
    const {userId, blockedUserId } = req.body;
    console.log(req.body)
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $push: { blockedUsers: blockedUserId } 
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User blocked successfully", user });

    } catch (error) {
        return res.status(500).json({ message: "Error blocking user", error });
    }
}
const searchWithImage = async (req, res) => {
    const imagePath = req.file.path; 
    let embedding;
    try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));
        const embeddingResponse = await axios.post(`${process.env.ML_BACKEND_SERVER}/get_embeddings`, formData, {
            headers: {
                ...formData.getHeaders()
            },
        });

        embedding = embeddingResponse.data.embeddings;

        if (!embedding || !Array.isArray(embedding)) {
            return res.status(400).json({ message: "Invalid embedding received from ML backend" });
        }

        const results = await User.aggregate([
            {
                "$vectorSearch": {
                    "index": "image_search",
                    "path": "imgEmbedding",
                    "queryVector": embedding,
                    "numCandidates": 10, 
                    "limit": 5 
                }
            },
            {
                "$project": {
                    "imgEmbedding": 0 ,
                    'score': {
                        '$meta': 'vectorSearchScore'
                    }
                }
            }
        ]);

        return res.status(200).json(results);
        
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while processing the image", error: error.message });
    } finally {
        fs.unlink(imagePath, (err) => {
            if (err) console.error("Error deleting image file:", err);
        });
    }
};
const getNotifications = async (req, res) => {
    const userId = req.params.id;
    try {
        const data = await Notification.find({ to: userId }).populate('from', 'username fullName profilePic') 
        if (data.length === 0) {
            return res.status(404).json({ message: "No Notifications Found" });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching notifications", error });
    }
};
const updateLocation = async (req, res) => {
    const { userId, location } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, { location }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Location updated successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error updating location", error });
    }
};
module.exports = {
    getUserProfile,
    followUnfollow,
    Suggestion,
    updateUser,
    getChatList,
    suggestedChat,
    searchUser,
    getFollowersFollowings,
    reportUser,
    blockUser,
    searchWithImage,
    getNotifications,
    updateLocation,
};