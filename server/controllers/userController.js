const User = require('../models/user')
const Notification = require('../models/notification');
const Message = require('../models/message');
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
        const currentUser = req.body._id;
        const usersFollowed = await User.findById(currentUser).select('following');
        if (!usersFollowed || !usersFollowed.following) {
            return res.status(404).json({ message: "User not found or no users followed" });
        }

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: currentUser },
                    _id: { $nin: usersFollowed.following }
                }
            },
            { $sample: { size: 10 } }  
        ]);

        const suggestedUsers = users.slice(0, 4);

        suggestedUsers.forEach(user => user.password = null);

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
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
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
		const loggedInUserId = req.params; 
		
		const messages = await Message.find({
            $or: [{ sender: loggedInUserId }, { receiver: loggedInUserId }]
        }).select("sender receiver");
        console.log(messages)   
		const userIdsInConversation = new Set();
		messages.forEach((message) => {
			userIdsInConversation.add(message.sender.toString());
			userIdsInConversation.add(message.receiver.toString());
		});
		
		userIdsInConversation.delete(loggedInUserId.toString());

		const usersInConversation = await User.find({ _id: { $in: Array.from(userIdsInConversation) } }).select("-password");

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