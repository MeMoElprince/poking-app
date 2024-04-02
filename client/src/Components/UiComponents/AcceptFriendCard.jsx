import Person from '../../assets/Person.svg';
import { FcApproval } from "react-icons/fc";
import { FaRegTrashAlt } from "react-icons/fa";

export default function AcceptFriendCard({ Img, Title }) {

  const handleAcceptFrined = ()=>{
  }
  const handleDeleteFrined = ()=>{
  }
  return (
    <div className="flex gap-5 hover:bg-[#383838] p-2 rounded-lg select-none">
      <div className="min-w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden bg-[#414141] imgPlaceholder" style={{background:Person}}>
        <img className="w-full h-full" src={Img} alt="" />
      </div>
      <div className="flex flex-grow gap-2 relative overflow-hidden justify-between">
        <div className={`flex flex-col justify-center overflow-hidden`}>
          <div className='mytruncate font-bold' title={Title}>{Title}</div>
        </div>
        <div className='flex gap-5 h-full justify-between'>
          <div onClick={handleAcceptFrined} title='Accept this user' className="flex flex-col justify-center items-end rounded-xl">
            <FcApproval className="text-primary cursor-pointer text-2xl" />
          </div>
          <div onClick={handleDeleteFrined} title='Delete this user' className="flex flex-col justify-center items-end rounded-xl">
            <FaRegTrashAlt className="text-red-700 cursor-pointer text-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
