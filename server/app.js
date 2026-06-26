const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socket = require('socket.io');

const userRouter = require('./routes/userRouter');
const globalErrorHandler = require('./controllers/globalErrorHandler');
const messageController = require('./controllers/messageController');
const userController = require('./controllers/userController');
const jwtFactory = require('./utils/tokenFactory');
const Email = require('./utils/emailHandler');

const Room = require('./models/roomModel');
const User = require('./models/userModel');
const app = express();

// Behind Render's proxy: trust X-Forwarded-* so req.ip (rate limiting) and
// req.protocol are correct.
app.set('trust proxy', 1);

// Allow locking CORS down to the deployed client via env; defaults to open.
const CLIENT_ORIGIN = process.env.CLIENT_URL || '*';

const server = http.createServer(app);
const io = socket(server, {
    cors: { origin: CLIENT_ORIGIN }
});

// --- global middleware (order matters) ---

// gzip all responses
app.use(compression());

// secure HTTP headers (allow the separate client origin to read resources)
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS for the REST API
app.use(cors({ origin: CLIENT_ORIGIN }));

// body parser with a size cap to blunt large-payload abuse
app.use(express.json({ limit: '10kb' }));

// strip $ / . operators from inputs to prevent NoSQL query injection
app.use(mongoSanitize());

// request logging in development only
if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

// rate limit the API per client IP (now keyed correctly via trust proxy)
const limiter = rateLimit({
    max: 200,
    windowMs: 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'fail', message: 'Too many requests, please try again in a minute' }
});
app.use('/api', limiter);


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



// ---- socket auth: verify JWT once per connection, trust socket.data.userId after ----
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth && socket.handshake.auth.token;
        if(!token) return next(new Error('unauthorized'));
        const decoded = jwtFactory.verifyToken(token);
        socket.data.userId = decoded.id;
        next();
    } catch (err) {
        next(new Error('unauthorized'));
    }
});

// ---- in-memory presence: userId -> Set<socketId> (single instance only) ----
const online = new Map();

const addOnline = (userId, socketId) => {
    if(!online.has(userId)) online.set(userId, new Set());
    online.get(userId).add(socketId);
    return online.get(userId).size === 1; // true if this is the user's first connection
};

const removeOnline = (userId, socketId) => {
    const set = online.get(userId);
    if(!set) return false;
    set.delete(socketId);
    if(set.size === 0) { online.delete(userId); return true; } // true if user went fully offline
    return false;
};

// ---- offline email notifications (throttled, reuses User.lastNotifiedAt) ----
const NOTIFY_WINDOW = 3 * 60 * 60 * 1000; // 3 hours

const notifyOfflineRecipient = async (recipientId, senderId) => {
    // Atomically "claim" a notification slot: only proceed if the recipient hasn't
    // been notified within the window. This both throttles and avoids race-double-sends.
    const cutoff = new Date(Date.now() - NOTIFY_WINDOW);
    const recipient = await User.findOneAndUpdate(
        {
            _id: recipientId,
            $or: [{ lastNotifiedAt: { $exists: false } }, { lastNotifiedAt: { $lt: cutoff } }]
        },
        { lastNotifiedAt: new Date() },
        { new: false }
    ).select('email name');

    if(!recipient || !recipient.email) return; // not found, or within the 3h window

    const sender = await User.findById(senderId).select('name');
    const senderName = (sender && sender.name) || 'Someone';
    await new Email({ email: recipient.email, name: recipient.name }, null)
        .sendMessageNotification(senderName);
};

io.on('connection', (socket) => {
    const userId = socket.data.userId;

    // personal room for targeted notifications + presence
    socket.join(userId);
    const firstConnection = addOnline(userId, socket.id);
    socket.emit('presence:init', [...online.keys()]);
    if(firstConnection)
        socket.broadcast.emit('presence', { userId, online: true });

    socket.on('disconnect', async () => {
        const wentOffline = removeOnline(userId, socket.id);
        if(wentOffline) {
            const lastSeen = new Date();
            try { await User.findByIdAndUpdate(userId, { lastSeen }); }
            catch (err) { console.log(err.message); }
            socket.broadcast.emit('presence', { userId, online: false, lastSeen });
        }
    });

    // kept for client compatibility; presence/join is now automatic on connect
    socket.on('connect-user', () => {});

    socket.on('get-friends', async (targetId) => {
        try {
            const friends = await userController.myFriends(targetId);
            io.to(targetId).emit('get-friends', friends);
        } catch (err) { console.log(err.message); }
    });

    socket.on('friend-request-sent', async (targetId) => {
        try {
            const received = await userController.friendRequestsReceived(targetId);
            io.to(targetId).emit('friend-request-received', received);
        } catch (err) { console.log(err.message); }
    });

    socket.on('number-friend-request', async (targetId) => {
        try {
            const count = await userController.getNumberOfFriendRequests(targetId);
            io.to(targetId).emit('number-friend-request', count);
        } catch (err) { console.log(err.message); }
    });

    socket.on('join-room', async (room) => {
        try {
            if(socket.data.room && socket.data.room !== room)
                socket.leave(socket.data.room);
            socket.join(room);
            socket.data.room = room;
            const messages = await messageController.getMessages(room);
            socket.emit('get-messages', messages);
        } catch (err) { console.log(err.message); }
    });

    // infinite scroll up: fetch older messages before a given timestamp
    socket.on('load-older', async ({ room, before }) => {
        try {
            const messages = await messageController.getMessages(room, { before });
            socket.emit('older-messages', { room, messages });
        } catch (err) { console.log(err.message); }
    });

    socket.on('send-message', async (data, ack) => {
        try {
            const payload = { room: data.room, message: data.message, sender: userId };
            const newMessage = await messageController.createMessage(payload);
            // broadcast to the room, excluding the sender (sender uses the ack copy)
            socket.to(data.room).emit('receive-message', newMessage);
            // notify the recipient's personal room for list preview / counter / sound
            const room = await Room.findById(data.room).lean();
            const toId = room && room.users.find(u => u.toString() !== userId);
            if(toId) {
                io.to(toId.toString()).emit('message-notification', {
                    room: data.room,
                    message: newMessage.message,
                    senderId: userId
                });
                // email the recipient if they're offline — fire-and-forget, throttled to 3h
                if(!online.has(toId.toString()))
                    notifyOfflineRecipient(toId.toString(), userId)
                        .catch(err => console.log('notify error:', err.message));
            }
            if(typeof ack === 'function') ack(newMessage);
        } catch (err) {
            console.log(err.message);
            if(typeof ack === 'function') ack({ error: 'send-failed' });
        }
    });

    socket.on('mark-read', async ({ room }) => {
        try {
            const changed = await messageController.markRoomRead(room, userId);
            if(changed > 0)
                socket.to(room).emit('messages-read', { room });
        } catch (err) { console.log(err.message); }
    });

    socket.on('typing', ({ room }) => {
        socket.to(room).emit('typing', { room, userId });
    });

    socket.on('stop-typing', ({ room }) => {
        socket.to(room).emit('stop-typing', { room, userId });
    });
});



module.exports = server;