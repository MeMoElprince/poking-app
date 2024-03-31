const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.verifyEmail = catchAsync((req, res, next) => {
    const { email, token } = req.query;
    if(!email || !token) {
        return next(new AppError('Invalid request', 400));
    }

    res.status(200).json({
        status: 'success',
        message: 'Email verified successfully'
    });
});

