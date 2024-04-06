const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socket = require('socket.io');

const catchAsync = require('./utils/catchAsync');
const userRouter = require('./routes/userRouter');
const globalErrorHandler = require('./controllers/globalErrorHandler');
const messageController = require('./controllers/messageController');
const userController = require('./controllers/userController');

const app = express();

const server = http.createServer(app);
const io = socket(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());

if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 1 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour',
    keyGenerator: (req, res) => {
        return req.clientIp // IP address from requestIp.mw(), as opposed to req.ip
    }    
});

app.use(limiter);
app.use(express.json());


app.use('/api/v1/users', userRouter);
app.use('/sleep', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'I am not sleeping'
    });
});

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server`
    });
});

app.use(globalErrorHandler);



io.on('connection', (socket) => {

    socket.on('connect-user', async (userId) => {
        try{
            socket.join(userId);
        } catch (err) {
            console.log(err.message);
        }
    });

    socket.on('number-friend-request', async (userId) => {
        try{
            const numberOfFriendRequests = await userController.getNumberOfFriendRequests(userId);
            io.to(userId).emit('number-friend-request', numberOfFriendRequests);
        } catch (err) {
            console.log(err.message);
        }
    });

    socket.on('join-room', async (room) => {
        socket.join(room);
        const messages = await messageController.getMessages(room);
        socket.emit('get-messages', messages);
    });


    socket.on('send-message', async (data) => {
        try{    
            const newMessage = await messageController.createMessage(data);
            socket.to(data.room).emit('receive-message', newMessage);

        } catch (err) {
            console.log(err.message);
        }
    });






})



module.exports = server;