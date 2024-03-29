import { useEffect, useRef } from "react";
import { LiaSearchSolid } from "react-icons/lia";
import Chat from "../UiComponents/Chat";


export default function LeftSection({ className = "" }) { 
  const inputRef = useRef(null);
  const inputFocus = () => {
    inputRef.current.focus();
  }
  useEffect(() => {
    inputFocus();
  }, []);
  return (
    <div className={`border-r-2 border-background1 pt-5 sm:px-5 px-2 ${className}`}>
      <h1 className="text-4xl font-bold">Chats</h1>
      <LiaSearchSolid onClick={inputFocus} className="relative top-12 left-3 cursor-text" />
      <input
        ref={inputRef}
        className="truncate pl-10 py-2 rounded-lg mt-5   text-gray bg-[#383838] focus:border-b-primary border-b-[#BBBBBB] border-b-2  outline-none w-full border-0 bg-transparent font-bold placeholder-gray mb-5"
        type="text" placeholder="Search or start a new chat"
      />
      <Chat Img="https://picsum.photos/200/300" Title="John Doe asd asd aaa aaaa aaa aa" Message="This is a long text that will be continuously truncated until the last character when decreasing" Time="12:00 PM" Counter={10} />
    </div>
  )
}
