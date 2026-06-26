import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { GetAPIURL } from './urls';

const url = GetAPIURL();

// One shared connection for the whole app. Connect after login (with auth token),
// disconnect on logout. Outgoing emits before connect are queued by socket.io.
const socket = io(url, {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

let warned = false;
socket.on('connect', () => { warned = false; });
socket.on('connect_error', (err) => {
  if (!warned) {
    warned = true;
    toast('Connection lost, retrying…', { theme: 'dark', autoClose: 4000, position: 'top-right' });
  }
  console.error('socket connect_error:', err.message);
});

export const connectSocket = (token) => {
  if (!token) return;
  socket.auth = { token };
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export default socket;
