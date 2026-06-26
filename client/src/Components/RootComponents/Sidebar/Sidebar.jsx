/* eslint-disable react/prop-types */
import { memo, useContext, useEffect, useState } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { MdAddBox } from "react-icons/md";
import { MdMobileFriendly } from "react-icons/md";
import { BackDropCtx } from "../../../Store/Context/BackDropContext";
import { UserCtx } from "../../../Store/Context/UserContext";
import MessageCounter from "../../UiComponents/MessageCounter";
import socket from "../../../Store/socket";
import bell from '../../../assets/bell.wav';

export default memo(function Sidebar({ Turn, setTurn, className = "" }) {
  const [friendReq, setFriendReq] = useState(0);
  const { setBackDropType } = useContext(BackDropCtx);
  const { Name, Image, Id, RequestChanged } = useContext(UserCtx);

  const navClass = (active) =>
    `w-full flex justify-center items-center py-5 relative transition-colors duration-150
     focus:outline-none focus:bg-background2
     ${active ? 'bg-background2 text-primary before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-primary' : 'mainHover text-white'}`;

  useEffect(() => {
    const onCount = (data) => {
      if (data > 0) new Audio(bell).play().catch(() => {});
      setFriendReq(data);
    };
    socket.on('number-friend-request', onCount);
    return () => { socket.off('number-friend-request', onCount); };
  }, [Id]);

  useEffect(() => {
    setFriendReq(prev => Math.max(0, prev - 1));
  }, [RequestChanged]);

  return (
    <aside className={`flex flex-col justify-between items-center select-none ${className}`}>
      <div className="w-full">
        <button onClick={() => setTurn(1)} title="Chat" aria-label="Chats" className={navClass(Turn === 1)}>
          <IoChatbubbleEllipsesOutline size={25} />
        </button>
        <button onClick={() => setTurn(2)} title="Add Friend" aria-label="Add friend" className={navClass(Turn === 2)}>
          <MdAddBox size={25} />
        </button>
        <button onClick={() => setTurn(3)} title="Friends Request" aria-label="Friend requests" className={navClass(Turn === 3)}>
          <MessageCounter counter={friendReq} />
          <MdMobileFriendly size={25} />
        </button>
      </div>
      <div className="w-full">
        <button onClick={() => setTurn(4)} title="Settings" aria-label="Settings" className={navClass(Turn === 4)}>
          <CiSettings size={25} />
        </button>
        <button onClick={() => setBackDropType('UserLogo')} title={Name} aria-label="Profile and logout" className={navClass(false)}>
          <div className="w-[25px] h-[25px] overflow-hidden rounded-full bg-background2 imgPlaceholder">
            {Image !== 'default.jpg' &&
              <img className="w-full h-full" src={Image} alt="" />
            }
          </div>
        </button>
      </div>
    </aside>
  );
});
