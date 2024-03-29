import { useEffect, useRef } from "react";
import { LiaSearchSolid } from "react-icons/lia";
import Chat from "../UiComponents/Chat";
import {motion} from 'framer-motion';


export default function LeftSection({ className = "" }) { 
  const inputRef = useRef(null);
  const inputFocus = () => {
    inputRef.current.focus();
  }
  useEffect(() => {
    inputFocus();
  }, []);
  return (
    <div className={`border-r-2 border-background1 pt-5 sm:pl-5 pl-2 ${className}`}>
      <h1 className="text-4xl font-bold">Chats</h1>
      <LiaSearchSolid onClick={inputFocus} className="relative top-7   left-3 cursor-text" />
      <input
        ref={inputRef}
        className="truncate pl-10 py-2 mb-5 rounded-lg text-gray bg-[#383838] focus:border-b-primary border-b-[#BBBBBB] border-b-2  outline-none w-full border-0 bg-transparent font-bold placeholder-gray"
        type="text" placeholder="Search or start a new chat"
      />
      <motion.div
        initial={{ opacity: 0, y:10 }}
        animate={{ opacity: 1, y:0 }}
        className="h-[calc(100%-140px)] overflow-auto sm:pr-5 pr-2">
        <Chat Img="https://picsum.photos/200/300" Title="SomeName" Message="hello World" Time="12:00 PM" Counter={10} />
        <Chat Img="https://picsum.photos/200/300" Title="SomeName" Message="hello World" Time="12:00 PM" Counter={10} />
        <Chat Img="https://picsum.photos/200/300" Title="SomeName" Message="hello World" Time="12:00 PM" Counter={10} />
        <Chat Img="https://picsum.photos/200/300" Title="SomeName" Message="hello World" Time="12:00 PM" Counter={10} />
        <Chat Img="https://picsum.photos/200/300" Title="SomeName" Message="hello World" Time="12:00 PM" Counter={10} />
        <Chat Img="https://picsum.photos/200/300" Title="SomeName" Message="hello World" Time="12:00 PM" Counter={10} />
        <Chat Img="https://picsum.photos/200/300" Title="SomeName" Message="hello World" Time="12:00 PM" Counter={10} />
        <Chat Img="https://picsum.photos/200/300" Title="SomeName" Message="hello World" Time="12:00 PM" Counter={10} />
        <Chat Img="https://picsum.photos/200/300" Title="SomeName" Message="hello World" Time="12:00 PM" Counter={10} />
        <Chat Img="https://picsum.photos/200/300" Title="SomeName" Message="hello World" Time="12:00 PM" Counter={10} />
      </motion.div>
    </div>
  )
}
