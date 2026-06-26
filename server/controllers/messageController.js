const Message = require('../models/messageModel');
const Room = require('../models/roomModel');
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

exports.createMessage = async (data) => {
    const filteredData = filterObj(data, 'message', 'sender', 'room');
    const newMessage = await Message.create(filteredData);
    // keep the room's last-message preview in sync for the chat list
    await Room.findByIdAndUpdate(filteredData.room, {
        lastMessage: filteredData.message,
        lastMessageAt: new Date()
    });
    return newMessage.toObject();
};

// newest-first, lean, capped. `before` (createdAt ms) enables "load older" paging.
exports.getMessages = async (roomId, { before, limit = 30 } = {}) => {
    const query = { room: roomId };
    if(before)
        query.createdAt = { $lt: Number(before) };
    const messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    return messages;
};

// mark all messages in a room not sent by `reader` as read; returns matched count
exports.markRoomRead = async (roomId, reader) => {
    const res = await Message.updateMany(
        { room: roomId, sender: { $ne: reader }, isRead: false },
        { isRead: true }
    );
    return res.modifiedCount || 0;
};
