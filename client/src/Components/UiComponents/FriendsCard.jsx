import Person from '../../assets/Person.svg';
import { useContext } from 'react';
import { FriendsCtx } from '../../Store/Context/FriendsContext';

export default function Friends({ Img, id, Title, Message, Time, Counter, room }) {
  const { setFriendsWith, setRightSectionActive } = useContext(FriendsCtx);
  const handleClick = () => {
    if (window.innerWidth < 900)
      setRightSectionActive(true);
    setFriendsWith({ Img, Title, Message, Time, Counter, id, room });
  }
  return (
    <div onClick={handleClick} className="flex gap-5 hover:bg-[#383838] p-2 rounded-lg select-none">
      <div className="min-w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden bg-[#414141] imgPlaceholder" style={{ background: Person }}>
        {Img !== 'default.jpg' &&
          <img className="w-full h-full " src={Img} alt="" />
        }
      </div>
      <div className="flex flex-grow gap-2 relative overflow-hidden">
        <div className={`flex flex-col justify-between overflow-hidden`}>
          <div className='mytruncate font-bold' title={Title}>{Title}</div>
          <div className='mytruncate text-[#BBBBBB]' title={Message}>{Message}</div>
        </div>
        <div className="flex flex-col justify-center items-end absolute right-0 rounded-xl w-[80px] z-10  h-full">
          <div className="rounded-full text-center font-bold bg-primary text-black w-[40px] ">
            {Counter ? 'new' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
