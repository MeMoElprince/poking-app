import { useEffect, useState, useContext } from 'react'
import Loading from './Components/Pages/Loading'
import Login from './Components/Pages/Login'
import FriendsContext from './Store/FriendsContext'
import { UserAuthCtx } from './Store/UserAuthContext'
import BackDropHandler from './Components/BackDropHandler'
import BackDropContext from './Store/BackDropContext'
import Root from './Components/Root'

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
            <BackDropContext>
              <BackDropHandler />
            </BackDropContext>
          </FriendsContext>
          :
          <Login />
      }
    </>
  )
}

export default App
