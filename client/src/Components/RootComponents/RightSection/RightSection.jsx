/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from 'react';
import Logo from '../../../assets/logo.png';
import { CiLock } from "react-icons/ci";
import { motion } from 'framer-motion';
import { FriendsCtx } from '../../../Store/Context/FriendsContext';
import { PresenceCtx } from '../../../Store/Context/PresenceContext';
import { MdDelete } from "react-icons/md";
import { DeleteFriend } from '../../../Store/urls';
import { UserCtx } from '../../../Store/Context/UserContext';
import { toast } from 'react-toastify';
import moment from 'moment';
import Chat from './Chat';
import TypingDots from '../../UiComponents/TypingDots';
import socket from '../../../Store/socket';

const toastOpts = {
  position: "top-right", autoClose: 5000, hideProgressBar: false,
  closeOnClick: true, pauseOnHover: true, draggable: true,
  progress: undefined, theme: "dark",
};

function Empty() {
  return (
    <motion.section
      initial={{ opacity: 0, backgroundColor: '#202020' }}
      animate={{ opacity: 1, backgroundColor: '#2C2C2C' }}
      transition={{ duration: 1 }}
      className='flex flex-col justify-between items-center px-5 h-full'>
      <div></div>
      <div className='flex flex-col gap-4 items-center text-center pointer-events-none'>
        <motion.img
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          src={Logo} className='w-32 opacity-20 select-none' alt="logo" />
        <h1 className='text-2xl'>Poking App</h1>
        <p className='text-gray'>
          Send and receive messages without a phone number only with email. <br />
          Use Poking App on your browser and phone at the same time.
        </p>
      </div>
      <div className='text-gray mb-10 flex text-center items-center gap-2'>
        <CiLock /> End-to-end encrypted
      </div>
    </motion.section>
  );
}

export default function RightSection({ className = "" }) {
  const { FriendsWith, setFriendsWith } = useContext(FriendsCtx);
  const { isOnline, getLastSeen } = useContext(PresenceCtx);
  const { Token } = useContext(UserCtx);
  const [friendTyping, setFriendTyping] = useState(false);

  const friendId = FriendsWith?.id;
  const room = FriendsWith?.room;

  // header typing subtitle (Chat shows the in-thread bubble; this is the header line)
  useEffect(() => {
    setFriendTyping(false);
    if (!friendId) return;
    const onTyping = ({ userId }) => { if (userId === friendId) setFriendTyping(true); };
    const onStop = ({ userId }) => { if (userId === friendId) setFriendTyping(false); };
    socket.on('typing', onTyping);
    socket.on('stop-typing', onStop);
    return () => {
      socket.off('typing', onTyping);
      socket.off('stop-typing', onStop);
    };
  }, [friendId]);

  const handleRemoveFriend = async () => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;
    try {
      const response = await fetch(DeleteFriend(friendId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Token}` }
      });
      const res = await response.json();
      if (res.status === 'success') socket.emit('get-friends', friendId);
      toast(res.message, toastOpts);
    } catch (err) {
      console.error('Error:', err);
      toast('Could not remove friend, try again', toastOpts);
    }
    setFriendsWith(null);
  };

  const online = friendId ? isOnline(friendId) : false;
  const lastSeen = (friendId && getLastSeen(friendId)) || FriendsWith?.lastSeen;

  const Subtitle = () => {
    if (friendTyping)
      return <span className='flex items-center gap-2 text-primary'>typing <TypingDots /></span>;
    if (online)
      return <span className='text-green-400'>online</span>;
    if (lastSeen)
      return <span className='text-gray'>last seen {moment(new Date(lastSeen)).fromNow()}</span>;
    return <span className='text-gray'>offline</span>;
  };

  return (
    <div className={`${className}`}>
      {!FriendsWith && <Empty />}
      {FriendsWith &&
        <div className='flex flex-col h-full bg-background2'>
          <div className='flex justify-between items-center p-4 bg-background2 border-b border-background1'>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div className='imgPlaceholder'>
                  <img className='max-w-10 max-h-10 min-w-10 min-h-10 rounded-full' src={FriendsWith.Img} alt={FriendsWith.Title} />
                </div>
                {online && <span className='online-dot' />}
              </div>
              <div className='flex flex-col'>
                <h1 className='text-lg font-bold mytruncate2' title={FriendsWith.Title}>{FriendsWith.Title}</h1>
                <div className='text-sm h-5'><Subtitle /></div>
              </div>
            </div>
            <button onClick={handleRemoveFriend} aria-label='Delete friend' title='Delete Friend'
              className='text-gray hover:text-red-400 transition'>
              <MdDelete size={28} />
            </button>
          </div>
          <div className='flex-grow bg-background2 mainBg overflow-hidden'>
            <Chat room={room} />
          </div>
        </div>
      }
    </div>
  );
}
