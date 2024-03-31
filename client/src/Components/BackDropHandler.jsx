import { useContext } from 'react'
import Root from "./Root"
import { BackDropCtx } from '../Store/BackDropContext'
import { motion, AnimatePresence } from 'framer-motion'

const LogOutBackDrop = ({ setBackDropType }) => {
  const handleClick = (type) => {
    if(type==='Confirm'){
      // Log out
      console.log('Log out');
    }else{
      setBackDropType('Root')
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 , x:'-50%' }}
      animate={{ opacity: 1, y: '-50%' , x:'-50%' }}
      className='absolute top-1/2 left-1/2 z-50
        bg-black w-full sm:w-[500px]
        flex flex-col justify-between gap-10
        text-white p-10 font-bold
      '>
      <h1 className='text-xl'>Are you sure you want to log out ?</h1>
      <div className='flex justify-around w-full flex-wrap gap-2'>
        <button className='w-[140px] bg-primary py-3 rounded-lg hover:scale-105 duration-150' onClick={()=>{handleClick('Confirm')}}>
          Log out
        </button>
        <button className='w-[140px] bg-background2 py-3 rounded-lg hover:scale-105 duration-150' onClick={()=>{handleClick('Cancle')}}>
          Cancle
        </button>
      </div>
    </motion.div>
  )

}
export default function BackDropHandler() {
  const { BackDropType, setBackDropType } = useContext(BackDropCtx);

  const Style = BackDropType !== 'Root' ? 'pointer-events-none select-none' : '';
  const handleClick = () => {
    if (BackDropType !== 'Root') 
      setBackDropType('Root')
  }
  return (
    <>
      {BackDropType === 'UserLogo' && <LogOutBackDrop setBackDropType={setBackDropType} />}
      <div onClick={handleClick}>
        <div className={`${BackDropType !== 'Root'?"brightness-[0.2]":""} ${Style}`}>
          <Root />
        </div>
      </div>
    </>
  )
}
