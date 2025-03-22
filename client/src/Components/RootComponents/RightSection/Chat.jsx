import ReceivedMessage from '../../UiComponents/ReceivedMessage';
import SentMessage from '../../UiComponents/SentMessage';
import { useRef, useEffect, useContext, useState, memo } from 'react';
import { io } from 'socket.io-client';
import { FriendsCtx } from '../../../Store/Context/FriendsContext.jsx';
import { UserCtx } from '../../../Store/Context/UserContext.jsx';
import { GetAPIURL } from '../../../Store/urls.js';
import moment from "moment";
import socket from '../../../Store/socket.js';
const url = GetAPIURL();
// const messages = [
//   {type: 'sent', message: 'Hello', id: 1},
//   {type: 'received', message: 'Hi', id: 2},
// ];

// on 




// emit 



export default memo(function Chat({room}) {

  const [ messages, setMessages ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const {FriendsWith} = useContext(FriendsCtx);
  const {Id} = useContext(UserCtx);
  const chatRef = useRef();
  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
    const socket = io(url);
    // connect(room);
    // getMessages(setMessages);
    setLoading(true);
    socket.on('connect',()=>{
      socket.emit('join-room', room);
    })
    socket.on('get-messages', (data) => {
      setMessages(prev => [...prev, ...data]);
      setLoading(false);
    });
    

    socket.on('receive-message', (newMessage) => {
      setMessages(prev => [newMessage, ...prev]);
      setLoading(false);
    });

    return () => {
      socket.off('get-messages');
      socket.off('receive-message');
      socket.off('connect');
    }

  },[room])

  useEffect(() => {
    setMessages([]);
  }, [room]);
  // messages ? moment(new Date(messages[0]?.createdAt)).format("DD/MM/YYYY") : 
  let firstDate = messages ? moment(new Date(messages[0]?.createdAt)).format("DD/MM/YYYY") :'';
  return (
    <div ref={chatRef} className='px-4 overflow-auto space-y-5 h-full py-5 flex flex-col-reverse'>
      { !loading && messages && [...messages].map((e,idx)=>{
        const dateInDays = moment(new Date(e.createdAt)).format("DD/MM/YYYY");
        const oldFirstDate = firstDate;
        const showDate = firstDate !== dateInDays
        firstDate = dateInDays
        
        return(
          e.sender === Id 
          ? 
          <>
            {showDate && (
              <div className='mx-auto bg-black/40 py-1 px-3'>{oldFirstDate}</div>
            )}
            <div key={e._id} style={{direction:'rtl'}}>
              <SentMessage message={e.message} time={e.createdAt} customeStyle={idx===0?"mt-5":'mt-0'} /> 
            </div>
          </>
          : 
          <>
            {showDate && (
              <div className='mx-auto bg-black/40 py-1 px-3'>{oldFirstDate}</div>
            )}
            <div key={e._id} style={{direction:'ltr'}}>
              <ReceivedMessage message={e.message} time={e.createdAt} customeStyle={idx===0?"mt-5":'mt-0'} />
            </div>
          </>
        )
      })}
      { loading && <div className='text-center text-gray'>Loading...</div>}
    </div>
  )
})
