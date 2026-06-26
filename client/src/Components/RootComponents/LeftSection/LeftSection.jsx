import { useEffect, useRef, useState, useContext } from "react";
import { LiaSearchSolid } from "react-icons/lia";
import FriendsCard from "../../UiComponents/FriendsCard";
import { FriendListSkeleton } from "../../UiComponents/Skeleton";
import { motion } from 'framer-motion';
import { GetMyFriends } from '../../../Store/urls'
import useFetch from "../../CustomHooks/useFetch";
import { FriendsCtx } from "../../../Store/Context/FriendsContext";
import socket from '../../../Store/socket';
const url = GetMyFriends();

// eslint-disable-next-line react/prop-types
export default function LeftSection({ className = "" }) {
  const { data, Loading } = useFetch(url, 'GET');
  const { FriendsWith } = useContext(FriendsCtx);
  const [friends, setFriends] = useState([]);
  const [unread, setUnread] = useState({});
  const [search, setSearch] = useState('');

  const inputRef = useRef(null);
  const activeId = FriendsWith?.id;

  const inputFocus = () => inputRef.current && inputRef.current.focus();

  useEffect(() => {
    inputFocus();

    const onGetFriends = (list) => setFriends(list);

    // a message arrived for me from `senderId` in some other (or current) chat
    const onNotification = ({ message, senderId }) => {
      setFriends(prev => {
        const idx = prev.findIndex(f => f._id === senderId);
        if (idx === -1) return prev;
        const updated = { ...prev[idx], lastMessage: message, lastMessageAt: Date.now() };
        const next = [...prev];
        next.splice(idx, 1);
        return [updated, ...next]; // bump to top
      });
      setUnread(prev => senderId === activeId ? prev : { ...prev, [senderId]: (prev[senderId] || 0) + 1 });
    };

    socket.on('get-friends', onGetFriends);
    socket.on('message-notification', onNotification);
    return () => {
      socket.off('get-friends', onGetFriends);
      socket.off('message-notification', onNotification);
    };
  }, [activeId]);

  // initial / refreshed friends from the REST fetch
  useEffect(() => {
    if (data?.friends) setFriends(data.friends);
  }, [data]);

  // clear unread badge for the chat that's currently open
  useEffect(() => {
    if (activeId) setUnread(prev => (prev[activeId] ? { ...prev, [activeId]: 0 } : prev));
  }, [activeId]);

  const visible = search
    ? friends.filter(f => (f.name || '').toLowerCase().includes(search.toLowerCase()))
    : friends;

  return (
    <div className={`border-r-2 border-background1 pt-5 sm:pl-5 pl-2 ${className}`}>
      <h1 className="text-2xl font-bold">Chats</h1>
      <LiaSearchSolid onClick={inputFocus} className="relative top-7 left-3 cursor-text" />
      <div className="pr-2">
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="truncate pl-10 py-2 mb-5 rounded-lg text-gray bg-[#383838] focus:border-b-primary border-b-[#BBBBBB] border-b-2 outline-none w-full border-0 bg-transparent font-bold placeholder-gray"
          type="text" placeholder="Search or start a new chat"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-[calc(100%-120px)] space-y-3 overflow-auto sm:pr-5 pr-2">
        {Loading && <FriendListSkeleton />}
        {!Loading && (
          <>
            {friends.length === 0 && <div className='text-center text-lg text-gray mt-6'>Add a friend to start chatting</div>}
            {friends.length !== 0 && visible.length === 0 && <div className='text-center text-gray mt-6'>No matches for “{search}”</div>}
            {visible.map((item) => (
              <FriendsCard
                key={item._id}
                id={item._id}
                room={item.room}
                Img={item.imgName || 'default.jpg'}
                Title={item.name}
                Message={item.lastMessage || ''}
                Time={item.lastMessageAt || null}
                LastSeen={item.lastSeen || null}
                Counter={unread[item._id] || 0}
              />
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
}
