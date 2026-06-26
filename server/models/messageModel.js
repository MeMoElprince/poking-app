const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: [true, 'Message cannot be empty']
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Message must have a sender']
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: [true, 'Message must have a room']
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Number,
        default: () => Math.floor(Date.now())
    }
});

// compound index for the hot query: messages of a room, newest first
messageSchema.index({room: 1, createdAt: -1});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;