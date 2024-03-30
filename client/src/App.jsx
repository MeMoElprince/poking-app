import { useEffect, useState, useContext } from 'react'
import Root from './Components/Pages/Root'
import Loading from './Components/Pages/Loading'
import Login from './Components/Pages/Login'
import FriendsContext from './Store/FriendsContext'
import UserAuthContext from './Store/UserAuthContext'
import { UserAuthCtx } from './Store/UserAuthContext'

function App() {
  const { LogedIn } = useContext(UserAuthCtx);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleWebsiteLoad = () => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
    window.addEventListener('load', handleWebsiteLoad)
    return () => {
      window.removeEventListener('load', handleWebsiteLoad)
    }
  }, [])
  return (
    <>
      {loading ?
        <Loading />
        :
        LogedIn ?
          <FriendsContext>
            <Root />
          </FriendsContext>
          :
          <Login />
      }
    </>
  )
}

export default App
