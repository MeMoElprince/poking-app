import Person from '../../assets/Person.svg';
import { CiSquarePlus } from "react-icons/ci";
import { UserAuthCtx } from '../../Store/Context/UserAuthContext';
import { useContext, useState } from 'react';
import { AddFriend } from '../../Store/urls';
import { toast } from 'react-toastify';
import socket from '../../Store/socket';
import LoadingSpinner from './LoadingSpinner';

export default function AddFriendCard({ Img, Title, id }) {
  const { Token } = useContext(UserAuthCtx);
  const [Loading, setLoading] = useState(false);
  const handleAddFriend = async () => {
    const url = AddFriend(id);
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
      if(data.status === 'success'){
        socket.emit('number-friend-request', id)
      }
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
      console.errorg('Error:', e);
    }
  }
  return (
    <div className='relative'>
      <div className={`flex gap-5 hover:bg-[#383838] p-2 rounded-lg select-none ${Loading ? "pointer-events-none opacity-20" : "pointer-events-auto"}`}>
        <div className="min-w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden bg-[#414141] imgPlaceholder" style={{ background: Person }}>
          <img className="w-full h-full" src={Img} alt="" />
        </div>
        <div className="flex flex-grow gap-2 relative overflow-hidden">
          <div className={`flex flex-col justify-center overflow-hidden`}>
            <div className='mytruncate font-bold' title={Title}>{Title}</div>
          </div>
          <div onClick={handleAddFriend} title='Add this user' className="flex flex-col justify-center items-end absolute right-0 rounded-xl w-[80px] z-10  h-full">
            <CiSquarePlus className="text-primary cursor-pointer" size={30} />
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
