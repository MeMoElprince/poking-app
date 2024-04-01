const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    userName: {
        type: String,
        unique: true
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
        default: Date.now()
    },
    secretToken: {
        type: String,
        select: false
    },
    secretTokenExpires: {
        type: Date,
        select: false
    },
});



const User = mongoose.model('User', userSchema);
module.exports = User;