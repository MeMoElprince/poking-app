import { useState, useEffect, useContext } from 'react';

import Sidebar from "./RootComponents/Sidebar/Sidebar"
import LeftSection from "./RootComponents/LeftSection/LeftSection"
import RightSection from "./RootComponents/RightSection/RightSection"
import AcceptSection from "./RootComponents/LeftSection/AcceptSection"
import AddSection from "./RootComponents/LeftSection/AddSection"
import Header from './RootComponents/Header/Header';
import Settings from './RootComponents/RightSection/Settings';
import { FriendsCtx } from '../Store/Context/FriendsContext';
import useFetch from './CustomHooks/useFetch';
import { UserCtx } from '../Store/Context/UserContext';
import { GetMyData } from '../Store/urls';
import LoadingPage from './Pages/LoadingPage'
import { connectSocket } from '../Store/socket';

const url = GetMyData();

const handleTurn = (Turn, RightSectionActive) => {
  const TypeRight = RightSection;
  
  const holder = (name) => {
    const TypeLeft =
      name === "LeftSection" ? LeftSection :
        name === "AddSection" ? AddSection :
          name === "AcceptSection" ? AcceptSection :
              LeftSection;
    return (
      <TypeLeft className={`${!RightSectionActive ? "block" : "hidden"} main:min-w-[380px] main:max-w-[380px] flex-grow bg-background2`} />
    )
  }
  return (
    <>
      {Turn === 1 && holder('LeftSection')}
      {Turn === 2 && holder('AddSection')}
      {Turn === 3 && holder('AcceptSection')}
      {Turn === 4 && <Settings />}
      {Turn >= 5 &&
        <>
          <div className='flex justify-center items-center flex-grow bg-background2'>Coming Soon</div>
        </>
      }
      {Turn >= 1 && Turn <= 3 && <TypeRight className={`${RightSectionActive ? "block" : "hidden"} main:block flex-grow bg-background2`} />}
    </>
  )
}

export default function Root() {
  const { RightSectionActive, setRightSectionActive } = useContext(FriendsCtx);
  const [ Turn, setTurn ] = useState(1);
  const { setName, setImage, setUserName, setId, setLogedIn, Token } = useContext(UserCtx);
  const { data, Loading } = useFetch(url, 'GET');

  // open the shared socket once we have an auth token
  useEffect(() => {
    connectSocket(Token);
  }, [Token]);
  // mdScreen state here just to make sure the component re-renders when the window width changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setRightSectionActive(false)
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
  useEffect(() => {
    if (data) {
      setName(data?.user?.name);
      setImage(data?.user?.imgName);
      setUserName(data?.user?.userName);
      setId(data?.user?._id);
    }
  }, [data])

  // if /me couldn't be validated (no/expired token or API unreachable), go to Login
  useEffect(() => {
    if (!Loading && (!data || data.status !== 'success')) {
      setLogedIn(false);
    }
  }, [Loading, data])

  if (Loading) {
    return (
      <LoadingPage />
    )
  }

  return (
    <main className="h-screen overflow-hidden">
      <Header />
      <section className="h-[calc(100dvh-50px)] flex text-white bg-background1">
        <Sidebar Turn={Turn} setTurn={setTurn} className="min-w-[60px] bg-background1" />
        {handleTurn(Turn, RightSectionActive)}
      </section>
    </main>
  )
}
