const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRouter = require('./routes/userRouter');
const globalErrorHandler = require('./controllers/globalErrorHandler');

const app = express();


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

module.exports = app;