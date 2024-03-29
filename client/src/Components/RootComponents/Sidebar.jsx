import { memo } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import MessageCounter from "../UiComponents/MessageCounter";
import { CiSettings } from "react-icons/ci";
import Logo from "../../assets/logo.png";

export default memo(function Sidebar({Turn,setTurn,className=""}) {
  const mainStyle = 'w-full flex justify-center items-center mainHover  py-5 relative'
  const changeTurn = (num) => {
    setTurn(num);
  }
  return (
    <aside className={`flex pr-2 pt-2 flex-col justify-between items-center select-none ${className}`}>
      <div className="w-full">
        <div onClick={()=>{changeTurn(1)}} 
        className={`${Turn===1 ? 'bg-background2' : null} ${mainStyle}`}>
          <MessageCounter counter={5}/>
          <IoChatbubbleEllipsesOutline size={30}/>
        </div>
      </div>
      <div className="w-full">
        <div onClick={()=>{changeTurn(2)}} 
        className={`${Turn===2 ? 'bg-background2' : null} ${mainStyle}`}>
          <CiSettings size={30}/>
        </div>
        <div 
        // onClick={()=>{changeTurn(3)}} 
        className={`${Turn===3 ? 'bg-background2' : null} ${mainStyle}`}>
          logo
        </div>
      </div>
    </aside>
  )
})
