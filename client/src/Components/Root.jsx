import { useState, useEffect, useContext } from 'react';

import Sidebar from "./RootComponents/Sidebar"
import LeftSection from "./RootComponents/LeftSection"
import RightSection from "./RootComponents/RightSection"
import AddSection from "./RootComponents/AddSection"
import Header from './RootComponents/Header';
import { FreindsCtx } from '../Store/FreindsContext';

const handleTurn = (Turn, RightSectionActive) => {
  return (
    <>
      {Turn === 1 &&
        <>
          {window.innerWidth >= 900 &&
            <>
              <LeftSection className="w-[380px] bg-background2" />
              <RightSection className="flex-grow bg-background2" />
            </>
          }
          {window.innerWidth < 900 &&
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
      }
      {Turn === 2 &&
        <>
          {window.innerWidth >= 900 &&
            <>
              <AddSection className="w-[380px] bg-background2" />
              <RightSection className="flex-grow bg-background2" />
            </>
          }
          {window.innerWidth < 900 &&
            <>
              {
                !RightSectionActive && <AddSection className="flex-grow bg-background2" />
              }
              {
                RightSectionActive && <RightSection className="flex-grow bg-background2" />
              }
            </>
          }
        </>
      }
      {Turn >= 3 &&
        <>
          <div className='flex justify-center items-center flex-grow bg-background2'>Coming Soon</div>
        </>
      }
    </>
  )
}

export default function Root() {
  const [mdScreen, setmdScreen] = useState(window.innerWidth < 900 ? false : true);
  const { RightSectionActive, setRightSectionActive } = useContext(FreindsCtx);
  const [Turn, setTurn] = useState(1);

  // mdScreen state here just to make sure the component re-renders when the window width changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
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
  useEffect(() => {
    if (Turn !== 1) {
      setRightSectionActive(false)
    }
  }, [Turn])
  return (
    <main className="h-screen overflow-hidden">
      <Header />
      <section className="h-[calc(100%-50px)] flex text-white bg-background1">
        <Sidebar Turn={Turn} setTurn={setTurn} className="min-w-[80px] bg-background1" />
        {handleTurn(Turn, RightSectionActive)}
      </section>
    </main>
  )
}
