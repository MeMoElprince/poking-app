import { useContext, useState } from 'react'
import Root from "./Root"
import { BackDropCtx } from '../Store/Context/BackDropContext'
import { UserAuthCtx } from '../Store/Context/UserAuthContext'
import { motion } from 'framer-motion'
import { LogOut } from '../Store/urls'
import LoadingSpinner from './UiComponents/LoadingSpinner'

const LogOutBackDrop = ({ setBackDropType, setLogedIn, Loading,setLoading }) => {
  const { Token } = useContext(UserAuthCtx);
  const LogOutFetch = async () => {
    const url = LogOut();
    setLoading(true)
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        },
      });
      const res = await response.json();
      setLoading(false)
      setLogedIn(false);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const handleClick = (type) => {
    if(Loading)return;
    if (type === 'Confirm') {
      // Log out
      LogOutFetch();
    } else {
      setBackDropType('Root')
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: '-50%' }}
      animate={{ opacity: 1, y: '-50%', x: '-50%' }}
      className='absolute top-1/2 left-1/2 z-50
        bg-black w-full sm:w-[500px]
        flex flex-col justify-between gap-10
        text-white p-10 font-bold
      '>
      <h1 className='text-xl'>Are you sure you want to log out ?</h1>
      <div className='flex justify-around w-full flex-wrap gap-2'>
        <div className='relative'>
          <button className={`w-[140px] bg-primary py-3 rounded-lg hover:scale-105 duration-150 ${Loading ?'pointer-events-none opacity-20':''}`} onClick={() => { handleClick('Confirm') }}>
            Log out
          </button>
        </div>
        <div className='relative'>
          <button className={`w-[140px] bg-background2 py-3 rounded-lg hover:scale-105 duration-150 ${Loading ?'pointer-events-none opacity-20':''}`} onClick={() => { handleClick('Cancle') }}>
            Cancle
          </button>
        </div>
      </div>
    </motion.div>
  )

}
export default function BackDropHandler() {
  const { BackDropType, setBackDropType } = useContext(BackDropCtx);
  const { setLogedIn } = useContext(UserAuthCtx);
  const [Loading,setLoading] = useState(false);

  const Style = BackDropType !== 'Root' ? 'pointer-events-none select-none' : '';
  const handleClick = () => {
    if(Loading)return;
    if (BackDropType !== 'Root')
      setBackDropType('Root')
  }
  return (
    <>
      {BackDropType === 'UserLogo' && <LogOutBackDrop  Loading={Loading} setLoading={setLoading} setLogedIn={setLogedIn} setBackDropType={setBackDropType} />}
      <div onClick={handleClick}>
        <div className={`${BackDropType !== 'Root' ? "brightness-[0.2]" : ""} ${Style}`}>
          <Root />
        </div>
      </div>
    </>
  )
}
