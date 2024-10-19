const mongoose = require('mongoose')

const notificationSchema  = new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:String,
        require:true,
        enum:['follow','like','comment','post','report','blocked']
    }
},{timestamps:true})
notificationSchema.index({ from: 1 });
notificationSchema.index({ to: 1 });
notificationSchema.index({ type: 1 });
const Notification = mongoose.model('Notification',notificationSchema);
module.exports = Notification;