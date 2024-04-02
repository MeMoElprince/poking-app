import {createContext, useState} from 'react'

export const BackDropCtx = createContext();

// eslint-disable-next-line react/prop-types
export default function BackDropContext({children}) {
  const [BackDropType, setBackDropType] = useState('Root');
  return (
    <BackDropCtx.Provider value={{BackDropType, setBackDropType}}>
      {children}
    </BackDropCtx.Provider>
  )
}
