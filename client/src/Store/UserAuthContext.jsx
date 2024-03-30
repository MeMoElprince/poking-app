import {createContext, useState} from 'react'

export const UserAuthCtx = createContext();

export default function UserAuthContext({children}) {
  const [LogedIn, setLogedIn] = useState(false);
  return (
    <UserAuthCtx.Provider value={{LogedIn, setLogedIn}}>
      {children}
    </UserAuthCtx.Provider>
  )
}
