const User = require('../models/user')
const Notification = require('../models/notification');
const Message = require('../models/message');
const mongoose = require('mongoose');


const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password"); 
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
const updateUser = async()=>{
    const { fullName, email, username, currentPassword, newPassword, bio,dob } = req.body;
	let {profileImg} = req.file.filename;

	const userId = req.body._id;

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

		if (profileImg) {
			if (user.profileImg) {
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// password should be null in response
		user.password = null;

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
}
const getChatList = async (req, res) => {
	try {
		const loggedInUserId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(loggedInUserId)) {
			return res.status(400).json({ error: "Invalid user ID" });
		}

		const messages = await Message.find({
			$or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }]
		});
        console.log(messages)
		const userIdsInConversation = new Set();
		messages.forEach((message) => {
			userIdsInConversation.add(message.senderId.toString());
			userIdsInConversation.add(message.receiverId.toString());
		});

		userIdsInConversation.delete(loggedInUserId.toString());

		const usersInConversation = await User.find({ _id: { $in: Array.from(userIdsInConversation) } }).select("-password");
        console.log(usersInConversation);
		// Send the list of users in the conversation
		res.status(200).json(usersInConversation);
	} catch (error) {
		console.error("Error in getChatList: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
module.exports = {
    getUserProfile,
    followUnfollow,
    Suggestion,
    updateUser,
    getChatList
};