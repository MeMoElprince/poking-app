/* eslint-disable react/prop-types */
import ReceivedMessage from '../../UiComponents/ReceivedMessage';
import SentMessage from '../../UiComponents/SentMessage';
import TypingDots from '../../UiComponents/TypingDots';
import { ChatSkeleton } from '../../UiComponents/Skeleton';
import { useRef, useEffect, useContext, useState, memo } from 'react';
import { FriendsCtx } from '../../../Store/Context/FriendsContext.jsx';
import { UserCtx } from '../../../Store/Context/UserContext.jsx';
import { VscSend } from "react-icons/vsc";
import { FaArrowDown } from "react-icons/fa6";
import moment from "moment";
import socket from '../../../Store/socket.js';

let tempCounter = 0;

export default memo(function Chat({ room }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendTyping, setFriendTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [message, setMessage] = useState('');

  const { FriendsWith } = useContext(FriendsCtx);
  const { Id } = useContext(UserCtx);
  const friendId = FriendsWith?.id;

  const chatRef = useRef(null);
  const typingSentRef = useRef(0);
  const stopTypingTimer = useRef(null);

  const scrollToBottom = (smooth = true) => {
    if (chatRef.current)
      chatRef.current.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  };
  const isAtBottom = () => chatRef.current && Math.abs(chatRef.current.scrollTop) < 120;

  // --- room lifecycle: join + listeners ---
  useEffect(() => {
    if (!room) return;
    setMessages([]);
    setLoading(true);
    setFriendTyping(false);

    socket.emit('join-room', room);

    const onGetMessages = (data) => {
      setMessages(data);
      setLoading(false);
      socket.emit('mark-read', { room });
    };
    const onReceive = (msg) => {
      setMessages(prev => prev.some(m => m._id === msg._id) ? prev : [msg, ...prev]);
      socket.emit('mark-read', { room });
    };
    const onRead = ({ room: r }) => {
      if (r !== room) return;
      setMessages(prev => prev.map(m => (m.sender === Id ? { ...m, isRead: true, status: 'read' } : m)));
    };
    const onTyping = ({ userId }) => { if (userId === friendId) setFriendTyping(true); };
    const onStopTyping = ({ userId }) => { if (userId === friendId) setFriendTyping(false); };

    socket.on('get-messages', onGetMessages);
    socket.on('receive-message', onReceive);
    socket.on('messages-read', onRead);
    socket.on('typing', onTyping);
    socket.on('stop-typing', onStopTyping);

    return () => {
      socket.off('get-messages', onGetMessages);
      socket.off('receive-message', onReceive);
      socket.off('messages-read', onRead);
      socket.off('typing', onTyping);
      socket.off('stop-typing', onStopTyping);
      clearTimeout(stopTypingTimer.current);
    };
  }, [room, Id, friendId]);

  // keep pinned to bottom when a new message arrives and we're already near bottom
  useEffect(() => {
    if (isAtBottom()) scrollToBottom(false);
  }, [messages.length]);

  const handleScroll = () => {
    setShowScrollBtn(!isAtBottom());
  };

  const emitStopTyping = () => {
    clearTimeout(stopTypingTimer.current);
    socket.emit('stop-typing', { room });
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    const now = Date.now();
    if (now - typingSentRef.current > 1000) {
      typingSentRef.current = now;
      socket.emit('typing', { room });
    }
    clearTimeout(stopTypingTimer.current);
    stopTypingTimer.current = setTimeout(emitStopTyping, 1500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    const tempId = `temp-${Date.now()}-${tempCounter++}`;
    const optimistic = {
      _id: tempId,
      message: text,
      sender: Id,
      room,
      createdAt: Date.now(),
      status: 'sending',
      isRead: false,
    };
    setMessages(prev => [optimistic, ...prev]);
    setMessage('');
    emitStopTyping();
    scrollToBottom();

    socket.emit('send-message', { room, message: text }, (saved) => {
      if (!saved || saved.error) {
        setMessages(prev => prev.map(m => m._id === tempId ? { ...m, status: 'failed' } : m));
        return;
      }
      setMessages(prev => prev.map(m => m._id === tempId ? { ...saved, status: 'sent' } : m));
    });
  };

  let firstDate = messages.length ? moment(new Date(messages[0]?.createdAt)).format("DD/MM/YYYY") : '';

  return (
    <div className="flex flex-col h-full relative">
      <div
        ref={chatRef}
        onScroll={handleScroll}
        className='px-4 overflow-auto space-y-2 flex-grow py-5 flex flex-col-reverse'
      >
        {loading && <ChatSkeleton />}

        {!loading && messages.length === 0 && (
          <div className='m-auto text-center text-gray select-none'>
            <p className='text-3xl mb-2'>👋</p>
            <p>Say hi to {FriendsWith?.Title || 'your friend'}!</p>
          </div>
        )}

        {!loading && friendTyping && (
          <div className='flex items-center gap-2 pl-1 pb-1' style={{ direction: 'ltr' }}>
            <div className='bg-background1 rounded-lg py-3 px-4 w-fit'>
              <TypingDots />
            </div>
          </div>
        )}

        {!loading && messages.map((e, idx) => {
          const dateInDays = moment(new Date(e.createdAt)).format("DD/MM/YYYY");
          const oldFirstDate = firstDate;
          const showDate = firstDate !== dateInDays;
          firstDate = dateInDays;
          const status = e.status || (e.isRead ? 'read' : 'sent');

          return (
            <div key={e._id} className='flex flex-col-reverse'>
              {e.sender === Id ? (
                <div style={{ direction: 'rtl' }}>
                  <SentMessage message={e.message} time={e.createdAt} status={status} customeStyle={idx === 0 ? "mt-2" : 'mt-0'} />
                </div>
              ) : (
                <div style={{ direction: 'ltr' }}>
                  <ReceivedMessage message={e.message} time={e.createdAt} customeStyle={idx === 0 ? "mt-2" : 'mt-0'} />
                </div>
              )}
              {showDate && (
                <div className='mx-auto bg-black/40 py-1 px-3 my-3 rounded-md text-xs text-gray'>{oldFirstDate}</div>
              )}
            </div>
          );
        })}
      </div>

      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom()}
          aria-label="Scroll to latest"
          className='absolute bottom-20 right-4 z-10 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 active:scale-95 transition'
        >
          <FaArrowDown size={16} />
        </button>
      )}

      <form onSubmit={handleSend} className='flex items-center gap-2 p-3 bg-background2 border-t border-background1'>
        <div className='flex-grow flex items-center bg-[#383838] rounded-2xl px-4 transition-shadow duration-150 focus-within:ring-2 focus-within:ring-primary/60'>
          <input
            onChange={handleInputChange}
            onBlur={emitStopTyping}
            value={message}
            className='w-full bg-transparent outline-none border-0 py-3 text-white placeholder-gray'
            type="text"
            placeholder='Type a message'
            aria-label="Message"
          />
        </div>
        <button
          type='submit'
          aria-label="Send message"
          disabled={!message.trim()}
          className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150
            ${message.trim()
              ? 'bg-primary text-white hover:scale-105 active:scale-95 shadow-lg shadow-primary/30'
              : 'bg-[#383838] text-gray cursor-not-allowed'}`}
        >
          <VscSend size={20} />
        </button>
      </form>
    </div>
  );
});
