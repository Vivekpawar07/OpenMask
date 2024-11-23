const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true }, 
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: {
        isEdited: { type: Boolean, default: false },
        isPinned: { type: Boolean, default: false }
    }
});
const groupSchema = new mongoose.Schema({
    groupId: { type: String, unique: true, required: true },
    groupName: { type: String, required: true },
    description: { type: String },
    conversations: [messageSchema] 
});

const Group = mongoose.model("Group", groupSchema);

