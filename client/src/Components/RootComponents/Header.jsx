import { useContext } from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { motion } from 'framer-motion'
import { FriendsCtx } from '../../Store/FriendsContext';
import Logo from '../../assets/logo.png';


export default function Header() {
  const {RightSectionActive, setRightSectionActive} = useContext(FriendsCtx);
  return (
    <header className={`h-[50px] flex items-center bg-background1 ${(RightSectionActive && window.innerWidth < 900) ? 'px-0' : 'px-2'}`}>
      <div className='flex justify-center items-center h-full'>
        {
          (RightSectionActive && window.innerWidth < 900) &&
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => { setRightSectionActive(prev => !prev) }}
            className="flex justify-center items-center text-gray w-[80px] mainHover h-full">
            <FaArrowLeft />
          </motion.div>
        }
        <img className="w-6 mr-2" src={Logo} alt="Logo" />
        <h1 className="text-white">Piking App</h1>
      </div>
    </header>
  )
}
