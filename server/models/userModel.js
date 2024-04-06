const mongoose = require('mongoose');


const friendsSchema = new mongoose.Schema({
    friend: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Hello User!'
    },
    userName: {
        type: String,
        unique: true,
        sparse: true,
    },
    imgName: {
        type: String,
        default: 'default.jpg'
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true
    },
    token: {
        type: String,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    secretToken: {
        type: String,
        select: false
    },
    secretTokenExpires: {
        type: Date,
        select: false
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user'
    },
    // the below fields are for the user's profile page and are not required for the user to be created
    // it consist of an array of friends and an array of friend requests
    // each document of this collection will have a reference to the user's friends and friend requests
    friends: [
        friendsSchema
    ],
    friendRequestsSent: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }],
    friendRequestsReceived: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }],
    
});



const User = mongoose.model('User', userSchema);
module.exports = User;