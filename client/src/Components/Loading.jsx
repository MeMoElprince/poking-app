import logo from '../assets/logo.png';
import {motion} from 'framer-motion';
export default function Loading() {
  return (
    <motion.div
      initial={{ backgroundColor: '#2C2C2C' }}
      animate={{ backgroundColor: '#202020' }}
      transition={{ duration: 2 }}
      className='h-screen flex flex-col justify-center items-center'>
      <motion.img
        initial={{ scale: 0.8}}
        animate={{ scale: 1}}
        transition={{ duration: 2 }}
        src={logo} alt="logo" />
      <div className='mt-10 w-[200px] h-[4px] bg-background2 rounded-full overflow-hidden'>
        <motion.div
          initial={{x: 0}}
          animate={{x: [0, 100, 150, 100 , 0, -100, -150, -100 ,0]}}
          transition={{repeat: Infinity, duration: 1.5}}
          className='w-full h-full bg-primary'>
        </motion.div>
      </div>
    </motion.div>
  )
}
