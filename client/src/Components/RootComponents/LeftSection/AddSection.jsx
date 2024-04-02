import { useEffect, useRef, useContext, useState } from "react";
import { MdEmail } from "react-icons/md";
import { motion } from 'framer-motion';
import AddFriendCard from "../../UiComponents/AddFriendCard";
import { GetAUser } from "../../../Store/urls";
import { UserAuthCtx } from "../../../Store/Context/UserAuthContext";
import LoadingSpinner from "../../UiComponents/LoadingSpinner";

// eslint-disable-next-line react/prop-types
export default function AddSection({ className = "" }) {
  const { Token } = useContext(UserAuthCtx);
  const [Loading, setLoading] = useState(false);
  const [Data, setData] = useState('No user');
  const inputRef = useRef(null);

  const inputFocus = () => {
    inputRef.current.focus();
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = GetAUser(inputRef.current.value);
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        },
      });
      const res = await response.json();
      setLoading(false);
      if (res.status === 'success') {
        setData(res.user);
      } else {
        setData('No such user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  useEffect(() => {
    inputFocus();
  }, []);
  return (
    <div className={`border-r-2 border-background1 pt-5 sm:pl-5 pl-2 ${className}`}>
      <h1 className="text-2xl font-bold">Add Friend</h1>
      <MdEmail onClick={inputFocus} className="relative top-7   left-3 cursor-text" />
      <div className="pr-2">
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="truncate pl-10 py-2 mb-5 rounded-lg text-gray bg-[#383838] focus:border-b-primary border-b-[#BBBBBB] border-b-2  outline-none w-full border-0 bg-transparent font-bold placeholder-gray"
            type="text" placeholder="Search for Friends by email"
          />
        </form>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-[calc(100%-120px)] space-y-3 overflow-auto sm:pr-5 pr-2">
        {/* Searched and data is loading */}
        {
          Loading &&
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        }
        {/* Searched and There is no user with that email */}
        {
          !Loading && Data === 'No such user' &&
          <div className="flex justify-center items-center">
            <h1 className="text-xl font-bold text-white">No such user</h1>
          </div>
        }
        {/* Searched and get a user */}
        {
          !Loading && Data !== 'No user' && Data !== 'No such user'&&
            <AddFriendCard Img="https://picsum.photos/200/300" Title={Data.name} id={Data._id} />
        }
        {/* not searched yet */}
        {/* display nothing */}
      </motion.div>
    </div>
  )
}
