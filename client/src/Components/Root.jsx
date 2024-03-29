import { useState, useEffect } from 'react';

import Logo from '../assets/logo.png';
import Sidebar from "./RootComponents/Sidebar"
import LeftSection from "./RootComponents/LeftSection"
import RightSection from "./RootComponents/RightSection"
import { FaArrowLeft } from "react-icons/fa";
import { motion } from 'framer-motion'


export default function Root() {
  const [mdScreen, setmdScreen] = useState(window.innerWidth < 768 ? false : true);
  const [RightSectionActive, setRightSectionActive] = useState(false);
  const [Turn, setTurn] = useState(1);

  // mdScreen state here just to make sure the component re-renders when the window width changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setmdScreen(false);
      } else {
        setmdScreen(true);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])
  useEffect(()=>{
    if(Turn !== 1){
      setRightSectionActive(false)
    }
  },[Turn])
  return (
    <main className="h-screen">
      <header className={`h-[50px] flex items-center bg-background1 ${(RightSectionActive && window.innerWidth < 768) ? 'px-0' : 'px-2'}`}>
        <div className='flex justify-center items-center h-full'>
          {
            (RightSectionActive && window.innerWidth < 768) &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => { setRightSectionActive(prev => !prev) }}
              className="flex justify-center items-center text-gray w-[50px] mainHover h-full">
              <FaArrowLeft />
            </motion.div>
          }
          <img className="w-6 mr-2" src={Logo} alt="Logo" />
          <h1 className="text-white">WhosApp</h1>
          <button onClick={() => { setRightSectionActive(prev => !prev) }}>click me</button>
        </div>
      </header>
      <section className="h-[calc(100%-50px)] flex text-white bg-background1">
        <Sidebar Turn={Turn} setTurn={setTurn} className="min-w-[80px] bg-background1" />
        {
          Turn === 1 ?
          <>
            {window.innerWidth >= 768 &&
              <>
                <LeftSection className="w-[30%] bg-background2" />
                <RightSection className="flex-grow bg-background2" />
              </>
            }
            {window.innerWidth < 768 &&
              <>
                {
                  !RightSectionActive && <LeftSection className="flex-grow bg-background2" />
                }
                {
                  RightSectionActive && <RightSection className="flex-grow bg-background2" />
                }
              </>
            }
          </>
          :
          <>
            <div className='flex justify-center items-center flex-grow bg-background2'>Coming Soon</div>
          </>
        }

      </section>
    </main>
  )
}
