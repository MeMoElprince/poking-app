/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Logo from '../../../assets/logo.png';
import { CiLock } from "react-icons/ci";
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { FriendsCtx } from '../../../Store/Context/FriendsContext';
import { VscSend } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import { DeleteFriend } from '../../../Store/urls';
import { UserCtx } from '../../../Store/Context/UserContext';
import { toast } from 'react-toastify';
import { GetAPIURL } from '../../../Store/urls';
import Chat from './Chat';
import socket from '../../../Store/socket';
const url = GetAPIURL();


export default function RightSection({ className = "" }) {
  const { FriendsWith, setFriendsWith } = useContext(FriendsCtx);
  const { Token, Id } = useContext(UserCtx);
  const [showSendBtn, setShowSendBtn] = useState(false);
  const [message, setMessage] = useState('');

  const Empty = () => {
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
    )
  }

  const handleRemoveFriend = async() => {
    const res = window.confirm('Are you sure you want to remove this friend?');
    if (res) {
      const url = DeleteFriend(FriendsWith.id);
      try{
        const response = await fetch(url,{
          method:'PATCH',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${Token}`
          }
        });
        const res = await response.json();
        if(res.status === 'success'){
          console.log(FriendsWith.id);
          socket.emit('get-friends',FriendsWith.id)
        }
        toast(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }catch(err){
        console.error('Error:',err);
      }
      setFriendsWith(null);
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message === '') return;
    // Send the message to the server
    const room = FriendsWith.room;
    socket.emit('send-message', {room, message: message, sender: Id});
    // Clear the input field
    setMessage('');
  }

  const handleInputChanges = (e) => {
    setShowSendBtn(e.target.value.length > 0 ? true : false);
    setMessage(e.target.value);
  }

  // Reset the message input and hide the send button when the user changes the friend
  useEffect(()=>{
    setShowSendBtn(false);
    setMessage('');
  },[FriendsWith])
  return (
    <div className={`${className}`}>
      {!FriendsWith && <Empty />}
      {FriendsWith &&
        <div className='flex flex-col h-full bg-background2'>
          <div className='flex justify-between items-center p-4 bg-background2'>
            <div className='flex items-center gap-4'>
              <div className='imgPlaceholder'>
                <img className='max-w-10 max-h-10 min-w-10 min-h-10 rounded-full' src={FriendsWith.Img} alt="" /></div>
              <div className='flex flex-col'>
                <h1 className='text-lg font-bold mytruncate2' title={FriendsWith.Title}>{FriendsWith.Title}</h1>
              </div>
            </div>
            <div>
              <MdDelete onClick={handleRemoveFriend} className='text-gray cursor-pointer' title='Delete Friend' size={30} />
            </div>
          </div>
          <div className='flex-grow bg-background2 mainBg overflow-hidden'>
            <Chat room={FriendsWith.room}/>
          </div>
          <form onSubmit={handleSendMessage} className='flex items-center'>
            <input onChange={handleInputChanges} value={message} className='w-full h-full bg-transparent outline-none border-0 p-4'
              type="text" placeholder='Type a message' />
            {showSendBtn &&
              <button type='submit' className='pr-3'>
                <VscSend size={20} />
              </button>
            }
          </form>
        </div>
      }
    </div>
  )
}
