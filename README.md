<div align="center">

# 💬 Poking App

**A real-time, passwordless chat platform — add friends by email and start talking instantly.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-9837F9?style=for-the-badge)](https://poking-app.netlify.app/)
&nbsp;
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Real-time Events](#real-time-events)
- [Project Structure](#project-structure)
- [Security Notes](#security-notes)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

Poking App is a full-stack chat application. There are **no passwords** — you sign in with
your email and a one-time code (OTP). Once in, you add friends by their email address and
chat in real time, with typing indicators, online presence, and read receipts.

> 🌐 **Live:** client on [poking-app.netlify.app](https://poking-app.netlify.app/) · API on Render

---

## Features

- 🔐 **Passwordless auth** — email → 6-digit OTP → JWT session
- 💬 **Real-time messaging** over WebSockets (Socket.IO)
- ✍️ **Typing indicators** — see when a friend is typing
- 🟢 **Online presence & last seen** — live status dots, "last seen …"
- ✓✓ **Read receipts** — single tick (sent) → double tick (read)
- ⚡ **Optimistic send** — messages appear instantly with a sending/sent/read state
- 👥 **Friend system** — send / accept / decline requests, delete friends
- 🔎 **Search** your chats, with most-recent conversations first
- 🪪 **Profile page** — display name, username, avatar
- 🎨 **Polished UX** — skeleton loaders, smooth animations, dark theme, responsive layout

### Coming soon
- User avatars / photo upload
- File & image sharing in chat
- Group chats

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Socket.IO Client, Framer Motion, React-Toastify, React-Icons, Moment, js-cookie |
| **Backend** | Node.js, Express, Socket.IO, Mongoose (MongoDB), JSON Web Tokens |
| **Email (OTP)** | [Brevo](https://www.brevo.com/) HTTP API (no SMTP — works on hosts that block SMTP) |
| **Security/Perf** | Helmet, CORS, express-rate-limit, express-mongo-sanitize, compression (gzip) |
| **Hosting** | Netlify (client), Render (API), MongoDB Atlas (database) |

---

## Architecture

```
┌────────────┐    HTTPS / WSS    ┌──────────────────────────┐      ┌──────────────┐
│   Client   │ ◀───────────────▶ │       Express API        │ ◀──▶ │ MongoDB Atlas│
│ (React/Vite│   REST + Socket   │  + Socket.IO (one server)│      └──────────────┘
│  Netlify)  │                   │         Render           │
└────────────┘                   └────────────┬─────────────┘
                                               │ HTTPS
                                               ▼
                                       ┌───────────────┐
                                       │  Brevo (OTP)  │
                                       └───────────────┘
```

- A **single HTTP server** serves both the REST API and the Socket.IO connection.
- Auth is **JWT**: issued after OTP verification, sent as a `Bearer` token for REST and in
  the **socket handshake** (`auth.token`) for the websocket — the server rejects unauthenticated
  sockets and derives the user id from the token (clients can't spoof a sender).
- Online presence is tracked **in memory** (single instance). See [Security Notes](#security-notes).

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- A MongoDB connection string (e.g. MongoDB Atlas)
- A free [Brevo](https://www.brevo.com/) account + API key and a **verified sender email**

### 1. Clone
```bash
git clone https://github.com/MeMoElprince/poking-app.git
cd poking-app
```

### 2. Server
```bash
cd server
npm install
cp env.example .env     # then fill in the values (see below)
npm run dev             # development (nodemon)
# npm start             # production (node server.js)
```

### 3. Client
```bash
cd client
npm install
# create client/.env with VITE_API_URL (see below)
npm run dev             # Vite dev server
npm run build           # production build → dist/
```

> ℹ️ The server reads its config from **`server/.env`** (copied from `env.example`).

---

## Environment Variables

### `server/.env`

| Variable | Required | Description |
|----------|:--------:|-------------|
| `DATABASE` | ✅ | MongoDB connection string (use `<PASSWORD>` placeholder for the password) |
| `DATABASE_PASSWORD` | ✅ | DB password, substituted into `DATABASE` at startup |
| `JWT_SECRET` | ✅ | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | ✅ | Token lifetime, e.g. `90d` |
| `BREVO_API_KEY` | ✅ | Brevo API key for sending OTP emails |
| `BREVO_SENDER_EMAIL` | ✅ | A sender address **verified** in Brevo |
| `BREVO_SENDER_NAME` | — | Display name for the sender (defaults to `PokingApp`) |
| `CLIENT_URL` | — | Restrict CORS to this origin (defaults to `*`) |
| `PORT` | — | Server port (defaults to `2000`, or Render's assigned port) |

### `client/.env`

| Variable | Required | Description |
|----------|:--------:|-------------|
| `VITE_API_URL` | ✅ | Base URL of the API, **with a trailing slash** — e.g. `https://your-api.onrender.com/` |

---

## Available Scripts

### Server (`/server`)
| Script | Action |
|--------|--------|
| `npm start` | Run in production (`node server.js`) |
| `npm run dev` | Run with nodemon, `NODE_ENV=development` |
| `npm run prod` | Run with nodemon, `NODE_ENV=production` |

### Client (`/client`)
| Script | Action |
|--------|--------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## Real-time Events

All socket connections require a valid JWT in the handshake: `io(url, { auth: { token } })`.

**Client → Server**

| Event | Payload | Purpose |
|-------|---------|---------|
| `join-room` | `roomId` | Subscribe to a chat room and load its latest messages |
| `load-older` | `{ room, before }` | Fetch older messages before a timestamp (pagination) |
| `send-message` | `{ room, message }`, `ack` | Persist & broadcast a message; `ack` returns the saved doc |
| `mark-read` | `{ room }` | Mark the room's incoming messages as read |
| `typing` / `stop-typing` | `{ room }` | Relay typing state to the other participant |
| `get-friends` | `userId` | Ask the server to push a fresh friends list to a user |
| `friend-request-sent` / `number-friend-request` | `userId` | Notify a user of a new/changed friend request |

**Server → Client**

| Event | Payload | Purpose |
|-------|---------|---------|
| `presence:init` | `[userId]` | Snapshot of who is currently online |
| `presence` | `{ userId, online, lastSeen? }` | Live online/offline updates |
| `get-messages` | `[message]` | A room's latest messages |
| `older-messages` | `{ room, messages }` | Paged older messages |
| `receive-message` | `message` | A new message in the open room |
| `message-notification` | `{ room, message, senderId }` | New-message hint for the chat list (preview / unread) |
| `messages-read` | `{ room }` | Recipient read your messages → flip ticks to ✓✓ |
| `typing` / `stop-typing` | `{ room, userId }` | The other participant's typing state |

---

## Project Structure

```
poking-app/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── Components/       # Pages, RootComponents (Left/Right/Sidebar), UiComponents
│       ├── Store/            # Context (User, Friends, Presence, BackDrop), socket.js, urls.js
│       └── ...
└── server/                  # Express + Socket.IO backend
    ├── app.js               # Express app, middleware & all Socket.IO handlers
    ├── server.js            # DB connection + HTTP server bootstrap
    ├── controllers/         # auth, user, message, global error handler
    ├── models/              # User, Room, Message (Mongoose schemas)
    ├── routes/              # REST routes (/api/v1/users)
    ├── utils/               # email (Brevo), token factory, error helpers
    └── views/email/         # Pug templates for emails
```

---

## Security Notes

- **JWT-authenticated sockets** — unauthenticated connections are rejected; the message
  sender is taken from the token, not the client payload.
- **Helmet** sets hardened HTTP headers; **CORS** can be locked to `CLIENT_URL`.
- **Rate limiting** (200 req/min per IP) on `/api`, with `trust proxy` enabled so client IPs
  are read correctly behind Render's proxy.
- **express-mongo-sanitize** strips `$`/`.` operators to prevent NoSQL injection; JSON bodies
  are capped at `10kb`.
- **Presence is in-memory**, which is correct for a single instance. To scale horizontally,
  add the [Socket.IO Redis adapter](https://socket.io/docs/v4/redis-adapter/) and move
  presence to a shared store.

---

## Roadmap

- [ ] Avatar / photo upload
- [ ] File & image messages
- [ ] Group chats
- [ ] Message editing & deletion
- [ ] Push notifications

---

## Author

**Mustafa Elsharawy** — [@MeMoElprince](https://github.com/MeMoElprince)

> Contributions and issues are welcome. If you find this project useful, consider giving it a ⭐.
