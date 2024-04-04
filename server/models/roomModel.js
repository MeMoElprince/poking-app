const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    users: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    type: {
        type: String,
        enum: ['chat', 'group'],
        default: 'chat'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;