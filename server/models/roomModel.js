const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Chat'
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

roomSchema.pre('save', async function(next) {
    // if the room is a chat room, then there should be only two users in the room 
    if(this.users.length < 2)
        return next(new AppError('A chat room must have two users', 400));
    if(this.type === 'chat' && this.users.length > 2)
        return next(new AppError('A chat room can only have two users', 400));
    next();
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;