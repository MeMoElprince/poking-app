import { useEffect, useRef, useState } from "react";
import { LiaSearchSolid } from "react-icons/lia";
import FriendsCard from "../../UiComponents/FriendsCard";
import { motion } from 'framer-motion';
import { GetMyFriends } from '../../../Store/urls'
import useFetch from "../../CustomHooks/useFetch";
import LoadingSpinner from "../../UiComponents/LoadingSpinner";
import socket from '../../../Store/socket';
const url = GetMyFriends();


// eslint-disable-next-line react/prop-types
export default function LeftSection({ className = "" }) {
  const { data, Loading } = useFetch(url, 'GET');
  const [friends, setFriends] = useState([]);
  const [friendId, setFriendId] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [counter, setCounter] = useState(0);

  const inputRef = useRef(null);
  const inputFocus = () => {
    inputRef.current.focus();
  }

  useEffect(() => {
    inputFocus();

    socket.on('get-friends', (data) => {
      setFriends(data);
    });

    socket.on('receive-message', (newMessage, friendId) => {
      setNewMessage(newMessage.message);
      setFriendId(friendId);
      setCounter(1);
    });

    return () => {
      socket.off('get-friends');
      socket.off('receive-message');
    }

  }, []);

  useEffect(() => {
    if (data) {
      setFriends(data.friends);
    }
  }, [data]);


  return (
    <div className={`border-r-2 border-background1 pt-5 sm:pl-5 pl-2 ${className}`}>
      <h1 className="text-2xl font-bold">Chats</h1>
      <LiaSearchSolid onClick={inputFocus} className="relative top-7   left-3 cursor-text" />
      <div className="pr-2">
        <input
          ref={inputRef}
          className="truncate pl-10 py-2 mb-5 rounded-lg text-gray bg-[#383838] focus:border-b-primary border-b-[#BBBBBB] border-b-2  outline-none w-full border-0 bg-transparent font-bold placeholder-gray"
          type="text" placeholder="Search or start a new chat"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-[calc(100%-120px)] space-y-3 overflow-auto sm:pr-5 pr-2">
        {
          Loading &&
          <div className='flex justify-center items-center'>
            <LoadingSpinner />
          </div>
        }
        {
          !Loading && data &&
          <>
            {friends.length === 0 && <div className='text-center text-lg'>Add friend first</div>}
            {friends.length !== 0 &&
               friends.map((item) => {
                if(item._id === friendId){
                  return ( 
                    <div key={item._id} onClick={()=>setFriendId('')}>
                      <FriendsCard  room={item.room} id={item._id} Img="default.jpg" Title={item.name} Message={newMessage} Time="12:00 PM" Counter={counter} />
                    </div>
                  )
                } else {
                  return ( 
                    <FriendsCard room={item.room} key={item._id} id={item._id} Img="default.jpg" Title={item.name} Message='' Time="12:00 PM" Counter={0} />
                    )
                }
               }
              )
            }
          </>
        }
      </motion.div>

    </div>
  )
}
