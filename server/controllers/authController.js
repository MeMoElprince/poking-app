const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/emailHandler');
const crypto = require('crypto');
const User = require('../models/userModel');
const jwtFactory = require('../utils/tokenFactory');

exports.verifyEmail = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    if(!email)
        return next(new AppError('Please provide an email', 400));
    let user = await User.findOne({email});
    // create token of 6 characters using crypto and send it to the email 
    const token = crypto.randomBytes(3).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    // if user exist, update the token and tokenExpires
    
    if(process.env.NODE_ENV === 'development')
        console.log({token});

    let newUser;
    if(user)
    {
        user.secretToken = hashedToken;
        user.secretTokenExpires = Date.now() + 60 * 10 * 1000;
        user.save();
    }
    else
    {
        newUser = await User.create({
            email,
            secretToken: hashedToken,
            secretTokenExpires: Date.now() + 60 * 10 * 1000,
        });
    }
    // send email
    try{
        const emailHandler = new Email({email}, token);
        await emailHandler.sendVerification();
        res.status(200).json({
            status: 'success',
            message: 'Email verification has been sent successfully..'
        });
    } catch(err) {
        console.log({err});
        return next(new AppError('Error while sending email please try again later', 500));
    }
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
    let {email, secretToken} = req.body;
    if(!email || !secretToken)
        return next(new AppError('Please provide email and secretToken', 400));  
    secretToken = crypto.createHash('sha256').update(secretToken).digest('hex');
    let user = await User.findOne({email, secretToken, secretTokenExpires: {$gt: Date.now()}});
    if(!user)
        return next(new AppError('Invalid email or token or token expired!', 400));
    user.secretToken = undefined;
    user.secretTokenExpires = undefined;
    // generating token 
    const token = jwtFactory.createToken({id: user._id});
    user.token = token;
    user.save();
    res.status(200).json({
        status: 'success',
        token
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    if(!token)
        return next(new AppError('Please provide a token', 401));
    const decoded = await jwtFactory.verifyToken(token);
    const user = await User.findById(decoded.id);
    if(!user)
        return next(new AppError('User not found', 401));
    req.user = user;
    next();
});

exports.ristrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            return next(new AppError('You do not have permission to perform this action', 403));
        next();
    }
}

exports.logout = catchAsync(async (req, res, next) => {
    const {user} = req;
    user.token = undefined;
    user.save();
    res.status(200).json({
        status: 'success',
        message: 'Logout successfully'
    });
});
