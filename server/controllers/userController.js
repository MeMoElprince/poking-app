const User = require('../models/userModel');
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
    const user = await User.findOne({email});
    if(!user)
        return next(new AppError('User not found', 404));
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
    const friends = await User.findById(user.id).populate('friends');
    res.status(200).json({
        status: 'success',
        count: friends.friends.length,
        friends: friends.friends
    });
});

exports.addFriend = catchAsync(async (req, res, next) => {
    // getting user
    const { user } = req;
    // getting id of the firend
    const { id } = req.params;
    if(user.friends.includes(id))
        return next(new AppError('He is your friend actually!!!', 400));
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
    console.log(user.friendRequestsReceived);
    if(!user.friendRequestsReceived.includes(id))
        return next(new AppError('No friend request like this ID', 400));
    user.friends.push(id);
    let index = user.friendRequestsReceived.indexOf(id);
    user.friendRequestsReceived.splice(index, 1);
    await user.save();
    const friend = await User.findById(id);
    index = friend.friendRequestsSent.indexOf(user.id);
    friend.friendRequestsSent.splice(index, 1);
    friend.friends.push(user.id);
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

exports.deleteFriend = catchAsync(async (req, res, next) => {
    const { user } = req;
    const { id } = req.params;
    if(!user.friends.includes(id))
        return next(new AppError('He is not your friend', 400));
    let index = user.friends.indexOf(id);
    user.friends.splice(index, 1);
    await user.save();
    const friend = await User.findById(id);
    index = friend.friends.indexOf(user.id);
    friend.friends.splice(index, 1);
    await friend.save();
    res.status(200).json({
        status: 'success',
        message: 'Friend deleted successfully'
    });
});