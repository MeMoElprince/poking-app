import ReceivedMessage from '../../UiComponents/ReceivedMessage';
import SentMessage from '../../UiComponents/SentMessage';
import { useRef, useEffect, useContext, useState } from 'react';
import { io } from 'socket.io-client';
import { FriendsCtx } from '../../../Store/Context/FriendsContext.jsx';
import { UserAuthCtx } from '../../../Store/Context/UserAuthContext.jsx';
import { GetAPIURL } from '../../../Store/urls.js';
import socket from '../../../Store/socket.js';
const url = GetAPIURL();
// const messages = [
//   {type: 'sent', message: 'Hello', id: 1},
//   {type: 'received', message: 'Hi', id: 2},
// ];

// on 




// emit 



export default function Chat() {

  const [ messages, setMessages ] = useState([]);
  const {FriendsWith} = useContext(FriendsCtx);
  const {Id} = useContext(UserAuthCtx);
  const chatRef = useRef();
  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
    const socket = io(url);
    const room = FriendsWith.room;
    // connect(room);
    // getMessages(setMessages);
    socket.on('connect',()=>{
      console.log('connected to socket server');
      socket.emit('join-room', room);
    })
    socket.on('get-messages', (data) => {
      setMessages(prev => [...prev, ...data]);
    });
    

    socket.on('receive-message', (newMessage) => {
      console.log('i revived');
      setMessages(prev => [newMessage, ...prev]);
    });

  },[])
  return (
    <div ref={chatRef} className='px-4 overflow-auto space-y-5 h-full py-5'>
      { messages && [...messages].reverse().map(e=>{
        return(
          e.sender === Id 
          ? 
          <div key={e._id} style={{direction:'rtl'}}>
            <SentMessage message={e.message} /> 
          </div>
          : 
          <div key={e._id} style={{direction:'ltr'}}>
            <ReceivedMessage message={e.message} />
          </div>
        )
      })}
    </div>
  )
}
