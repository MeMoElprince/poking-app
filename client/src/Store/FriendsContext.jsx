import {createContext, useState} from 'react'

export const FriendsCtx = createContext();

export default function FriendsContext({children}) {
  const [FriendsWith, setFriendsWith] = useState(false);
  const [RightSectionActive, setRightSectionActive] = useState(false);
  return (
    <FriendsCtx.Provider value={{FriendsWith, setFriendsWith, RightSectionActive, setRightSectionActive}}>
      {children}
    </FriendsCtx.Provider>
  )
}
