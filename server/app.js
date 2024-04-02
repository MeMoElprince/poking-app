const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socket = require('socket.io');

const userRouter = require('./routes/userRouter');
const globalErrorHandler = require('./controllers/globalErrorHandler');

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


app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server`
    });
});

app.use(globalErrorHandler);





io.on('connection', (socket) => {
    console.log(socket.id);
    // the below code will run when the client emits a 'send-message' event to the server 
    // and the server will broadcast the message to all the clients except the one that sent the message
    // the message will be received by the client when the server emits a 'receive-message' event to all the clients 
    socket.on('send-message', (data) => {
        console.log(data);
        socket.broadcast.emit('receive-message', data);
    });
})



module.exports = server;