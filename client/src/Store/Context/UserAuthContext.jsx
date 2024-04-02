import { createContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie';

export const UserAuthCtx = createContext();

// eslint-disable-next-line react/prop-types
export default function UserAuthContext({ children }) {
  const [LogedIn, setLogedIn] = useState(true);
  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Image, setImage] = useState('');
  const [Token, setToken] = useState(Cookies.get('token'));
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGI1NzQ3NGEzZmYwMDdiOTI5NTdlZCIsImlhdCI6MTcxMjAyMDA2MCwiZXhwIjoxNzE1NDc2MDYwfQ.71QlLHPpyQ3QZtGSt_gu3OEus2wEU7fbsqqx5DpZPTI"
  useEffect(()=>{
    if(!LogedIn){
      Cookies.remove('token');
      setToken('');
      setEmail('');
      setName('');
      setImage('');
    }else{
      Cookies.set('token', Token, { expires: 40 });
    }
  },[LogedIn])
  return (
    <UserAuthCtx.Provider value={{
      LogedIn, setLogedIn,
      Email, setEmail,
      Name, setName,
      Token, setToken,
      Image, setImage
    }}>
      {children}
    </UserAuthCtx.Provider>
  )
}
