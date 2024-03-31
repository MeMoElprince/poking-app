/* eslint-disable react/prop-types */
import { memo, useContext } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import MessageCounter from "../UiComponents/MessageCounter";
import { CiSettings } from "react-icons/ci";
import { MdAddBox } from "react-icons/md";
import { MdMobileFriendly } from "react-icons/md";
import { BackDropCtx } from "../../Store/BackDropContext";

export default memo(function Sidebar({Turn,setTurn,className=""}) {
  const { setBackDropType } = useContext(BackDropCtx);
  const mainStyle = 'w-full flex justify-center items-center mainHover  py-5 relative'
  const changeTurn = (num) => {
    setTurn(num);
  }
  return (
    <aside className={`flex flex-col justify-between items-center select-none ${className}`}>
      <div className="w-full">
        <div onClick={()=>{changeTurn(1)}} title="Chat"
        className={`${Turn===1 ? 'bg-background2' : null} ${mainStyle}`}>
          <MessageCounter counter={10}/>
          <IoChatbubbleEllipsesOutline size={25}/>
        </div>
        <div onClick={()=>{changeTurn(2)}} title="Add Friend"
        className={`${Turn===2 ? 'bg-background2' : null} ${mainStyle}`}>
          <MdAddBox size={25}/>
        </div>
        <div onClick={()=>{changeTurn(3)}} title="Friend Requests"
        className={`${Turn===3 ? 'bg-background2' : null} ${mainStyle}`}>
          <MessageCounter counter={22}/>
          <MdMobileFriendly size={25}/>
        </div>
      </div>
      <div className="w-full">
        <div onClick={()=>{changeTurn(4)}} title="Settings"
        className={`${Turn===4 ? 'bg-background2' : null} ${mainStyle}`}>
          <CiSettings size={25}/>
        </div>
        <div 
        onClick={()=>{setBackDropType('UserLogo')}} 
        title="Logo"
        className={`${mainStyle}`}>
          <div className="w-[25px] h-[25px] overflow-hidden rounded-full bg-background2 imgPlaceholder">
            <img className="w-full h-full" src="https://picsum.photos/200/300" alt="" />
          </div>
        </div>
      </div>
    </aside>
  )
})
