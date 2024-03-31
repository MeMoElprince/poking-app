import {createContext, useState} from 'react'

export const UserAuthCtx = createContext();

// eslint-disable-next-line react/prop-types
export default function UserAuthContext({children}) {
  const [LogedIn, setLogedIn] = useState(true);
  return (
    <UserAuthCtx.Provider value={{LogedIn, setLogedIn}}>
      {children}
    </UserAuthCtx.Provider>
  )
}
