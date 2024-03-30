import {createContext, useState} from 'react'

export const FreindsCtx = createContext();

export default function FreindsContext({children}) {
  const [FreindsWith, setFreindsWith] = useState(false);
  const [RightSectionActive, setRightSectionActive] = useState(false);
  return (
    <FreindsCtx.Provider value={{FreindsWith, setFreindsWith, RightSectionActive, setRightSectionActive}}>
      {children}
    </FreindsCtx.Provider>
  )
}
