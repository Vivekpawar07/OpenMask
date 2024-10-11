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
        enum:['follow','like','comment','post','report','blocked','Mention']
    },
    refItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    read:{
        type:Boolean,
        defalut:false
    }
},{timestamps:true})

const Notification = mongoose.model('Notification',notificationSchema);
module.exports = Notification;