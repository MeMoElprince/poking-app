import Logo from '../../assets/logo.png';
import { CiLock } from "react-icons/ci";
import {motion} from 'framer-motion';
export default function RightSection({ className = "" }) {

  const Empty = () => {
    return (
      <motion.section
        initial={{ opacity: 0, backgroundColor: '#202020' }}
        animate={{ opacity: 1, backgroundColor: '#2C2C2C' }}
        transition={{ duration: 1 }}
        className='flex flex-col justify-between items-center px-5 h-full'>
        <div></div>
        <div className='flex flex-col gap-4 items-center text-center pointer-events-none'>
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            src={Logo} className='w-32 opacity-20 select-none' alt="logo" />
          <h1 className='text-2xl'>WhosApp</h1>
          <p className='text-gray'>
            Send and receive messages without a phone number only with email. <br />
            Use WhosApp on your browser and phone at the same time.
          </p>
        </div>
        <div className='text-gray mb-10 flex text-center items-center gap-2'>
          <CiLock/> End-to-end encrypted
        </div>
      </motion.section>
    )
  }
  return (
    <div className={`${className}`}>
      <Empty />
    </div>
  )
}
