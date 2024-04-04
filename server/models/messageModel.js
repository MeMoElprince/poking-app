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
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// create index for createdAt field in messageSchema from newest to oldest
messageSchema.index({createdAt: -1});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;