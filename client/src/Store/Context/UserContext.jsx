import { createContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import { disconnectSocket } from '../socket';

export const UserCtx = createContext();

// eslint-disable-next-line react/prop-types
export default function UserContext({ children }) {
  const [LogedIn, setLogedIn] = useState(!!Cookies.get('token'));
  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Id, setId] = useState('');
  const [userName, setUserName] = useState('');
  const [Image, setImage] = useState('');
  const [RequestChanged, setRequestChanged] = useState(false);
  const [Token, setToken] = useState(Cookies.get('token'));
  useEffect(()=>{
    if(!LogedIn){
      disconnectSocket();
      Cookies.remove('token');
      setToken('');
      setEmail('');
      setName('');
      setImage('');
      setId('');
      setUserName('');
    }else{
      Cookies.set('token', Token, { expires: 40 });
    }
  },[LogedIn])
  return (
    <UserCtx.Provider value={{
      LogedIn, setLogedIn,
      Email, setEmail,
      Name, setName,
      userName, setUserName,
      Token, setToken,
      Image, setImage,
      Id, setId,
      RequestChanged, setRequestChanged
    }}>
      {children}
    </UserCtx.Provider>
  )
}
