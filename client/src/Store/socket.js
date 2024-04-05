import { io } from 'socket.io-client';
import { GetAPIURL } from './urls';
const url = GetAPIURL();

const socket = io(url);


export default socket;