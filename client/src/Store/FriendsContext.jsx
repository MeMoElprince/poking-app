import {createContext, useState, useEffect} from 'react'

export const FriendsCtx = createContext();

// eslint-disable-next-line react/prop-types
export default function FriendsContext({children}) {
  const [FriendsWith, setFriendsWith] = useState(false);
  const [RightSectionActive, setRightSectionActive] = useState(false);

  useEffect(() => {
    const func = (e)=>{
      if(e.key === 'Escape'){
        setRightSectionActive(false);
      }
    }
    window.addEventListener('keydown',func)
    return () => {
      window.removeEventListener('keydown',func)
    }
  },[]);
  return (
    <FriendsCtx.Provider value={{FriendsWith, setFriendsWith, RightSectionActive, setRightSectionActive}}>
      {children}
    </FriendsCtx.Provider>
  )
}
