const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Hello User!'
    },
    userName: {
        type: String,
        unique: true
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
    friends: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    friendRequestsSent: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    friendRequestsReceived: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],

});



const User = mongoose.model('User', userSchema);
module.exports = User;