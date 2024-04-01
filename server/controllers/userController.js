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
    const { email } = req.body;
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
    const filteredDate = filterObj(data, 'name', 'username', 'imgName');
    const updated = await User.findByIdAndUpdate(user._id, filteredDate, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        updatedUser: updated
    });
});

exports.ristrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            return next(new AppError('You do not have permission to perform this action', 403));
        next();
    }
}