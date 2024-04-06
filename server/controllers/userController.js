const User = require('../models/userModel');
const Room = require('../models/roomModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const jwtFactory = require('../utils/tokenFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if(allowedFields.includes(key))
            newObj[key] = obj[key];
    });
    return newObj;
}

exports.getUser = catchAsync(async (req, res, next) => {
    const { email } = req.params;
    const currentUser = req.user;

    const user = await User.findOne({email});
    if(!user)
        return next(new AppError('User not found', 404));

    // check if the user is a friend
    let isFriend = false;
    // check if the user is a friend
    // and get the index of the friend
    currentUser.friends.forEach((friend) => {
        if(friend.friend == user.id) 
            isFriend = true;
    });
    const isFriendRequestSent = currentUser.friendRequestsSent.includes(user.id);
    const isFriendRequestReceived = currentUser.friendRequestsReceived.includes(user.id);
    
    user.isFriend = isFriend;
    user.isFriendRequestSent = isFriendRequestSent;
    user.isFriendRequestReceived = isFriendRequestReceived;
    
    res.status(200).json({
        status: 'success',
        user
    });
});

exports.getMe = catchAsync(async (req, res, next) => {
    const { user } = req;
    res.status(200).json({
        status: 'success',
        user
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    const { user } = req;
    const data = req.body;
    // filter out fields that are not allowed to be updated
    const filteredDate = filterObj(data, 'name', 'userName', 'imgName');
    const updated = await User.findByIdAndUpdate(user._id, filteredDate, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        updatedUser: updated
    });
});

exports.getMyFriends = catchAsync(async (req, res, next) => {
    const { user } = req;
    const me = await User.findById(user.id).populate('friends.friend');
    const friends = me.friends.map(friend => {
        const test = {...friend.friend._doc, room: friend.room};
        return test;
    });
    // console.log({friends});
    res.status(200).json({
        status: 'success',
        count: friends.length,
        friends
    });
});

exports.addFriend = catchAsync(async (req, res, next) => {
    // getting user
    const { user } = req;
    // getting id of the firend
    const { id } = req.params;
    if(user.friends.includes(id))
        return next(new AppError('He is your friend actually!!!', 400));
    if(user.friendRequestsSent.includes(id))
        return next(new AppError('Friend request already sent', 400));
    user.friendRequestsSent.push(id);
    const friend = await User.findById(id);
    friend.friendRequestsReceived.push(user.id);
    await friend.save();    
    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'Friend Request Sent'
    })
});

exports.acceptFriend = catchAsync(async (req, res, next) => {
    const {user} = req;
    const { id } = req.params;
    if(!user.friendRequestsReceived.includes(id))
        return next(new AppError('No friend request like this ID', 400));

    // if firend request is there
    if(user.friends.includes(id))
        return next(new AppError('He is already your friend', 400));

    const newRoom = await Room.create({
        users: [user.id, id],
    });
    // user.friends.push(id);
    const newObj = {
        friend: id,
        room: newRoom._id
    }
    user.friends.push(newObj);
    let index = user.friendRequestsReceived.indexOf(id);
    user.friendRequestsReceived.splice(index, 1);
    await user.save();
    const friend = await User.findById(id);
    index = friend.friendRequestsSent.indexOf(user.id);
    friend.friendRequestsSent.splice(index, 1);
    // friend.friends.push(user.id);          
    newObj.friend = user.id;
    friend.friends.push(newObj);
    await friend.save();
    res.status(200).json({
        status: 'success',
        message: 'Friend accepted successfully'
    })
});

exports.declineFriend = catchAsync(async (req, res, next) => {
    const { user } = req;
    const { id } = req.params;

    if(!user.friendRequestsReceived.includes(id))
        return next(new AppError('No friend to decline with this ID', 400));

    let index = user.friendRequestsReceived.indexOf(id);
    user.friendRequestsReceived.splice(index, 1);
    await user.save();

    const friend = await User.findById(id);
    index = friend.friendRequestsSent.indexOf(user.id);
    friend.friendRequestsSent.splice(index, 1);
    await friend.save();

    res.status(200).json({
        status: 'success',
        message: 'Friend declined successfully'
    })
});

exports.getFriendRequestsReceived = catchAsync(async (req, res, next) => {
    const { user } = req;
    const friendRequestsReceived = await User.findById(user.id).populate('friendRequestsReceived');
    const data = friendRequestsReceived.friendRequestsReceived;
    res.status(200).json({
        status: 'success',
        count: data.length,
        friends: data
    })
});

// still to delete messages too
exports.deleteFriend = catchAsync(async (req, res, next) => {
    const { user } = req;
    const { id } = req.params;

    // if(!user.friends.includes(id))
    //     return next(new AppError('He is not your friend', 400));

    // check if the user is a friend
    let isFriend = false;
    let index = -1;
    // check if the user is a friend
    // and get the index of the friend
    user.friends.forEach((friend, idx) => {
        if(friend.friend == id) 
            isFriend = true, index = idx;
    });
    if(!isFriend)
        return next(new AppError('He is not your friend', 400));
    // delete the friend from the user's friends
    user.friends.splice(index, 1);
    await user.save();
    const friend = await User.findById(id);
    // delete the user from the friend's friend
    index = -1;
    friend.friends.forEach((friend, idx) => {
        if(friend.friend == user.id)
            index = idx;
    });
    friend.friends.splice(index, 1);
    await friend.save();

    const room = await Room.findOne({users: [user.id, id]});
    // delete the messages
    const messages = await Message.deleteMany({room: room._id}, {new: true});
    // delete the room
    await Room.findByIdAndDelete(room._id);
    
    

    res.status(200).json({
        status: 'success',
        message: 'Friend deleted successfully with chat'
    });
});


// getting the number of friend requests
exports.getNumberOfFriendRequests = async (id) => {
    const user = await User.findById(id);
    return user.friendRequestsReceived.length;    
};