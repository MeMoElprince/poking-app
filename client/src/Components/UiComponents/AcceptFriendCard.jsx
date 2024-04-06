import { useState, useContext } from 'react';
import Person from '../../assets/Person.svg';
import { FcApproval } from "react-icons/fc";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import { AcceptFriend, DeclineFriend } from '../../Store/urls';
import LoadingSpinner from './LoadingSpinner';
import { UserCtx } from '../../Store/Context/UserContext';

export default function AcceptFriendCard({ Img, Title, id }) {
  const [Loading, setLoading] = useState(false);
  const { Token } = useContext(UserCtx);
  const Fetching = async (url) => {
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        },
      });
      const data = await response.json();
      setLoading(false);
      toast(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (e) {
      console.error('Error:', e);
    }
  }
  const handleAcceptFriend = () => {
    Fetching(AcceptFriend(id));
  }
  const handleDeleteFriend = () => {
    Fetching(DeclineFriend(id));
  }
  return (
    <div className='relative'>
      <div className={`flex gap-5 hover:bg-[#383838] p-2 rounded-lg select-none ${Loading ? "pointer-events-none opacity-20" : "pointer-events-auto"}`}>
        <div className="min-w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden bg-[#414141] imgPlaceholder" style={{ background: Person }}>
          {Img !== 'default.jpg' &&
            <img className="w-full h-full " src={Img} alt="" />
          }
        </div>
        <div className="flex flex-grow gap-2 relative overflow-hidden justify-between">
          <div className={`flex flex-col justify-center overflow-hidden`}>
            <div className='mytruncate font-bold' title={Title}>{Title}</div>
          </div>
          <div className='flex gap-5 h-full justify-between'>
            <div onClick={handleAcceptFriend} title='Accept this user' className="flex flex-col justify-center items-end rounded-xl">
              <FcApproval className="text-primary cursor-pointer text-2xl" />
            </div>
            <div onClick={handleDeleteFriend} title='Delete this user' className="flex flex-col justify-center items-end rounded-xl">
              <FaRegTrashAlt className="text-red-700 cursor-pointer text-2xl" />
            </div>
          </div>
        </div>
      </div>
      {
        Loading &&
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <LoadingSpinner />
        </div>
      }
    </div>
  )
}
