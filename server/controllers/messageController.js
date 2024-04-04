const Message = require('../models/messageModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if(allowedFields.includes(key))
            newObj[key] = obj[key];
    });
    return newObj;
}

exports.createMessage = catchAsync(async (data) => {
    const filteredData = filterObj(data, 'message', 'sender', 'room');
    const newMessage = await Message.create(filteredData, {new: true});
    return newMessage;
});

exports.getMessages = catchAsync(async (roomId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const messages = await Message.find({room: roomId}).skip(skip).limit(limit).sort({createdAt: -1});
    return messages;
});


